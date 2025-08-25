import axios from "axios";
import { WRITE_EMAIL_FULL_URL } from "./hidden/config";
export interface GenerateEmailResponse {
  generated_email: string;
}

interface EmailRequest {
  sender: string;
  receiver: string;
  context: string;
  save_email?: boolean;
}

export const generateEmail = async (
  data: EmailRequest
): Promise<GenerateEmailResponse> => {
  try {
    const response = await axios.post<GenerateEmailResponse>(
      WRITE_EMAIL_FULL_URL,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error generating email:", error);
    throw error;
  }
};
