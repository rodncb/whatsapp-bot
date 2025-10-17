const axios = require("axios");
require("dotenv").config();

(async () => {
  try {
    const key = process.env.ARCEE_API_KEY;
    const url =
      process.env.ARCEE_API_URL || "https://api.arcee.ai/v1/chat/completions";
    if (!key) {
      console.error("ARCEE_API_KEY not set");
      process.exit(2);
    }

    console.log("Calling Arcee Chat at", url);

    const payload = {
      model: "arcee-agent",
      messages: [
        { role: "system", content: 'Teste de integração: responda "ok"' },
        { role: "user", content: "Olá, você está aí?" },
      ],
      temperature: 0.0,
      max_tokens: 50,
    };

    try {
      const resp = await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      });
      console.log("Status:", resp.status);
      console.log("Headers:", JSON.stringify(resp.headers, null, 2));
      console.log("Body snippet:", JSON.stringify(resp.data).slice(0, 3000));
    } catch (err) {
      if (err.response) {
        console.error("Status:", err.response.status);
        console.error(
          "Body snippet:",
          JSON.stringify(err.response.data).slice(0, 3000)
        );
      } else {
        console.error("Error:", err.message || err);
      }
    }
  } catch (e) {
    console.error(e);
  }
})();
