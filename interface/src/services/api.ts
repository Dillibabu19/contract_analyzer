import axios from "axios";

const API_Base = import.meta.env.VITE_BASE_URL;

export const sendFileUrl = async (url: string, name: string, id: string) => {
  return axios.post(`${API_Base}/pdf/upload_pdf`, {
    url: url,
    file_name: name,
    file_id: id,
  });
};

export const sendQuery = async (query: string) => {
  return axios.post(`${API_Base}/rag/ask`, { question: query });
};
