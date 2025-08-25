import { openDB } from "idb";

const DB_NAME = "chatDB";
const STORE_NAME = "messages";
type ChatMessage = {
  role: "user" | "ai";
  text: string;
};
export const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    },
  });
};
export const addMessage = async (msg: {
  role: "user" | "ai";
  text: string;
}) => {
  const db = await initDB();
  await db.add(STORE_NAME, msg);
};

export const getLastUserMessages = async (
  limit: number = 5
): Promise<ChatMessage[]> => {
  const db = await initDB();
  const all = (await db.getAll(STORE_NAME)) as ChatMessage[];

  // Filter only user messages
  const userMessages = all.filter((m) => m.role === "user");

  return userMessages.slice(-limit); // last N user messages
};
