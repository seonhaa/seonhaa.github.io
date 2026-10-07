// module/runWatcher.js

// 필요한 모듈 불러오기
// const path = require("path");
const fetchRSS = require("./fetchRss");
const parseRSS = require("./parseRss");
const { loadOldData, saveToFile } = require("./oldData");
const crawlNewsBody = require("./newsBody");

// 변경 감지 함수
const detectChange = (oldData, newData) => {
  return !oldData || JSON.stringify(oldData) !== JSON.stringify(newData);
};

// runWatcher 함수 정의
const runWatcher = async () => {
  console.log("\n🚀 [runWatcher] 실행 시작");

  const xml = await fetchRSS();
  if (!xml) return;

  const parsedItems = await parseRSS(xml);
  if (!parsedItems || parsedItems.length === 0) {
    console.log("[RSS 아이템 없음]");
    return;
  }

  // 본문 크롤링
  for (const item of parsedItems) {
    if (item.realLink) {
      item.newsBody = await crawlNewsBody(item.realLink);
    } else {
      item.newsBody = "[관련 뉴스 URL 없음]";
    }
  }

  // 검색량 문자열을 숫자로 변환하는 함수
  const parseTraffic = (text) => {
    if (!text) return 0;
    const cleaned = text.replace(/[^\d]/g, "");
    const num = parseInt(cleaned, 10);
    if (text.includes("천")) return num * 1000;
    if (text.toLowerCase().includes("k")) return num * 1000;
    if (text.toLowerCase().includes("m")) return num * 1000000;
    return isNaN(num) ? 0 : num;
  };

  // 검색량 기준 정렬
  parsedItems.sort((a, b) => {
    const trafficA = parseTraffic(a["ht:approx_traffic"]);
    const trafficB = parseTraffic(b["ht:approx_traffic"]);
    return trafficB - trafficA;
  });

  const top5Sorted = parsedItems.slice(0, 5);

  const top5 = top5Sorted.map((item) => ({
    title: item.title,
    traffic: item["ht:approx_traffic"] || "정보 없음",
    pubDate: item.pubDate,
    newsTitle: item.newsTitle,
    snippet: item.snippet,
    newsBody: item.newsBody,
    link: item.realLink || "링크 없음",
  }));

  // 이후 작업을 then 체이닝으로 분리
  Promise.resolve(top5)
    .then((top5) => {
      const oldData = loadOldData(); // 이전 데이터 로드
      const changed = detectChange(oldData, top5); // 변경 감지
      return { top5, changed };
    })
    .then(({ top5, changed }) => {
      if (!changed) {
        console.log(`✅ [${new Date().toLocaleTimeString()}] Top5 동일함`);
        return null;
      }
      console.log(`\n🔄 [${new Date().toLocaleTimeString()}] Top5 변경 감지됨`);
      top5.forEach((item, i) => {
        console.log(`\n${i + 1}. 🔥 ${item.title}`);
        console.log(`   🔍 검색량: ${item.traffic}`);
        console.log(`   🕓 시간: ${item.pubDate}`);
        console.log(`   📰 뉴스제목: ${item.newsTitle}`);
        console.log(`   👉 링크: ${item.link}`);
        console.log(`   📌 요약: ${item.snippet}`);
        console.log(
          `   📄 본문: ${item.newsBody.slice(0, 150).replace(/\n/g, " ")}...`
        );
      });

      return top5; // 저장을 위해 전달
    })
    .then((dataToSave) => {
      if (dataToSave) saveToFile(dataToSave);
    })
    .catch((err) => {
      console.error("🔴 Top5 처리 중 오류:", err.message);
    });
};

// 외부에서 runWatcher 사용할 수 있도록 export
module.exports = runWatcher;
