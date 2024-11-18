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
    }
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
    userDetails
  );
};

export const getSelfUser = async (accessToken) => {
  return executeHTTPRequest("GET", "/oauth/self", {
    Authorization: `Bearer ${accessToken}`,
  });
};

export const predictImage = async (file, token) => {
  if (!token) {
    throw new Error('Authentication token is required');
  }

  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await axios.post(`${API_BASE_URL}/predict`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`
      },
    });
    return response.data.prediction;
  } catch (error) {
    console.error("Error uploading file", error);
    throw error;
  }
};
