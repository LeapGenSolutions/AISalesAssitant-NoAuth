import axios from "axios";

const API = axios.create({ baseURL: process.env.REACT_APP_SERVER_URI });

export const fetchVersions = () => API.get("/versions");
export const addVersion = (version) => API.post("/versions", { version });
export const deleteVersion = (version_id, version_number) =>
  API.delete(`/versions/${version_id}/${version_number}`);
export const activateVersion = (version_id, version_number) =>
  API.put(`/versions/activate`, {version_id});
