//newsBody.js
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
// 뉴스 본문 크롤링
const crawlNewsBody = async (url) => {
  let browser;
  try {
    console.log(`\n🌐 [크롤링 시도] ${url}`);
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"],
    });
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/114 Safari/537.36"
    );
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 10000 });

    const content = await page.content();
    const $ = cheerio.load(content);
    const paragraphs = $("p")
      .map((i, el) => $(el).text().trim())
      .get()
      .filter((t) => t.length > 30)
      .slice(0, 3);

    return paragraphs.length ? paragraphs.join("\n") : "[본문 없음]";
  } catch (err) {
    return `[본문 크롤 실패: ${err.message}]`;
  } finally {
    // 브라우저가 생성되었고 종료되지 않았을 경우만 종료 시도
    if (browser) {
      try {
        await browser.close();
        console.log(`[가상 브라우저 종료]`);
      } catch (closeErr) {
        console.error(`[브라우저 종료 실패] ${closeErr.message}`);
      }
    }
  }
};

module.exports = crawlNewsBody;
