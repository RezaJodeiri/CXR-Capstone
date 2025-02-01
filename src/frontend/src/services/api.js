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

// Mock patient data
const mockPatients = [
  {
    id: "1",
    name: "John Doe",
    age: 45,
    gender: "Male",
    lastVisit: "2024-03-20",
  },
  {
    id: "2",
    name: "Jane Smith",
    age: 32,
    gender: "Female",
    lastVisit: "2024-03-19",
  },
];

// Mock data storage for all medical records (including newly created ones)
let allMedicalRecords = {
  1: [
    {
      id: "1",
      recordId: "MR-001",
      priority: "High",
      status: "In Progress",
      timeCreated: "2024-03-20T10:00:00Z",
      timeUpdated: "2024-03-20T10:00:00Z",
      xRayUrl: "/file-upload.png",
      clinicalNotes: "Initial examination shows...",
      treatmentPlan: "Recommended treatment includes...",
      prescriptions: [
        {
          medication: "Sample Medication",
          dosage: "10mg",
          frequency: "Once daily",
          time: "Morning",
        },
      ],
    },
  ],
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
  await new Promise((resolve) => setTimeout(resolve, 500));
  const patient = mockPatients.find((p) => p.id === patientId);
  if (!patient) throw new Error("Patient not found");
  return patient;
};

export const getMedicalRecords = async (patientId, token) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return allMedicalRecords[patientId] || [];
};

export const createMedicalRecord = async (patientId, recordData, token) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const newRecord = {
    id: Date.now().toString(),
    recordId: `MR-${Date.now()}`,
    xRayUrl: recordData.xRayFile
      ? URL.createObjectURL(recordData.xRayFile)
      : null,
    clinicalNotes: recordData.clinicalNotes,
    treatmentPlan: recordData.treatmentPlan,
    prescriptions: recordData.prescriptions,
    priority: recordData.priority,
    status: "Pending",
    timeCreated: new Date().toISOString(),
    timeUpdated: new Date().toISOString(),
  };

  // Add the new record to our mock storage
  if (!allMedicalRecords[patientId]) {
    allMedicalRecords[patientId] = [];
  }
  allMedicalRecords[patientId].unshift(newRecord);

  return newRecord;
};

export const getMedicalRecord = async (recordId, token) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Search through all patient records to find the matching record
  for (const patientRecords of Object.values(allMedicalRecords)) {
    const record = patientRecords.find((r) => r.id === recordId);
    if (record) {
      return record;
    }
  }

  throw new Error("Medical record not found");
};
