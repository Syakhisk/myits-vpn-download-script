import pptr from "puppeteer-core";
import dotenv from "dotenv";
import fs from "fs";
import colors from "./colors.json" assert { type: "json" };
import https from "https";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: __dirname + "/.env"})

const browser = await pptr.launch({
  headless: false,
  executablePath: process.env.CHROME_PATH || "/usr/bin/google-chrome",
});

const page = await browser.newPage();
await page.setUserAgent(
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36"
);

await page.goto("https://id.its.ac.id/otp/auth.php");

await page.waitForSelector("#username");

const username = process.env.USERNAME;
const password = process.env.PASSWORD;

await page.$eval("#username", (el, value) => (el.value = value), username);
await page.$eval("#password", (el, value) => (el.value = value), password);

await Promise.all([
  page.$eval("#login", (el) => el.click()),
  page.waitForNavigation(),
]);

const color = await page.evaluate(getColor);
const colorName = getColorName(color);

await page.$eval(
  "select[name=pilih]",
  (el, value) => (el.value = value),
  colorName
);

await page.$eval("[type=submit]", (el) => el.click());

await page.goto("https://id.its.ac.id/otp/ndash/index.php/main/tambah/vpn");

await page.waitForSelector('[name="rec[0][durasi_akses]"]');
await page.$eval(
  '[name="rec[0][durasi_akses]"]',
  (el, value) => (el.value = value),
  9
);

await Promise.all([
  page.$eval("[type=submit]", (el) => el.click()),
  page.waitForNavigation(),
]);

const vpnLinks = await page.$eval("table tbody tr:nth-child(1)", (row) => {
  const linksEl = Array.from(row.querySelectorAll("td a"));
  const links = [];

  for (let link of linksEl) {
    links.push({
      text: link.textContent,
      href: link.href,
    });
  }

  return links;
});

console.log("--- VPN Links ---");
for (let link of vpnLinks) {
  console.log(`${link.text}: ${link.href}`);
}

const targetServer = "Server2";
const cwd = process.cwd();
const path = `${cwd}/${targetServer}.zip`;

console.log("\n\n-- Download --");
console.log(`Downloading ${targetServer}...`);

await new Promise((resolve, reject) => {
  const fileStream = fs.createWriteStream(path);
  https.get(vpnLinks[0].href, (response) => {
    response.pipe(fileStream);

    fileStream.on("finish", () => {
      fileStream.close();
      console.log("Download finished")
      console.log(`File downloaded: ${path}`);
      resolve();
    });
  });
});

await browser.close();

function getColor() {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = document.querySelector("body > center > img").src;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      context.drawImage(img, 0, 0);
      const rgba = Array.from(context.getImageData(0, 0, 1, 1).data);
      const rgb = rgba.slice(0, 3);
      resolve(rgb);
    };
    img.onerror = reject;
  });
}

function getColorName(rgb) {
  for (let name in colors) {
    if (colors[name].join(",") == rgb.join(",")) {
      return name;
    }
  }
}
