import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { mensajesApi } from '../api/mensajes';

// --- HOOK PARA ENVIAR NUEVOS MENSAJES (Cliente) ---
export const useEnviarMensaje = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mensajesApi.create,
    onSuccess: (data) => {
      console.log('Mensaje enviado:', data);
      queryClient.invalidateQueries({ queryKey: ['mis-mensajes'] });
    },
    onError: (error: any) => {
      console.error('Error al enviar:', error.response?.data || error.message);
    }
  });
};

// --- HOOK PARA CLIENTE (Ver y gestionar mis consultas) ---
export const useMisMensajes = () => {
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ['mis-mensajes'],
    queryFn: mensajesApi.getMyMessages,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchInterval: 3000, // Actualización automática cada 3s
  });

  const deleteMutation = useMutation({
    mutationFn: mensajesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mis-mensajes'] });
      // alert('Mensaje eliminado correctamente'); 
    },
    onError: (error: any) => {
      console.error(error);
      alert('No se pudo eliminar el mensaje');
    }
  });

  const replyMutation = useMutation({
    mutationFn: ({ id, texto }: { id: string, texto: string }) => 
      mensajesApi.replyThread(id, texto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mis-mensajes'] });
    },
    onError: (error: any) => {
        console.error(error);
        alert('Error al enviar la respuesta');
    }
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    borrarMensaje: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    responderMensaje: replyMutation.mutate,
    isReplying: replyMutation.isPending
  };
};

// --- HOOK PARA STAFF/ADMIN (Ver y gestionar buzón global) ---
export const useStaffMensajes = () => {
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ['buzon-staff'],
    queryFn: mensajesApi.getAll,
    refetchInterval: 3000, // Actualización automática cada 3s
  });

  // Mutación para responder
  const replyMutation = useMutation({
    mutationFn: ({ id, respuesta }: { id: string; respuesta: string }) =>
      mensajesApi.reply(id, respuesta),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buzon-staff'] });
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Error al enviar respuesta');
    }
  });

  // 👇 Mutación para borrar (Esta es la que faltaba)
  const deleteMutation = useMutation({
    mutationFn: (id: string) => mensajesApi.delete(id),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['buzon-staff'] });
    },
    onError: (error: any) => {
        console.error(error);
        alert(error.response?.data?.message || 'No se pudo eliminar la conversación');
    }
  });

  const mensajes = query.data || [];
  const pendientes = mensajes.filter((m: any) => !m.respuesta && (!m.replies || m.replies.length === 0));
  const respondidos = mensajes.filter((m: any) => m.respuesta || (m.replies && m.replies.length > 0));

  return {mensajes, pendientes, respondidos, isLoading: query.isLoading, isError: query.isError, responder: replyMutation.mutate, isReplying:replyMutation.isPending, borrarMensaje: deleteMutation.mutate, isDeleting: deleteMutation.isPending};
}