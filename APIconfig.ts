import axios from "axios";
export const AxiosConfig = axios.create({
  baseURL: "http://localhost:9000/api/v1",
});
export const SttarterConfig = axios.create({
  baseURL:
    "https://api.sttarter.com/contentsystem/1259590a4e29adf33a9565afac4b54a6/",
});
