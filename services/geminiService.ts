
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { TranscriptionResult } from "../types";

const MODEL_NAME = 'gemini-3-flash-preview';

export async function transcribeMedia(
  mediaBase64: string, 
  mimeType: string
): Promise<TranscriptionResult> {
  // Acesso seguro à API Key
  const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : '';
  const ai = new GoogleGenAI({ apiKey: apiKey || '' });

  const prompt = `
    Aja como um especialista em transcrição e análise de mídia (áudio/vídeo). 
    Analise o arquivo fornecido e retorne um objeto JSON estruturado com:
    - title: Um título conciso para o conteúdo.
    - summary: Um resumo executivo do conteúdo.
    - fullTranscription: A transcrição completa e precisa de todas as falas.
    - keyTopics: Uma lista dos principais tópicos discutidos.
    - actionItems: Uma lista de tarefas ou conclusões acionáveis (se houver).
    - language: O idioma detectado.

    Certifique-se de que a transcrição seja o mais literal possível. 
    Responda APENAS com o JSON válido seguindo este esquema.
  `;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: mimeType,
            data: mediaBase64,
          },
        },
        { text: prompt },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          summary: { type: Type.STRING },
          fullTranscription: { type: Type.STRING },
          keyTopics: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          actionItems: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          language: { type: Type.STRING },
        },
        required: ["title", "summary", "fullTranscription", "keyTopics", "actionItems", "language"]
      },
    },
  });

  const resultText = response.text || "{}";
  try {
    return JSON.parse(resultText) as TranscriptionResult;
  } catch (error) {
    console.error("Erro ao analisar resposta do Gemini:", error);
    throw new Error("Falha ao processar os dados da transcrição.");
  }
}
