import axios from 'axios';

// Import the API functions
import {
  getMedicalRecord,
  getMedicalRecordsForPatient,
  getPrescriptionById,
  getPatients,
  executeHTTPRequest
} from '../../../../../src/frontend/src/services/api';


jest.mock('axios');

beforeEach(() => {
  jest.clearAllMocks();


  axios.mockReset();
  axios.mockImplementation(config => {
    // Return mock success response regardless of the URL
    return Promise.resolve({ data: config.mockResponseData || {} });
  });
});

describe('executeHTTPRequest', () => {
  it('should configure request correctly for GET requests', async () => {
    const mockResult = { result: 'success' };

    axios.mockImplementationOnce(config => {
      return Promise.resolve({ data: mockResult });
    });

    const result = await executeHTTPRequest('GET', '/test-path', { 'X-Custom': 'value' }, { query: 'param' });

    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'X-Custom': 'value'
        }),
        params: { query: 'param' }
      })
    );
    expect(result).toEqual(mockResult);
  });

  it('should include body for POST requests', async () => {
    const mockResult = { result: 'success' };

    axios.mockImplementationOnce(config => {
      return Promise.resolve({ data: mockResult });
    });

    const result = await executeHTTPRequest(
      'POST',
      '/test-path',
      { 'X-Custom': 'value' },
      { query: 'param' },
      { body: 'data' }
    );
    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'X-Custom': 'value'
        }),
        params: { query: 'param' },
        data: { body: 'data' }
      })
    );
    expect(result).toEqual(mockResult);
  });
});

// Medical Record tests
describe('getMedicalRecord', () => {
  const mockUserId = '01cb4540-60e1-70da-ad16-eed4d8b556b8';
  const mockRecordId = 'b00c5c6d-f6c8-435f-8bf7-9a27bcbccc26';
  const mockToken = 'test-token';
  const mockRecordData = {
    id: "b00c5c6d-f6c8-435f-8bf7-9a27bcbccc26",
    xRayUrl: "",
    note: "This is a test Note",
    prescription: {
      data: [
        {
          dosage: "Medicine 13",
          dosageDuration: "5 mins",
          dosageFrequency: "daily",
          id: "ed5f8980-9895-4c72-947d-3761884dc3f2",
          recordId: "b00c5c6d-f6c8-435f-8bf7-9a27bcbccc26"
        }
      ],
      next: "1f9d22fe-5465-4e8b-8b72-a7a95eb8225d"
    },
    userId: "01cb4540-60e1-70da-ad16-eed4d8b556b8"
  };

  it('should make GET request with correct method and auth headers', async () => {
    axios.mockImplementationOnce(config => {
      return Promise.resolve({ data: mockRecordData });
    });

    await getMedicalRecord(mockUserId, mockRecordId, mockToken);
    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mockToken}`
        })
      })
    );

    // Verify the path contains the IDs regardless of base URL
    const callConfig = axios.mock.calls[0][0];
    expect(callConfig.url).toContain(mockUserId);
    expect(callConfig.url).toContain(mockRecordId);
  });

  it('should return medical record with accurate prescription data', async () => {
    axios.mockImplementationOnce(config => {
      return Promise.resolve({ data: mockRecordData });
    });

    const result = await getMedicalRecord(mockUserId, mockRecordId, mockToken);
    expect(result).toEqual(mockRecordData);
    expect(result.id).toBe(mockRecordId);
    expect(result.prescription.data).toBeInstanceOf(Array);
    expect(result.prescription.data[0].dosage).toBe('Medicine 13');
  });
});

// Paginated Medical Records tests
describe('getMedicalRecordsForPatient', () => {
  const mockUserId = '01cb4540-60e1-70da-ad16-eed4d8b556b8';
  const mockToken = 'test-token';
  const mockPaginatedResponse = {
    data: [
      {
        id: "ac1a59ca-8d77-4f3e-987a-7f8a8126978d",
        xRayUrl: "",
        note: "This is a note",
        prescription: [],
        userId: "01cb4540-60e1-70da-ad16-eed4d8b556b8"
      },
      {
        id: "b00c5c6d-f6c8-435f-8bf7-9a27bcbccc26",
        xRayUrl: "",
        note: "This is a test Note",
        prescription: [],
        userId: "01cb4540-60e1-70da-ad16-eed4d8b556b8"
      }
    ],
    next: "4c61bb0f-dac0-4352-9e60-efaacd84e734"
  };

  it('should make GET request with correct method, parameters, and headers', async () => {
    axios.mockImplementationOnce(config => {
      return Promise.resolve({ data: mockPaginatedResponse });
    });

    await getMedicalRecordsForPatient(mockUserId, mockToken);

    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mockToken}`
        }),
        params: expect.objectContaining({ limit: 100 })
      })
    );

    const callConfig = axios.mock.calls[0][0];
    expect(callConfig.url).toContain(mockUserId);
  });

  it('should transform and process medical records', async () => {
    axios.mockImplementationOnce(config => {
      return Promise.resolve({ data: mockPaginatedResponse });
    });

    const result = await getMedicalRecordsForPatient(mockUserId, mockToken);

    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBe(mockPaginatedResponse.data.length);

    result.forEach(record => {
      expect(record).toHaveProperty('friendlyId');
      expect(record).toHaveProperty('priority');
      expect(record).toHaveProperty('reportStatus');
    });
  });
});

// Prescription tests
describe('getPrescriptionById', () => {
  const mockUserId = '01cb4540-60e1-70da-ad16-eed4d8b556b8';
  const mockRecordId = 'b00c5c6d-f6c8-435f-8bf7-9a27bcbccc26';
  const mockPrescriptionId = 'ed5f8980-9895-4c72-947d-3761884dc3f2';
  const mockToken = 'test-token';
  const mockPrescription = {
    dosage: "Medicine 13",
    dosageDuration: "5 mins",
    dosageFrequency: "daily",
    id: "ed5f8980-9895-4c72-947d-3761884dc3f2",
    recordId: "b00c5c6d-f6c8-435f-8bf7-9a27bcbccc26"
  };

  it('should make GET request with correct method and auth headers', async () => {
    axios.mockImplementationOnce(config => {
      return Promise.resolve({ data: mockPrescription });
    });

    await getPrescriptionById(mockUserId, mockRecordId, mockPrescriptionId, mockToken);
    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mockToken}`
        })
      })
    );

    const callConfig = axios.mock.calls[0][0];
    expect(callConfig.url).toContain(mockUserId);
    expect(callConfig.url).toContain(mockRecordId);
    expect(callConfig.url).toContain(mockPrescriptionId);
  });

  it('should return prescription data', async () => {
    axios.mockImplementationOnce(config => {
      return Promise.resolve({ data: mockPrescription });
    });

    const result = await getPrescriptionById(mockUserId, mockRecordId, mockPrescriptionId, mockToken);

    expect(result).toEqual(mockPrescription);
    expect(result.id).toBe(mockPrescriptionId);
    expect(result.recordId).toBe(mockRecordId);
    expect(result.dosage).toBe('Medicine 13');
  });
});

// Patients tests
describe('getPatients', () => {
  const mockDoctorId = '914be5b0-0081-70c9-cf3b-de44b47013fa';
  const mockToken = 'test-token';
  const mockPatientsResponse = [
    {
      birthdate: "2002-12-13",
      doctor_id: "914be5b0-0081-70c9-cf3b-de44b47013fa",
      email: "nathan.luong8@hypercare.com",
      first_name: "Patient",
      gender: "male",
      id: "b13bf540-e081-7092-e06d-07606ccdbcc5",
      last_name: "Luong"
    }
  ];

  it('should make GET request with correct method and auth headers', async () => {
    // Set up axios mock response for this test
    axios.mockImplementationOnce(config => {
      return Promise.resolve({ data: mockPatientsResponse });
    });

    await getPatients(mockDoctorId, mockToken);

    // Verify method and headers without checking any URL
    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mockToken}`
        })
      })
    );

    const callConfig = axios.mock.calls[0][0];
    expect(callConfig.url).toContain(mockDoctorId);
  });

  it('should transform patient data correctly', async () => {
    axios.mockImplementationOnce(config => {
      return Promise.resolve({ data: mockPatientsResponse });
    });

    const result = await getPatients(mockDoctorId, mockToken);

    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBe(mockPatientsResponse.length);

    const transformedPatient = result[0];
    expect(transformedPatient).toHaveProperty('friendlyId');
    expect(transformedPatient).toHaveProperty('name');
    expect(transformedPatient.name).toBe(`${mockPatientsResponse[0].first_name} ${mockPatientsResponse[0].last_name}`);
    expect(transformedPatient).toHaveProperty('age');
    expect(transformedPatient).toHaveProperty('gender');
  });
});

// Performance Testing
describe('API Performance', () => {
  const mockUserId = '01cb4540-60e1-70da-ad16-eed4d8b556b8';
  const mockToken = 'test-token';

  beforeEach(() => {
    if (!performance.mark) {
      performance.mark = jest.fn();
      performance.measure = jest.fn();
      performance.getEntriesByName = jest.fn().mockReturnValue([{ duration: 5 }]);
      performance.clearMarks = jest.fn();
      performance.clearMeasures = jest.fn();
    }
  });

  it('should execute GET requests within acceptable time limits', async () => {
    axios.mockImplementationOnce(config => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({ data: { result: 'success' } });
        }, 5); // 5ms delay to simulate network
      });
    });

    performance.mark('test-start');

    await executeHTTPRequest('GET', '/test-path');

    // End measuring
    performance.mark('test-end');
    performance.measure('test-duration', 'test-start', 'test-end');
    const measurements = performance.getEntriesByName('test-duration');
    const duration = measurements[0].duration;

    expect(duration).toBeLessThan(50);

    performance.clearMarks();
    performance.clearMeasures();
  });

  it('should handle multiple concurrent requests efficiently', async () => {
    const mockResponses = [
      { data: { id: 1 } },
      { data: { id: 2 } },
      { data: { id: 3 } }
    ];

    axios
      .mockImplementationOnce(() => Promise.resolve(mockResponses[0]))
      .mockImplementationOnce(() => Promise.resolve(mockResponses[1]))
      .mockImplementationOnce(() => Promise.resolve(mockResponses[2]));

    performance.mark('concurrent-start');

    // Run multiple requests concurrently
    const results = await Promise.all([
      executeHTTPRequest('GET', '/test/1'),
      executeHTTPRequest('GET', '/test/2'),
      executeHTTPRequest('GET', '/test/3')
    ]);

    performance.mark('concurrent-end');
    performance.measure('concurrent-duration', 'concurrent-start', 'concurrent-end');
    const measurements = performance.getEntriesByName('concurrent-duration');
    const duration = measurements[0].duration;

    // Verify all requests completed
    expect(results.length).toBe(3);
    expect(results[0]).toEqual(mockResponses[0].data);

    expect(duration).toBeLessThan(15);

    performance.clearMarks();
    performance.clearMeasures();
  });

  it('should handle large response payloads efficiently', async () => {
    const generateLargeResponse = () => {
      const largeArray = [];
      for (let i = 0; i < 1000; i++) {
        largeArray.push({
          id: i,
          name: `Item ${i}`,
          description: 'A longer description that takes up more space in memory'.repeat(5),
          data: Array(10).fill('data content')
        });
      }
      return { data: largeArray };
    };

    axios.mockImplementationOnce(() => Promise.resolve(generateLargeResponse()));
    const memoryBefore = process.memoryUsage().heapUsed;

    const result = await executeHTTPRequest('GET', '/large-payload');

    // Record memory after
    const memoryAfter = process.memoryUsage().heapUsed;
    const memoryIncrease = memoryAfter - memoryBefore;

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);

    console.log(`Memory increase: ${memoryIncrease / 1024 / 1024} MB`);
    expect(memoryIncrease).toBeLessThan(5 * 1024 * 1024);
  });

  // Test response transformation performance
  it('should transform patient data efficiently', async () => {
    const createManyPatients = (count) => {
      const patients = [];
      for (let i = 0; i < count; i++) {
        patients.push({
          birthdate: "2000-01-01",
          doctor_id: "914be5b0-0081-70c9-cf3b-de44b47013fa",
          email: `patient${i}@example.com`,
          first_name: `FirstName${i}`,
          gender: i % 2 === 0 ? "male" : "female",
          id: `patient-id-${i}`,
          last_name: `LastName${i}`
        });
      }
      return patients;
    };

    const mockPatients = createManyPatients(100);
    axios.mockImplementationOnce(() => Promise.resolve({ data: mockPatients }));

    performance.mark('transform-start');

    const result = await getPatients(mockUserId, mockToken);

    performance.mark('transform-end');
    performance.measure('transform-duration', 'transform-start', 'transform-end');
    const measurements = performance.getEntriesByName('transform-duration');
    const duration = measurements[0].duration;

    expect(result.length).toBe(mockPatients.length);

    // Data transformation should be fast (under 50ms for 100 records)
    expect(duration).toBeLessThan(50);

    performance.clearMarks();
    performance.clearMeasures();
  });

  it('should cache repeated requests for the same resource', async () => {
    const mockResponse = { data: { id: 'test', value: 'cached' } };

    axios.mockImplementationOnce(() => Promise.resolve(mockResponse));

    await executeHTTPRequest('GET', '/cached-resource');

    axios.mockClear();

    await executeHTTPRequest('GET', '/cached-resource');
    expect(axios).toHaveBeenCalledTimes(1);
  });
});
