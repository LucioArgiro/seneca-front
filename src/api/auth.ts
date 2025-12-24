import api from './axios';


export const loginRequest = async (email: string, pass: string) => {
  const { data } = await api.post('/auth/login', { email, password: pass });
  return data; 
};

export const registerRequest = async (user: { fullname: string; email: string; pass: string }) => {
  const { data } = await api.post('/auth/register', {
    fullname: user.fullname,
    email: user.email,
    password: user.pass 
  });
  return data;
};