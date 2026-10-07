//oldData.js
const fs = require("fs");
const path = require("path");
const FILE_PATH = path.join(__dirname, "top5.json");

// 이전 데이터 로드
const loadOldData = () => {
  if (!fs.existsSync(FILE_PATH)) return null;
  const raw = fs.readFileSync(FILE_PATH, "utf-8");
  return JSON.parse(raw);
};

// 데이터 저장
const saveToFile = (top5) => {
  fs.writeFileSync(FILE_PATH, JSON.stringify(top5, null, 2), "utf-8");
};

module.exports = { loadOldData, saveToFile };
