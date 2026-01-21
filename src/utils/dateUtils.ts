import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/es'; 

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('es');

export const formatearHoraArgentina = (fechaString: string) => {
  if (!fechaString) return '';
  return dayjs.utc(fechaString)
    .tz("America/Argentina/Buenos_Aires")
    .format("hh:mm a");
};

export const formatearFechaCompleta = (fechaString: string) => {
  if (!fechaString) return '';

  return dayjs.utc(fechaString)
    .tz("America/Argentina/Buenos_Aires")
    .format("D [de] MMMM [de] YYYY");
};