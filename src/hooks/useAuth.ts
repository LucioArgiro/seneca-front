import { useMutation } from '@tanstack/react-query';
import { registerRequest } from '../api/auth'; // TS ya sabe qué tipos tiene esta función
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast'; // Usamos toast para que sea más bonito que un alert

export const useRegister = () => {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: registerRequest,
    onSuccess: () => {
      toast.success('¡Cuenta creada con éxito! Por favor inicia sesión.');
      navigate('/login');
    },
    onError: (error: any) => {
      console.error(error);
      const mensaje = error.response?.data?.message || 'Error al registrarse';
      // Si el error es un array (validaciones de NestJS), mostramos el primero
      if (Array.isArray(mensaje)) {
        toast.error(mensaje[0]);
      } else {
        toast.error(mensaje);
      }
    },
  });

  return {
    register: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error
  };
};