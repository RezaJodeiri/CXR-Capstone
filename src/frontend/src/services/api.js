import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(`${API_BASE_URL}/predict`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.prediction;
  } catch (error) {
    console.error('Error uploading file', error);
    throw error;
  }
};
