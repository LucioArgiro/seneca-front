import { AgendaGrid } from '../../components/admin/AgendaGrid';
import { AgendaModal } from '../../components/admin/AgendaModal';
import { AgendaPopover } from '../../components/admin/AgendaPopover';
import { CobroModal } from '../../components/dashboard/CobroModal';
import { ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import { useAdminAgenda } from '../../hooks/useAdminAgenda';
import { toast } from 'react-hot-toast'; // 👈 Importamos toast para dar feedback

export const AdminAgendaGlobal = () => {
  const {
    agendaState,
    agendaData,
    cobroState,
    handlers
  } = useAdminAgenda();

  const { selectedDate, modalConfig, popover, handlePrevDay, handleNextDay, openGeneralModal, closeModal, closePopover } = agendaState;
  const { barberos, turnos, bloqueos, isLoading, createBloqueo, deleteBloqueo } = agendaData;
  const { turnoParaCobrar, setTurnoParaCobrar, isProcessing } = cobroState;
  const { handleConfirmBloqueo, handleSlotClick, handlePopoverAction, handleCobrarConfirm } = handlers;

  // --- LÓGICA DE CLICK EN TURNO ---
  const handleTurnoClick = (turno: any) => {
    // 1. Si ya está completado, solo avisamos y NO abrimos modal
    if (turno.estado === 'COMPLETADO') {
      toast.success(`Turno ya cobrado: $${turno.servicio?.precio || 0}`, {
        icon: '✅',
        style: { background: '#131313', color: '#fff', border: '1px solid #22c55e' }
      });
      return;
    }

    // 2. Si está cancelado, avisamos
    if (turno.estado === 'CANCELADO') {
      toast.error('Este turno fue cancelado', {
        style: { background: '#131313', color: '#fff', border: '1px solid #ef4444' }
      });
      return;
    }

    // 3. Si es "CONFIRMADO" (o Pendiente), abrimos el modal de cobro
    setTurnoParaCobrar(turno);
  };

  if (isLoading) return <div className="h-screen flex items-center justify-center bg-[#131313] text-[#C9A227] animate-pulse font-serif tracking-widest">CARGANDO AGENDA...</div>;

  return (
    <div className="h-screen flex flex-col bg-[#131313] font-sans text-slate-200 overflow-y-auto">

      {/* ... (HEADER SE MANTIENE IGUAL) ... */}
      <div className="w-full bg-[#131313] px-4 md:px-6 py-4 border-b border-slate-800 flex z-[27]flex-col md:flex-row justify-between items-center gap-4 shrink-0">
        <div className="w-full md:w-auto flex justify-between z-[27] md:justify-start items-center">
          <h1 className="text-xl md:text-2xl font-black text-white flex items-center gap-2 tracking-tight">
            Agenda Global
            <span className="text-[#D4AF37] text-[10px] md:text-xs font-bold tracking-widest uppercase bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/20">
              Admin
            </span>
          </h1>
        </div>

        <div className="flex gap-3 w-full md:w-auto z-[27] justify-between md:justify-end">
          <div className="flex items-center gap-1 md:gap-10 bg-[#1f1f1f] p-1 rounded-lg shadow-inner flex-1 md:flex-none justify-between md:justify-start">
            <button onClick={handlePrevDay} className="p-1.5 md:p-2 hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] rounded-md transition text-[#131313]">
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm md:text-base font-bold text-slate-200 capitalize select-none min-w-[100px] text-center">
              {selectedDate.format('D MMM, YYYY')}
            </span>
            <button onClick={handleNextDay} className="p-1.5 md:p-2 hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] rounded-md transition text-[#131313]">
              <ChevronRight size={18} />
            </button>
          </div>

          <button onClick={openGeneralModal} className="relative overflow-hidden group text-[#D4AF37] hover:bg-[#C9A227] hover:text-[#111827] text-sm px-4 py-2 rounded-lg font-bold flex items-center justify-center gap-2 border border-[#D4AF37]/30 whitespace-nowrap transition-all duration-300 transform hover:-translate-y-0.5 ">
            <div className="relative z-10 flex items-center gap-2">
              <Lock size={16} />
              <span className="hidden md:inline tracking-wide">BLOQUEAR DÍA</span>
            </div>
          </button>
        </div>
      </div>

      {/* GRILLA */}
      <AgendaGrid
        barberos={barberos}
        turnos={turnos}
        bloqueos={bloqueos}
        currentTimePosition={null}
        onSlotClick={handleSlotClick}
        onDeleteBloqueo={(id) => deleteBloqueo.mutate(id)}
        onTurnoClick={handleTurnoClick}
      />

      {/* ... (MODALES SE MANTIENEN IGUAL) ... */}
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

      <CobroModal
        isOpen={!!turnoParaCobrar}
        onClose={() => setTurnoParaCobrar(null)}
        turno={turnoParaCobrar}
        isProcessing={isProcessing}
        onConfirm={handleCobrarConfirm}
      />
    </div>
  );
};