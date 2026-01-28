
import { GoogleGenAI, Modality } from "@google/genai";
import { SearchCitation } from "../types";

/* Guideline: Initialize GoogleGenAI with a named parameter using process.env.API_KEY directly */
export const getGeminiClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY as string });
};

export const generateText = async (prompt: string, systemInstruction?: string) => {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      systemInstruction: systemInstruction || "You are a helpful creative assistant.",
      temperature: 0.8,
    },
  });
  /* Guideline: Extract text output via the .text property, not a method */
  return response.text;
};

export const generateImage = async (prompt: string, aspectRatio: "1:1" | "16:9" | "9:16" = "1:1") => {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: prompt }],
    },
    config: {
      imageConfig: {
        aspectRatio,
      },
    },
  });

  /* Guideline: Iterate through response parts to find image data in inlineData */
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image data returned from model");
};

export const analyzeImage = async (prompt: string, base64Image: string) => {
  const ai = getGeminiClient();
  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64Image.split(',')[1],
    },
  };
  const textPart = { text: prompt };
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: [imagePart, textPart] },
  });
  
  return response.text;
};

export const searchGrounding = async (query: string) => {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: query,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const text = response.text;
  /* Guideline: Extract search citations from groundingMetadata for display in the app */
  const citations: SearchCitation[] = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  
  return { text, citations };
};

export const generateSpeech = async (text: string, voice: string = 'Kore') => {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: voice },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) throw new Error("No audio data returned");
  return base64Audio;
};
