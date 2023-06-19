import moment from "moment";
import "moment-timezone";

moment.tz.setDefault("España/Madrid"); // Configura la zona horaria globalmente

export function getLocalDateTime(): moment.Moment {
  return moment().locale("es");
}

// Como utilizar el timezone para la guardar la fecha y hora de la ubicación local del sistema