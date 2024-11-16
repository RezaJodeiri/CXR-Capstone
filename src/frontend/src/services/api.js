import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL;

const executeHTTPRequest = async (
  httpVerb,
  path,
  headers = {},
  params = {},
  body = {}
) => {
  const config = {
    method: httpVerb,
    url: `${API_BASE_URL}${path}`,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    params: params,
  };

  if (httpVerb !== "GET") {
    config.data = body;
  }

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`Error executing ${httpVerb} request to ${path}`, error);
    throw error;
  }
};

export const signIn = async (email, password) => {
  return executeHTTPRequest(
    "POST",
    "/oauth/sign_in",
    {},
    {
      email,
      password,
    },
    {}
  );
};

export const signUp = async (email, password, userDetails) => {
  return executeHTTPRequest(
    "POST",
    "/oauth/sign_up",
    {},
    {
      email,
      password,
    },
    {
      first_name: userDetails?.firstName || "",
      last_name: userDetails?.lastName || "",
      occupation: userDetails?.occupation || "",
      organization: userDetails?.organization || "",
      location: userDetails?.location || "",
    }
  );
};

export const getSelfUser = async (accessToken) => {
  return executeHTTPRequest("POST", "/oauth/self", {
    Authorization: `Bearer ${accessToken}`,
  });
};

export const predictImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await axios.post(`${API_BASE_URL}/predict`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization:
          "Bearer eyJraWQiOiI2NlRQRU1uRDNSRExqR0ZCTzRXRUVhbmN3cVUwUld6b1wvQ1hFakF3Nzl4Yz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI5MTZiMjVmMC0zMDcxLTcwZDgtYjcyOS1mYjc2MGFkOTk1MTkiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0yLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMl9uVkpaUm1vUVgiLCJjbGllbnRfaWQiOiIyaDltOGswajVoYnQwbTVkbmF2dThpYzBnaSIsIm9yaWdpbl9qdGkiOiJkMjgyOTg2MS05NWQzLTRjN2UtOTUyZi04MmM4MjM3YTUyODMiLCJldmVudF9pZCI6IjE5MDBkODAyLTlhMzgtNGY3NC04YTBkLWQ3ODY1ZDFkNzdkMCIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE3MzE1NTQ4MzQsImV4cCI6MTczMTU1ODQzNCwiaWF0IjoxNzMxNTU0ODM0LCJqdGkiOiI1YTAwY2NiZC1kNjRkLTQ4MzQtYWUzNS0yYjVkMzljZjQ2NzciLCJ1c2VybmFtZSI6Im5hdGhhbl9uZXVyYWxhbmFseXplciJ9.NbWmHn6b4kong4Stj3C5LLcCkiAP0_PNtfLiH0RAL8A_vqqJaUWTVBN20UA1uwHt-TZGY-1eAGUkpxE_CMsKPJS6MXsXG3MI-mylOIMASc9W3pae4NvXkZJGfcoOyzE4aN2E0s9Sq5FuL_gPzAbDhVncfdBcCYIOesoNeZCQA2f0Mp1K6xYFwwkjsS9MqVFkPCX9PgpVeKCqQ3kwVALX_goP01RIfNzmpTQ9-bZ1Kg16CGR8h1FqgMPwSrEV8k42HANxKyZBM83sSfaO7cfhFayDCKFqKyTEJqIb4yLzXJz3NimjozwePrvaz3Z3e8vRQqzA1Xh-9lfCshH0__9w0w",
      },
    });
    return response.data.prediction;
  } catch (error) {
    console.error("Error uploading file", error);
    throw error;
  }
};
