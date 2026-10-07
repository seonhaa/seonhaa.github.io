const axios = require('axios');
const xml2js = require('xml2js');
const cheerio = require('cheerio');

// RSS 피드 가져오기
const fetchRSSFeed = async (url) => {
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (err) {
    console.error('RSS 가져오기 실패:', err.message);
    return null;
  }
};

// XML -> JSON 파싱
const parseXML = async (xml) => {
  try {
    const parser = new xml2js.Parser({
      explicitArray: false,
      mergeAttrs: true,
    });
    const result = await parser.parseStringPromise(xml);
    return result;
  } catch (err) {
    console.error('XML 파싱 실패:', err.message);
    return null;
  }
};

// 뉴스 기사 본문 일부 크롤링 (<p> 기준)
const crawlNewsBody = async (url) => {
  try {
    const res = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/114.0.0.0 Safari/537.36',
        'Accept-Language': 'ko,en;q=0.9',
      },
      timeout: 5000,
      maxRedirects: 3,
      validateStatus: () => true, // HTTP 에러 상태도 수동 처리
    });

    if (res.status === 403) return '[403 금지됨: 서버가 봇 차단]';
    if (res.status === 404) return '[404 없음: 기사 URL이 유효하지 않음]';
    if (res.status >= 500) return `[${res.status} 서버 오류]`;

    const $ = cheerio.load(res.data);
    const paragraphs = $('p')
      .map((i, el) => $(el).text().trim())
      .get()
      .filter((t) => t.length > 30)
      .slice(0, 3); // 상위 3개 문단만

    if (paragraphs.length === 0)
      return '[본문 없음 또는 JavaScript 렌더링된 페이지]';

    return paragraphs.join('\n');
  } catch (err) {
    if (err.code === 'ECONNABORTED') return '[Timeout: 응답 지연]';
    if (err.code === 'ENOTFOUND') return '[도메인 접속 실패]';
    return `[예외 발생: ${err.message}]`;
  }
};

// 트렌드 정보 출력
const printDetailedTrends = async (data) => {
  const items = data?.rss?.channel?.item;
  if (!items) return;

  const trendItems = Array.isArray(items) ? items : [items];

  for (let i = 0; i < trendItems.length; i++) {
    const item = trendItems[i];
    console.log(`\n${i + 1}. 🔥 ${item.title}`);
    console.log(`   🔍 검색량: ${item['ht:approx_traffic'] || '정보 없음'}`);
    console.log(`   🕓 시간: ${item.pubDate}`);

    const news = item['ht:news_item'];
    if (!news) {
      console.warn(`   ⛔️ 관련 뉴스 없음`);
      continue;
    }
    const newsItems = Array.isArray(news) ? news : [news];

    for (let j = 0; j < newsItems.length; j++) {
      const n = newsItems[j];

      const url = n['ht:news_item_url'];
      const title = n['ht:news_item_title'] || '제목 없음';
      const snippet = n['ht:news_item_snippet'] || '요약 없음';

      console.log(`   📰 관련뉴스 ${j + 1}: ${title}`);
      console.log(`      👉 ${url}`);
      console.log(`      📌 요약: ${snippet}`);

      // 기사 본문 크롤 시도
      const body = await crawlNewsBody(url);
      console.log(`      📖 기사 본문:\n${body}`);
    }
  }
};

// 실행 함수
const run = async () => {
  const url = 'https://trends.google.com/trending/rss?geo=KR';
  const xml = await fetchRSSFeed(url);
  if (!xml) return;

  const parsed = await parseXML(xml);
  if (!parsed) return;

  await printDetailedTrends(parsed);
};

run();
