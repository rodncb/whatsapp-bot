const fs = require("fs");
const path = require("path");
const axios = require("axios");
require("dotenv").config();

(async () => {
  try {
    const arceeKey = process.env.ARCEE_API_KEY;
    const arceeUrl =
      process.env.ARCEE_VISION_URL || "https://api.arcee.ai/v1/vision/ocr";
    if (!arceeKey) {
      console.error("ARCEE_API_KEY not set in .env");
      process.exit(2);
    }

    // Try to find a sample image in repo (temp/sample.jpg or docs)
    const candidates = [
      path.join(__dirname, "..", "temp", "sample.jpg"),
      path.join(__dirname, "..", "docs", "sample.jpg"),
    ];

    let imagePath = candidates.find((p) => fs.existsSync(p));
    if (!imagePath) {
      // fallback: create a tiny 1x1 png base64
      console.log(
        "No sample image found in repo; using a tiny placeholder image"
      );
      const tinyBase64 =
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAn8BHtK7a2QAAAAASUVORK5CYII=";
      await callArcee(arceeUrl, arceeKey, tinyBase64, "image/png");
      return;
    }

    const buffer = fs.readFileSync(imagePath);
    const base64 = buffer.toString("base64");
    await callArcee(arceeUrl, arceeKey, base64, "image/jpeg");
  } catch (err) {
    console.error("Test failed:", err.message || err);
    process.exit(1);
  }
})();

async function callArcee(url, key, base64, mimeType) {
  console.log("Calling Arcee at", url);
  try {
    const resp = await axios.post(
      url,
      { image_base64: base64, mime_type: mimeType },
      {
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );
    console.log("Status:", resp.status);
    console.log("Response snippet:", JSON.stringify(resp.data).slice(0, 2000));
  } catch (err) {
    if (err.response) {
      console.error("Status:", err.response.status);
      console.error(
        "Body snippet:",
        JSON.stringify(err.response.data).slice(0, 2000)
      );
    } else {
      console.error("Error:", err.message || err);
    }
  }
}
