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
    throw new Error("Authentication token is required");
  }

  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await axios.post(`${API_BASE_URL}/predict`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading file", error);
    throw error;
  }
};

const parsePatientData = (patient) => {
  const birthDate = new Date(patient.birthdate);
  const age = new Date().getFullYear() - birthDate.getFullYear();
  return {
    id: patient.id,
    friendlyId: "PID-" + patient.id.split("-")[0],
    name: `${patient.first_name} ${patient.last_name}`,
    age: age.toString(),
    status: ["Emergency", "Low", "Medium", "Inactive"][
      Math.floor(Math.random() * 4)
    ],
    diagnosis: ["Type A", "Type B", "Type C"][Math.floor(Math.random() * 3)],
    gender: patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1),
    email: patient?.email || "",
    phone_number: patient?.phone_number || "",
  };
};

export const getPatients = async (doctorId, token) => {
  const patients = await executeHTTPRequest(
    "GET",
    `/doctors/${doctorId}/patients`,
    {
      Authorization: `Bearer ${token}`,
    }
  );
  const transformedList = patients.map((patient) => parsePatientData(patient));

  // Sort patients by status: Emergency, Medium, Low
  const statusOrder = { Emergency: 1, Medium: 2, Low: 3, Inactive: 4 };
  transformedList.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);

  return transformedList;
};

export const createPatient = async (doctorId, patientData, token) => {
  const { name, age, gender, email, phone_number } = patientData;
  const birthYear = new Date().getFullYear() - parseInt(age);
  return await executeHTTPRequest(
    "POST",
    `/doctors/${doctorId}/patient`,
    {
      Authorization: `Bearer ${token}`,
    },
    {},
    {
      name: name,
      age: age,
      birthdate: `${birthYear}-01-01`,
      gender: gender,
      email: email,
      phone_number: phone_number,
    }
  );
};

export const getPatientById = async (patientId, token) => {
  const patient = await executeHTTPRequest("GET", `/users/${patientId}`, {
    Authorization: `Bearer ${token}`,
  });
  return parsePatientData(patient);
};

const parseRecordData = (record) => {
  return {
    ...record,
    friendlyId: "RID-" + record.id.split("-")[0],
    reportStatus: ["Completed", "In Progress", "Canceled"][
      Math.floor(Math.random() * 3)
    ],
    timeCreated: record.created_at,
    timeUpdated: record.updated_at,
    findings: record.report.findings,
    impression: record.report.impression,
  };
};
export const getMedicalRecordsForPatient = async (
  patientId,
  token,
  limit = 100
) => {
  const paginatedResponse = await executeHTTPRequest(
    "GET",
    `/users/${patientId}/records?limit=${limit}`,
    {
      Authorization: `Bearer ${token}`,
    }
  );
  const records = paginatedResponse?.data || [];
  const parsedRecords = records.map((record) => parseRecordData(record));

  // Sort patients by status: Emergency, Medium, Low
  const priorityOrder = { Emergency: 1, Medium: 2, Low: 3 };
  const reportStatusOrder = { "In Progress": 1, Completed: 2, Canceled: 3 };

  return parsedRecords.sort((a, b) => {
    if (
      reportStatusOrder[a.reportStatus] !== reportStatusOrder[b.reportStatus]
    ) {
      return (
        reportStatusOrder[a.reportStatus] - reportStatusOrder[b.reportStatus]
      );
    }
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
};

export const getMedicalRecordById = async (userId, recordId, token) => {
  const record = await executeHTTPRequest(
    "GET",
    `/users/${userId}/records/${recordId}`,
    {
      Authorization: `Bearer ${token}`,
    }
  );
  return parseRecordData(record);
};

export const createMedicalRecord = async (patientId, recordData, token) => {
  const newRecord = {
    xRayUrl: recordData.xRayUrl,
    predictions: recordData.predictions.reduce((acc, item) => {
      acc[item.condition] = item.confidence / 100;
      return acc;
    }, {}),
    report: {
      findings: recordData.findings,
      impression: recordData.impression,
    },
    note: recordData.note,
    priority: recordData.priority,
    treatmentPlan: recordData.treatmentPlan,
    // prescriptions: recordData.prescriptions,
    prescriptions: [],
  };
  console.log(newRecord);

  const createdRecord = await executeHTTPRequest(
    "POST",
    `/users/${patientId}/record`,
    {
      Authorization: `Bearer ${token}`,
    },
    {},
    newRecord
  );
  return parseRecordData(createdRecord);
};

export const getMedicalRecord = async (userId, recordId, token) => {
  const record = await executeHTTPRequest(
    "GET",
    `/users/${userId}/records/${recordId}`,
    {
      Authorization: `Bearer ${token}`,
    }
  );
  return parseRecordData(record);
};

// api.js
// Generic file uploads (for x-ray images, for avatar)
// Generic Use case
export const uploadFile = async (file, token) => {
  // Fetch your upload URL, GET request
  const fileName = file.name;
  const uploadURL = await executeHTTPRequest(
    "GET",
    `/generate-upload-url/${fileName}`,
    {
      Authorization: `Bearer ${token}`,
    }
  );
  try {
    // Perform the PUT request
    await axios.put(uploadURL, file, {
      headers: {
        "Content-Type": file.type,
      },
    });
    const urlWithoutParams = uploadURL.split("?")[0];
    return urlWithoutParams;
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};

export const getPredictionAndReport = async (userId, xRayUrl, token) => {
  const predictionRes = await executeHTTPRequest(
    "POST",
    `/users/${userId}/records/prediction`,
    {
      Authorization: `Bearer ${token}`,
    },
    {},
    {
      xRayUrl: xRayUrl,
    }
  );

  const predictionsArray = Object.entries(predictionRes.predictions).map(
    ([condition, confidence]) => ({
      condition: condition,
      confidence: confidence * 100,
    })
  );

  predictionRes.predictions = predictionsArray.sort(
    (a, b) => b.confidence - a.confidence
  );
  return predictionRes;
};
