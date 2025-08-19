import { invokeApi } from "../utils/invokeApi.js";

export const fetchTicket = async (id) => {
  const reqObj = {
    path: `/ticket/view/${id}`,
    method: "GET",
    headers: { },

    postData: {},
  };
  return invokeApi(reqObj);
};

export const fetchTicketbyuser = async (id,token) => {
  const reqObj = {
    path: `/ticket/viewticket/${id}`,
    method: "GET",
    headers: { 
      "Content-Type": "application/json", 
      Authorization: `Bearer ${token}`,
    },

    postData: {},
  };
  return invokeApi(reqObj);
};