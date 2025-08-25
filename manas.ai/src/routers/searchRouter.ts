import { WRITE_SEARCH_FULL_URL } from "./hidden/config";
import axios from "axios";

interface SearchData {
  previous_context: string;
  latest_message: string;
}
interface SearchResponse {
  ai_response: string;
}
export const searchAsChat = async (
  data: SearchData
): Promise<SearchResponse> => {
  try {
    const response = await axios.post<SearchResponse>(
      WRITE_SEARCH_FULL_URL,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error while searching:", error);
    throw error;
  }
};
