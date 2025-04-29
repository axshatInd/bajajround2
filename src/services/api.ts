import axios from 'axios';
import { FormResponse } from '@/types/form';

export const createUser = async (rollNumber: string, name: string) => {
  const response = await axios.post(
    'https://dynamic-form-generator-9rl7.onrender.com/create-user',
    { rollNumber, name },
    { headers: { 'Content-Type': 'application/json' } }
  );
  return response.data;
};

export const getForm = async (rollNumber: string): Promise<FormResponse> => {
  const response = await axios.get(
    `https://dynamic-form-generator-9rl7.onrender.com/get-form?rollNumber=${rollNumber}`
  );
  return response.data;
};
