
import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  console.error("API_KEY environment variable not set. The app will not function correctly.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const editImageWithGemini = async (
  base64ImageData: string,
  mimeType: string,
  prompt: string
): Promise<string> => {
  if (!API_KEY) {
    throw new Error("Missing API Key. Please configure your environment.");
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const editedBase64 = part.inlineData.data;
        const editedMimeType = part.inlineData.mimeType;
        return `data:${editedMimeType};base64,${editedBase64}`;
      }
    }

    throw new Error("No image found in the Gemini API response.");

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to edit image: ${error.message}`);
    }
    throw new Error("An unknown error occurred while editing the image.");
  }
};
