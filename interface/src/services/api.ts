import axios from "axios";

const API_Base = "http://localhost:8000";

export const sendFileUrl = async (url: string) => {
  return axios.post(`${API_Base}/pdf/upload_pdf`, { url: url });
};

export const sendQuery = async (query: string) => {
  return axios.post(`${API_Base}/rag/ask`, { question: query });
};
