import api from "@/utils/api";


export const getApi = (url, params = {}) => {
  return api.get(url, { params });
};


export const postApi = (url, data = {}) => {
  return api.post(url, data);
};

export const putApi = (url, data = {}) => {
  return api.put(url, data);
};


export const deleteApi = (url) => {
  return api.delete(url);
};
