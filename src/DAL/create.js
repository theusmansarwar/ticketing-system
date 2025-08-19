import { invokeApi } from "../utils/invokeApi.js";
const token= localStorage.getItem('Secret-token');
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
export const sendotp = async (data) => {
  const reqObj = {
    path: `/ticket/generateTicketOtp`,
    method: "POST",
    headers: { },

    postData: data,
  };
  return invokeApi(reqObj);
};
export const verifyotp = async (data) => {
  const reqObj = {
    path: `/ticket/verifyTicketOtp`,
    method: "POST",
    headers: { },

    postData: data,
  };
  return invokeApi(reqObj);
};
