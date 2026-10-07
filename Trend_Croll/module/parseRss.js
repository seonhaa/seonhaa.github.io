// module/parseRss.js
const xml2js = require("xml2js");
// XML 파싱 후 뉴스 링크 포함 데이터 추출
const parseRSS = async (xml) => {
  try {
    const parser = new xml2js.Parser({ explicitArray: false });
    const result = await parser.parseStringPromise(xml);
    const items = result.rss.channel.item;
    const arrayItems = Array.isArray(items) ? items.slice(0, 5) : [items];

    return arrayItems.map((item) => {
      const newsItem = item["ht:news_item"];
      const news = Array.isArray(newsItem) ? newsItem[0] : newsItem;
      return {
        ...item,
        realLink: news?.["ht:news_item_url"],
        snippet: news?.["ht:news_item_snippet"] || "요약 없음",
        newsTitle: news?.["ht:news_item_title"] || "뉴스 제목 없음",
      };
    });
  } catch (err) {
    console.error("[XML 파싱 실패]", err.message);
    return [];
  }
};

module.exports = parseRSS;
