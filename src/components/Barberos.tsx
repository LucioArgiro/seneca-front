import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// Datos de prueba (luego podrían venir de tu API)
const BARBEROS = [
  {
    nombre: "Carlos Ruiz",
    rol: "Master Barber",
    rating: 5.0,
    foto: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80", // Foto real
  },
  {
    nombre: "Ana Gómez",
    rol: "Estilista Senior",
    rating: 4.9,
    foto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80",
  },
  {
    nombre: "Diego Torres",
    rol: "Especialista en Barba",
    rating: 4.8,
    foto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&q=80",
  }
];

export const Barberos = () => {
  const navigate = useNavigate();
  return (
    <section id="barberos" className="py-20 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4">

        {/* TÍTULO DE LA SECCIÓN */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Conoce a nuestros Barberos</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Selecciona a tu profesional favorito y agenda tu cita con total confianza.
          </p>
        </div>

        {/* GRID DE TARJETAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BARBEROS.map((barbero, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition duration-300 border border-slate-100">

              {/* FOTO CIRCULAR */}
              <div className="flex justify-center -mt-12 mb-4">
                <img
                  src={barbero.foto}
                  alt={barbero.nombre}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                />
              </div>

              <div className="text-center">
                <h3 className="text-xl font-bold text-slate-800">{barbero.nombre}</h3>
                <p className="text-blue-600 font-medium text-sm mb-2">{barbero.rol}</p>

                {/* ESTRELLAS */}
                <div className="flex justify-center items-center gap-1 text-yellow-500 mb-4">
                  <Star size={16} fill="currentColor" />
                  <span className="text-slate-700 font-bold text-sm">{barbero.rating}</span>
                </div>

                <button
                  onClick={() => navigate('/login')} // <--- CONEXIÓN AQUÍ
                  className="w-full py-2 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 transition"
                >
                  Ver Agenda
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};