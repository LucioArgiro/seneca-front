import { useMutation } from '@tanstack/react-query';
import { registerRequest } from '../api/auth';
import { useNavigate } from 'react-router-dom';

interface RegisterData {
  fullname: string;
  email: string;
  pass: string;
}

export const useRegister = () => {
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: (data: RegisterData) => registerRequest(data), 
    onSuccess: () => {
      alert('¡Cuenta creada con éxito! Ahora inicia sesión.');
      navigate('/login');
    },
    onError: (error: any) => {
      console.error(error);
      alert(error.response?.data?.message || 'Error al registrarse');
    },
  });

  return {
    register: mutation.mutate,     
    isLoading: mutation.isPending, 
    error: mutation.error         
  };
};