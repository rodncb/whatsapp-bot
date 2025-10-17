const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const arceeUrl =
  process.env.ARCEE_VISION_URL || "https://api.arcee.ai/v1/vision/ocr";
const key = process.env.ARCEE_API_KEY;

const tinyBase64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAn8BHtK7a2QAAAAASUVORK5CYII="; // 1x1 png
const buffer = Buffer.from(tinyBase64, "base64");

async function tryJson(payload) {
  try {
    const resp = await axios.post(arceeUrl, payload, {
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      timeout: 30000,
    });
    console.log(
      "JSON payload OK - status",
      resp.status,
      "bodyLen",
      JSON.stringify(resp.data || "").length
    );
    console.log("bodySnippet:", JSON.stringify(resp.data).slice(0, 1000));
  } catch (err) {
    if (err.response) {
      console.log(
        "JSON payload ERR status",
        err.response.status,
        "bodySnippet",
        JSON.stringify(err.response.data).slice(0, 1000)
      );
    } else {
      console.log("JSON payload ERROR", err.message || err);
    }
  }
}

async function tryForm() {
  try {
    const form = new FormData();
    form.append("file", buffer, {
      filename: "test.png",
      contentType: "image/png",
    });
    form.append("mime_type", "image/png");

    const resp = await axios.post(arceeUrl, form, {
      headers: { ...form.getHeaders(), Authorization: `Bearer ${key}` },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      timeout: 30000,
    });
    console.log(
      "FORM payload OK - status",
      resp.status,
      "bodyLen",
      JSON.stringify(resp.data || "").length
    );
    console.log("bodySnippet:", JSON.stringify(resp.data).slice(0, 1000));
  } catch (err) {
    if (err.response) {
      console.log(
        "FORM payload ERR status",
        err.response.status,
        "bodySnippet",
        JSON.stringify(err.response.data).slice(0, 1000)
      );
    } else {
      console.log("FORM payload ERROR", err.message || err);
    }
  }
}

(async () => {
  if (!key) {
    console.error("ARCEE_API_KEY not set");
    process.exit(2);
  }
  console.log("Testing Arcee Vision URL:", arceeUrl);

  await tryJson({ image_base64: tinyBase64, mime_type: "image/png" });
  await tryJson({ image: tinyBase64, type: "png" });
  await tryJson({ data: tinyBase64 });
  await tryJson({ file: tinyBase64 });
  await tryJson({ image_bytes: tinyBase64 });
  await tryForm();
})();
