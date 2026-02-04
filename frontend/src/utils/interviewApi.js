import api from "./axios";

export const generateInterview = async (skill) => {
  const res = await api.post("/chat/generate", { skill });
  return res.data;
};

export const getInterviewById = async (id) => {
  const res = await api.get(`/chat/${id}`);
  return res.data;
};

export const deleteInterview = async (id) => {
  const res = await api.delete(`/chat/delete/${id}`);
  return res.data;
};