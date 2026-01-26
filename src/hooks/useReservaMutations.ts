import { useMutation, useQueryClient } from '@tanstack/react-query';
import { turnosApi, type CreateTurnoDto } from '../api/turnos';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast'; // Opcional: Para feedback visual

interface ReservaParams {
  data: CreateTurnoDto;
  opcionPago: 'TOTAL' | 'SENIA' | 'LOCAL'; // 👈 Agregamos LOCAL
  isReprogramming: boolean;
  turnoOriginalId?: string;
}

export const useReservaActions = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ data, opcionPago, isReprogramming, turnoOriginalId }: ReservaParams) => {
      if (isReprogramming && turnoOriginalId) {
        return await turnosApi.reprogramarTurno(turnoOriginalId, data.fecha);
      }
      const nuevoTurno = await turnosApi.createTurno(data);
      if (opcionPago === 'LOCAL') {
        return { redirecting: false, turno: nuevoTurno };
      } else {
        const { url } = await turnosApi.crearPreferenciaPago(nuevoTurno.id, opcionPago);
        window.location.href = url;
        return { redirecting: true };
      }
    },
    onSuccess: (result: any) => {
      if (result?.redirecting) return;
      queryClient.invalidateQueries({ queryKey: ['mis-turnos'] });
      toast.success('¡Reserva confirmada con éxito!');
      navigate('/panel?status=success');
    },
    onError: (error: any) => {
      console.error("Error en reserva:", error);
    }
  });

  return mutation;
};