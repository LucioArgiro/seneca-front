// src/utils/horarios.ts

export const DIAS_SEMANA = [
    'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'
];

export const getHorariosPorDefecto = () => {
    return DIAS_SEMANA.map((dia) => {
        const esDomingo = dia === 'Domingo';
        const esSabado = dia === 'Sábado';

        // Configuración base (Lunes a Viernes)
        let config = {
            dia: dia,
            abierto: !esDomingo, // Domingo cerrado por defecto
            manana: { desde: '09:00', hasta: '13:00' },
            tarde: { activo: true, desde: '17:00', hasta: '22:00' }
        };

        // Excepción Sábado (Solo mañana, ejemplo)
        if (esSabado) {
            config.manana = { desde: '09:00', hasta: '14:00' };
            config.tarde = { activo: false, desde: '17:00', hasta: '21:00' };
        }

        // Excepción Domingo
        if (esDomingo) {
            config.abierto = false;
        }

        return config;
    });
};