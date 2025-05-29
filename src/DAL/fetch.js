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
