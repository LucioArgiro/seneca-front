import { useState } from 'react';
import dayjs from 'dayjs';

export const useAgendaState = () => {
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [modalConfig, setModalConfig] = useState({ isOpen: false, type: 'GENERAL' as const });
    const [popover, setPopover] = useState({ isOpen: false, x: 0, y: 0, dataContext: undefined });

    // Acciones de UI
    const handlePrevDay = () => setSelectedDate(d => d.subtract(1, 'day'));
    const handleNextDay = () => setSelectedDate(d => d.add(1, 'day'));
    const openGeneralModal = () => setModalConfig({ isOpen: true, type: 'GENERAL' });
    const closeModal = () => setModalConfig({ ...modalConfig, isOpen: false });
    const closePopover = () => setPopover({ ...popover, isOpen: false });
    const openPopover = (x: number, y: number, dataContext: any) => 
        setPopover({ isOpen: true, x, y, dataContext });

    return {
        selectedDate,
        modalConfig,
        popover,
        handlePrevDay,
        handleNextDay,
        openGeneralModal,
        setModalConfig, 
        closeModal,
        openPopover,
        closePopover
    };
};