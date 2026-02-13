import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Coordenadas por defecto (Tucumán)
const DEFAULT_POSITION: [number, number] = [-26.847964, -65.281263]; 

// Icono personalizado con "GLOW" Dorado
const neonIcon = L.divIcon({
  className: 'custom-neon-icon',
  html: `<div class="w-4 h-4 bg-[#C9A227] rounded-full shadow-[0_0_15px_#C9A227] border-2 border-white relative">
            <div class="absolute -inset-2 bg-[#C9A227]/30 rounded-full animate-ping"></div>
         </div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

interface MapaOscuroProps {
    nombre?: string;
    direccion?: string;
}

export const MapaOscuro = ({ nombre = "SÉNECA", direccion = "Tu Estilo" }: MapaOscuroProps) => {
  return (
    // Contenedor con altura fija y bordes redondeados
    <div className="h-full w-full rounded-xl overflow-hidden border border-[#C9A227]/20 shadow-lg relative z-0">
      <MapContainer 
        center={DEFAULT_POSITION} 
        zoom={16} 
        scrollWheelZoom={false} 
        dragging={false} // Opcional: Bloquea el arrastre si quieres que sea solo visual
        zoomControl={false}
        className="h-full w-full"
        style={{ background: '#121212' }}
      >
        {/* Capa Oscura (Dark Matter) */}
        <TileLayer
          attribution='&copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        <Marker position={DEFAULT_POSITION} icon={neonIcon}>
          <Popup className="custom-popup">
            <div className="text-center">
              <strong className="text-[#C9A227] uppercase font-bold tracking-widest">{nombre}</strong><br />
              <span className="text-slate-600 text-[10px]">{direccion}</span>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
      
      {/* Overlay para darle profundidad */}
      <div className="absolute inset-0 pointer-events-none border border-white/5 rounded-xl shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] z-[400]"></div>
    </div>
  );
};