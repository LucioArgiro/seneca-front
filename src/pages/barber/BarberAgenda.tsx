import { AgendaModal } from '../../components/admin/AgendaModal';
import { CobroModal } from '../../components/dashboard/CobroModal';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAdminAgenda } from '../../hooks/useAdminAgenda';
import { useAuthStore } from '../../store/auth';
import { MobileAgendaList } from '../../components/barber/MobileAgendaList';
import { MobileSlotOptions } from '../../components/barber/MobileSlotOptions';
import { Toaster, toast } from 'react-hot-toast';

export const BarberAgenda = () => {
  const { usuario } = useAuthStore();
  const { agendaState, agendaData, cobroState, handlers } = useAdminAgenda(usuario?.id);

  const { selectedDate, modalConfig, popover, handlePrevDay, handleNextDay, closeModal, closePopover } = agendaState;
  const soloYoBarbero = agendaData.barberos.filter(b => b.usuario.id === usuario?.id);

  // 👇 1. IMPORTANTE: Asegúrate de extraer 'deleteBloqueo' aquí
  const { turnos, bloqueos, isLoading, createBloqueo, deleteBloqueo } = agendaData;

  const { turnoParaCobrar, setTurnoParaCobrar, isProcessing } = cobroState;
  const { handleConfirmBloqueo, handlePopoverAction, handleCobrarConfirm } = handlers;

  const handleTurnoClick = (turno: any) => {
    const estado = turno.estado ? turno.estado.toString().toUpperCase() : '';
    if (estado === 'COMPLETADO' || estado === 'COBRADO') {
      toast.success('Este turno ya fue cobrado', { icon: '✅', style: { borderRadius: '10px', background: '#333', color: '#fff' } });
      return;
    }
    setTurnoParaCobrar(turno);
  };

  const handleMobileSlotClick = (timeString: string) => {
    if (!handlers.handleSlotClick) return;
    const [horas] = timeString.split(':').map(Number);
    const mockEvent = { clientX: 0, clientY: 0, preventDefault: () => { }, stopPropagation: () => { } };
    handlers.handleSlotClick(mockEvent as any, soloYoBarbero[0], horas);
  };

  if (isLoading) return <div className="h-screen flex items-center justify-center bg-[#131313] text-[#C9A227] animate-pulse">CARGANDO...</div>;

  return (
    <>
      <div className="h-screen flex flex-col bg-[#131313] font-sans text-slate-200 overflow-y-auto overflow-x-hidden relative z-0">
        {/* HEADER */}
        <div className="w-full bg-[#131313] px-4 py-4 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0 sticky top-0 z-30 shadow-md">
          <div className="w-full md:w-auto text-center md:text-left">
            <h1 className="text-xl font-black text-white tracking-tight">Mi Agenda</h1>
            <p className="text-zinc-500 text-sm">Gestiona tus turnos del día</p>
          </div>
          <div className="flex items-center gap-6 bg-[#1A1A1A] p-1.5 rounded-xl border border-white/5 shadow-sm">
            <button onClick={handlePrevDay} className="p-2 hover:bg-[#C9A227]/20 hover:text-[#C9A227] rounded-lg transition text-zinc-400"><ChevronLeft size={20} /></button>
            <span className="text-base font-bold text-white capitalize select-none min-w-[120px] text-center">{selectedDate.format('DD MMMM')}</span>
            <button onClick={handleNextDay} className="p-2 hover:bg-[#C9A227]/20 hover:text-[#C9A227] rounded-lg transition text-zinc-400"><ChevronRight size={20} /></button>
          </div>
        </div>

        {/* LISTA */}
        <div className="flex-1 w-full max-w-3xl mx-auto relative z-0">
          <MobileAgendaList
            turnos={turnos}
            bloqueos={bloqueos}
            onTurnoClick={handleTurnoClick}
            onSlotClick={handleMobileSlotClick}
            // 👇 2. PASAMOS LA FUNCIÓN DE BORRAR AL HIJO
            onDeleteBloqueo={(id) => deleteBloqueo.mutate(id)}
          />
        </div>
      </div>

      {/* MODALES */}
      <div className="relative z-[9999]">
        <MobileSlotOptions
          isOpen={popover.isOpen}
          onClose={closePopover}
          onAction={handlePopoverAction}
          data={popover.dataContext}
        />
        <AgendaModal
          isOpen={modalConfig.isOpen}
          config={modalConfig}
          selectedDate={selectedDate}
          isPending={createBloqueo.isPending}
          onClose={closeModal}
          onConfirm={handleConfirmBloqueo}
        />
        <CobroModal
          isOpen={!!turnoParaCobrar}
          onClose={() => setTurnoParaCobrar(null)}
          turno={turnoParaCobrar}
          isProcessing={isProcessing}
          onConfirm={handleCobrarConfirm}
        />
      </div>

      <Toaster position="bottom-right" />
    </>
  );
};

export default BarberAgenda;