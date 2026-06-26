import fs from "fs";
import path from "path";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemma-4-26b-a4b-it";

if (!GEMINI_API_KEY) {
  console.warn(
    "GEMINI_API_KEY not set. Gemini requests will fail until configured.",
  );
}

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const PROMPT = `
Identifikasi tanaman dan penyakit dari gambar.

Balas HANYA JSON valid berikut:

{
  "plant_name": "",
  "disease_name": "",
  "symptoms": "",
  "causes": "",
  "treatment": "",
  "prevention": ""
}

Gunakan bahasa Indonesia yang mudah dipahami petani.
Jangan tambahkan teks, penjelasan, markdown, reasoning, atau kode blok selain JSON.
`;

export const analyzeImageWithGemini = async (filePath) => {
  try {
    const mimeType = `image/${path.extname(filePath).slice(1)}`;
    const buffer = fs.readFileSync(filePath);

    const body = {
      contents: [
        {
          parts: [
            {
              text: PROMPT,
            },
            {
              inline_data: {
                mime_type: mimeType,
                data: buffer.toString("base64"),
              },
            },
          ],
        },
      ],
    };

    const res = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

   if (!res.ok) {
     const errorText = await res.text();

     console.error("========== GEMINI ERROR ==========");
     console.error("Status:", res.status);
     console.error("Response:", errorText);
     console.error("=================================");

     throw new Error(`Gemini API Error ${res.status}: ${errorText}`);
   }

    const json = await res.json();

    // Extract parts array dari response Gemini
    const parts = json?.candidates?.[0]?.content?.parts || [];

    if (parts.length === 0) {
      console.error("No parts found in Gemini response");
      return { raw: json, parsed: null };
    }

    // Loop through parts untuk find JSON valid
    let parsed = null;
    for (const part of parts) {
      // Skip thought/reasoning parts
      if (part.thought === true) {
        console.debug("Skipping thought part");
        continue;
      }

      const text = part.text || "";

      if (!text.trim()) {
        continue;
      }

      try {
        parsed = JSON.parse(text);
        console.debug("JSON berhasil di-parse dari part");
        break; // Found valid JSON, exit loop
      } catch (err) {
        console.debug(`Failed to parse part: ${err.message}`);
        continue;
      }
    }

    if (!parsed) {
      console.warn("No valid JSON found in any Gemini response parts");
      console.debug("Raw response parts:", JSON.stringify(parts, null, 2));
    }

    return {
      raw: json,
      parsed,
    };
  } catch (error) {
    throw error;
  }
};
