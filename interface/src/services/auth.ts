import axios from "axios";

const API_Base = "http://localhost:8000";

export const signUpUser = async (
  username: string,
  password: string,
  email: string
) => {
  return axios.post(`${API_Base}/auth/sign_up/user`, {
    user_name: username,
    password_raw: password,
    email: email,
  });
};

export const signInUser = async (password: string, email: string) => {
  return axios.post(`${API_Base}/auth/sign_in/user`, {
    password_raw: password,
    email: email,
  });
};
