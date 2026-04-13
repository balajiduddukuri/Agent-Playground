import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface Logger {
  log: (type: 'ai-request' | 'ai-response' | 'error', agent: string, message: string, data?: any) => void;
}

export const generateUserStories = async (requirement: string, logger?: Logger) => {
  const agent = "BA Agent";
  logger?.log('ai-request', agent, "Generating user stories", { requirement });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Convert the following business requirement into detailed user stories in Markdown format:\n\n${requirement}`,
      config: {
        systemInstruction: "You are a Business Analyst Agent. Your goal is to convert business requirements into clear, actionable user stories with acceptance criteria.",
      },
    });
    logger?.log('ai-response', agent, "User stories generated", { response: response.text });
    return response.text;
  } catch (error) {
    logger?.log('error', agent, "Failed to generate user stories", error);
    throw error;
  }
};

export const generateCode = async (userStory: string, logger?: Logger) => {
  const agent = "Developer Agent";
  logger?.log('ai-request', agent, "Generating code", { userStory });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `Generate production-ready code with error handling for the following user story:\n\n${userStory}`,
      config: {
        systemInstruction: "You are a Developer Agent. Your goal is to generate high-quality, production-ready code based on user stories.",
      },
    });
    logger?.log('ai-response', agent, "Code generated", { response: response.text });
    return response.text;
  } catch (error) {
    logger?.log('error', agent, "Failed to generate code", error);
    throw error;
  }
};

export const generateTests = async (code: string, logger?: Logger) => {
  const agent = "QA Agent";
  logger?.log('ai-request', agent, "Generating tests", { code });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate unit test cases for the following code:\n\n${code}`,
      config: {
        systemInstruction: "You are a QA Agent. Your goal is to generate comprehensive unit tests for the provided code.",
      },
    });
    logger?.log('ai-response', agent, "Tests generated", { response: response.text });
    return response.text;
  } catch (error) {
    logger?.log('error', agent, "Failed to generate tests", error);
    throw error;
  }
};
