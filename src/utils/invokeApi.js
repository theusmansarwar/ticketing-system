import axios from "axios";
const baseUrl = "https://plutosec.ca/backend/api"
axios.defaults.headers.post["Content-Type"] = "application/json";

export async function invokeApi({
  path,
  method = "GET",
  headers = {},
  queryParams = {},
  postData = {},
})

{
  const reqObj = {
    method,
    url: baseUrl + path,
    headers,
  };
  
  reqObj.params = queryParams;
  if (method === "POST") {
    reqObj.data = postData;
  }
  if (method === "PUT") {
    reqObj.data = postData;
  }
  if (method === "DELETE") {
    reqObj.data = postData;
  }
  let results;
  try {
    results = await axios(reqObj);
    return results.data;
  } catch (error) {
    if (error.response) {
      return error.response;
    } else if (error.request) {
      return { message: "No response received from server." };
    } else {
      return { message: "An unknown error occurred." };
    }
  }
}