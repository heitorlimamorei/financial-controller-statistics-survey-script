import axios from "axios";
import fs from "fs";

interface IFeedback {
  id: string;
  userId: string;
  sheetId: string;
  chatId: string;
  email: string;
  anyError: boolean;
  easyToUse: boolean;
  goodAtAll: boolean;
  sugestions: string;
  timestamp: { seconds: number; nanoseconds: number };
}

// Function that create a file with the JSON data.
function createJsonFile<T>(ids: T[], filename: string): void {
  const data = JSON.stringify(ids);
  fs.writeFileSync(filename, data);
  console.log(`Arquivo ${filename} criado com sucesso!`);
}

// Function that reads the JSON and parse it into an JS object
async function readJsonFile(filePath: string): Promise<any> {
  try {
    const data = await fs.promises.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (error: any) {
    console.error(`Erro ao ler o arquivo JSON: ${error.message}`);
    return [];
  }
}

async function CreateFeedbackFiles(
  createJsonFile: <T>(ids: T[], filename: string) => void,
  readJsonFile: (filePath: string) => Promise<any>
) {
  const feedbacks = await axios.get<IFeedback[]>(
    "https://fianancial-assistant-backend.onrender.com/api/v1/feedback"
  );

  const feedbackready = feedbacks.data.map((feedback) => {
    return {
      id: feedback.id,
      anyError: feedback.anyError,
      easyToUse: feedback.easyToUse,
      goodAtAll: feedback.goodAtAll,
    };
  });

  const sugestionsFeedback = feedbacks.data.map((feedback) => {
    return {
      id: feedback.id,
      sugestions: feedback.sugestions,
    };
  });

  const feedbackMetadata = feedbacks.data.map((feedback) => {
    return {
      id: feedback.id,
      email: feedback.email,
      chatId: feedback.chatId,
      sheetId: feedback.sheetId,
      timestamp: feedback.timestamp,
    };
  });

  createJsonFile<any>(feedbackready, "output/feedbackids.json");
  createJsonFile<any>(sugestionsFeedback, "output/sugestions.json");
  createJsonFile<any>(feedbackMetadata, "output/metadata.json");

}

async function main(
  createJsonFile: <T>(ids: T[], filename: string) => void,
  readJsonFile: (filePath: string) => Promise<any>
) {
    await CreateFeedbackFiles(createJsonFile, readJsonFile);
}

main(createJsonFile, readJsonFile);
