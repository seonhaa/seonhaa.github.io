// module/fetchRss.js
// RSS 가져오기
const axios = require("axios");

const fetchRSS = async () => {
  const url = "https://trends.google.com/trending/rss?geo=KR";
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (err) {
    console.error("[RSS 요청 실패]", err.message);
    return null;
  }
};

module.exports = fetchRSS;
