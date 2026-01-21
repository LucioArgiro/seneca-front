import { AgendaGrid } from '../../components/AgendaGrid';
import { AgendaModal } from '../../components/AgendaModal';
import { AgendaPopover } from '../../components/AgendaPopover';
import { ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import { useAgendaData } from '../../hooks/useAgendaData';
import { useAgendaState } from '../../hooks/useAgendaState';
import { type BarberoPerfil } from '../../types';

export const AdminAgendaGlobal = () => {
  // 1. Hooks Personalizados (Toda la lógica compleja está aquí dentro)
  const { 
    selectedDate, 
    modalConfig, 
    popover, 
    handlePrevDay, 
    handleNextDay, 
    openGeneralModal, 
    closeModal, 
    closePopover, 
    openPopover, 
    setModalConfig 
  } = useAgendaState();
  
  const { 
    barberos, 
    turnos, 
    bloqueos, 
    isLoading, 
    createBloqueo, 
    deleteBloqueo 
  } = useAgendaData(selectedDate);

  // --- HANDLERS (Controladores de Eventos) ---
  
  // A. Confirmar Bloqueo (Desde el Modal)
  const handleConfirmBloqueo = (data: { motivo: string, horaInicio?: string, horaFin?: string }) => {
      const isGeneral = modalConfig.type === 'GENERAL';
      const fechaBase = selectedDate.format('YYYY-MM-DD');

      createBloqueo.mutate({
          fechaInicio: isGeneral 
            ? selectedDate.startOf('day').format('YYYY-MM-DDTHH:mm:ss')
            : `${fechaBase}T${data.horaInicio}:00`,
          fechaFin: isGeneral
            ? selectedDate.endOf('day').format('YYYY-MM-DDTHH:mm:ss')
            : `${fechaBase}T${data.horaFin}:00`,
          motivo: data.motivo,
          esGeneral: isGeneral,
          barberoId: !isGeneral ? (modalConfig as any).barberoId : undefined
      }, { 
        onSuccess: closeModal 
      });
  };

  // B. Clic en la Grilla (Abre Popover)
  const handleSlotClick = (e: React.MouseEvent, barbero: BarberoPerfil, hour: number) => {
      const timeString = `${hour.toString().padStart(2, '0')}:00`;
      const endTimeString = `${(hour + 1).toString().padStart(2, '0')}:00`;
      
      openPopover(e.clientX, e.clientY, {
          barberoId: barbero.id,
          barberoNombre: `${barbero.usuario.nombre} ${barbero.usuario.apellido}`,
          horaInicio: timeString,
          horaFin: endTimeString
      });
  };

  // C. Acción del Popover (Bloquear, Descanso, etc)
  const handlePopoverAction = (action: string) => {
      const { dataContext } = popover as any;
      closePopover(); // Cerramos el menú flotante

      if (action === 'BLOQUEAR') {
          setModalConfig({ isOpen: true, type: 'PARTICULAR', ...dataContext });
      } else if (action === 'DESCANSO') {
           // Atajo: Abre el modal pero ya con el motivo escrito
           setModalConfig({ isOpen: true, type: 'PARTICULAR', ...dataContext });
           // Nota: Si quieres que el motivo se precargue, asegúrate de pasar 'motivoDefault' a tu AgendaModal
      } else if (action === 'AGENDAR') {
          // Aquí iría la lógica para abrir el modal de Nuevo Turno
          console.log('Abrir modal de agendar para:', dataContext);
      }
  };

  if (isLoading) return <div className="h-screen flex items-center justify-center text-slate-400">Cargando agenda...</div>;

  return (
    <div className="h-screen flex flex-col bg-white font-sans text-slate-800 overflow-hidden">
        
        {/* HEADER */}
        <div className="bg-white px-6 py-4 border-b border-slate-200 flex justify-between items-center shrink-0">
            <h1 className="text-2xl font-bold text-slate-900">Agenda Global</h1>
            
            <div className="flex gap-4">
                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg shadow-sm">
                    <button onClick={handlePrevDay} className="p-2 hover:bg-white rounded-md transition text-slate-600"><ChevronLeft size={20}/></button>
                    <span className="w-36 text-center font-bold text-slate-700 capitalize select-none">{selectedDate.format('D MMM, YYYY')}</span>
                    <button onClick={handleNextDay} className="p-2 hover:bg-white rounded-md transition text-slate-600"><ChevronRight size={20}/></button>
                </div>
                <button 
                    onClick={openGeneralModal}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-slate-900/20 transition"
                >
                    <Lock size={18}/> <span className="hidden md:inline">Bloquear Día</span>
                </button>
            </div>
        </div>

        {/* GRILLA PRINCIPAL */}
        <AgendaGrid 
            barberos={barberos}
            turnos={turnos}
            bloqueos={bloqueos}
            currentTimePosition={null} // Pasamos null explícitamente para desactivar la línea
            onSlotClick={handleSlotClick}
            onDeleteBloqueo={(id) => deleteBloqueo.mutate(id)}
        />

        {/* MODALES Y FLOTANTES */}
        <AgendaPopover 
            isOpen={popover.isOpen}
            x={popover.x}
            y={popover.y}
            data={popover.dataContext}
            onClose={closePopover}
            onAction={handlePopoverAction}
        />

        <AgendaModal 
            isOpen={modalConfig.isOpen}
            config={modalConfig}
            selectedDate={selectedDate}
            isPending={createBloqueo.isPending}
            onClose={closeModal}
            onConfirm={handleConfirmBloqueo}
        />
    </div>
  );
};