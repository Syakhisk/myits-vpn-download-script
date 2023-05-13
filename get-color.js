import pptr from "puppeteer-core";
import fs from "fs/promises";

const REPEAT = 10;
const OUTPUT = "colors.json";

const browser = await pptr.launch({
  headless: false,
  executablePath: process.env.CHROME_PATH || "/usr/bin/google-chrome",
});

const page = await browser.newPage();
await page.goto("https://id.its.ac.id/otp/d.php");

const colors = [];

for (let i = 0; i < REPEAT; i++) {
  const color = await page.evaluate(getColor);
  colors.push(color);
  await page.reload();
}

const existing = await fs
  .readFile(OUTPUT, "utf-8")
  .then(JSON.parse)
  .catch(() => []);
const set = new Set([...colors, ...existing].map(JSON.stringify));
const unique = Array.from(set).map(JSON.parse);

fs.writeFile(OUTPUT, JSON.stringify(unique, null, 2));

function getColor() {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = document.querySelector("body > img").src;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      context.drawImage(img, 0, 0);
      resolve(Array.from(context.getImageData(0, 0, 1, 1).data));
    };
    img.onerror = reject;
  });
}
