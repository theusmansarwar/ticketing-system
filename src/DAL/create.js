import { invokeApi } from "../utils/invokeApi.js";
export const createMessage = async (data) => {
  const reqObj = {
    path: "/chat/add",
    method: "POST",
    headers: {
   'Content-Type': 'multipart/form-data',
    },
    postData: data,
  };
  return invokeApi(reqObj);
};
