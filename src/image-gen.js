import { getImagenModel } from "firebase/vertexai";
import { vertexAI } from "./firebase-init.js";

const imagenModel = getImagenModel(vertexAI, {
  model: "imagen-3.0-generate-001"
});

export async function generateImage(prompt, options = {}) {
  try {
    const result = await imagenModel.generateImages({
      prompt: prompt,
      numberOfImages: options.numberOfImages || 1,
      aspectRatio: options.aspectRatio || "1:1",
      safetyFilterLevel: "block_low_and_above",
      personFilterLevel: "allow_all"
    });
    
    const image = result.images[0];
    return `data:image/png;base64,${image.base64String}`;
  } catch (error) {
    console.error("Image gen error:", error);
    return null;
  }
}
