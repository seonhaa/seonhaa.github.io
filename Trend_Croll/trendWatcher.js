//trendWatcher.js

// 모듈화
const runWatcher = require('./module/runWatcher');
// 최초 실행 및 주기 설정
(async () => {
  await runWatcher();
  setInterval(runWatcher, 5000);
})();
