import { useEffect, useState } from 'react';
import { getServicios, createServicio, updateServicio, type Servicio } from '../api/servicios';
import { ServiceModal } from '../components/dashboard/ServiceModal';
import { Edit, Power, Star, Clock, CheckCircle, Plus } from 'lucide-react';

const AdminServicios = () => {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Servicio | null>(null);

  const cargarServicios = async () => {
    const data = await getServicios();
    // Ordenamos: Primero los activos, luego los inactivos
    data.sort((a, b) => (Number(b.activo) - Number(a.activo)));
    setServicios(data);
  };

  useEffect(() => { cargarServicios(); }, []);

  const handleNew = () => {
    setEditingService(null);
    setIsModalOpen(true);
  };

  const handleEdit = (servicio: Servicio) => {
    setEditingService(servicio);
    setIsModalOpen(true);
  };

  const handleSave = async (data: Partial<Servicio>) => {
    try {
      if (editingService) {
        await updateServicio(editingService.id, data);
      } else {
        await createServicio(data as any);
      }
      cargarServicios();
    } catch (error) {
      console.error(error);
      alert('Error al guardar');
    }
  };

  const toggleEstado = async (servicio: Servicio) => {
    try {
        await updateServicio(servicio.id, { activo: !servicio.activo });
        cargarServicios();
    } catch (error) {
        console.error(error);
    }
  };

  return (
    // 1. FONDO CLARO (bg-slate-50)
    <div className="p-8 w-full min-h-screen bg-slate-50"> 
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
            {/* 2. TEXTO OSCURO */}
            <h1 className="text-3xl font-bold text-slate-900">Servicios y Precios</h1>
            <p className="text-slate-500 mt-1">Administra el catálogo que ven tus clientes.</p>
        </div>
        <button 
            onClick={handleNew}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition flex items-center gap-2"
        >
            <Plus size={20} /> Nuevo Servicio
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {servicios.map((servicio) => (
          <div 
            key={servicio.id} 
            // 3. TARJETAS BLANCAS CON SOMBRA
            className={`relative bg-white rounded-2xl p-6 transition-all duration-300 border
                ${servicio.activo 
                    ? 'border-slate-200 shadow-md hover:shadow-xl hover:-translate-y-1' 
                    : 'border-slate-100 bg-slate-50 opacity-70 grayscale' // Estilo Inactivo más sutil
                }
            `}
          >
            {/* BADGE POPULAR */}
            {servicio.popular && servicio.activo && (
                <div className="absolute -top-3 left-6 bg-yellow-400 text-yellow-900 text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm z-10 border border-yellow-300">
                    <Star size={12} fill="currentColor" /> POPULAR
                </div>
            )}

            {/* HEADER TARJETA */}
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-slate-800 w-3/4 leading-tight">{servicio.nombre}</h3>
                
                {/* 4. BADGES ESTILO PASTEL */}
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border
                    ${servicio.activo 
                        ? 'bg-green-100 text-green-700 border-green-200' 
                        : 'bg-slate-200 text-slate-500 border-slate-300'
                    }`}
                >
                    {servicio.activo ? 'ACTIVO' : 'INACTIVO'}
                </span>
            </div>

            {/* PRECIO EN AZUL */}
            <div className="text-3xl font-bold text-blue-600 mb-2 tracking-tight">
                ${servicio.precio}
            </div>
            
            <div className="flex items-center gap-2 text-slate-500 text-sm mb-6 font-medium">
                <Clock size={16} className="text-blue-400" /> {servicio.duracionMinutos} minutos
            </div>

            {/* LISTA DE FEATURES */}
            <div className="space-y-2 mb-8 min-h-[50px]">
                {servicio.features ? (
                    servicio.features.split(',').slice(0, 2).map((feat, i) => (
                        <p key={i} className="text-sm text-slate-600 flex items-center gap-2">
                            <CheckCircle size={14} className="text-green-500" /> 
                            {feat.trim()}
                        </p>
                    ))
                ) : (
                    <p className="text-xs text-slate-400 italic pl-1">Sin detalles adicionales.</p>
                )}
            </div>

            {/* ACCIONES (Botones más limpios) */}
            <div className="grid grid-cols-2 gap-3 mt-auto pt-4 border-t border-slate-100">
                <button 
                    onClick={() => handleEdit(servicio)}
                    className="flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 py-2.5 rounded-lg font-bold text-sm transition"
                >
                    <Edit size={16} /> Editar
                </button>
                
                <button 
                    onClick={() => toggleEstado(servicio)}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-sm transition border
                        ${servicio.activo 
                            ? 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100' 
                            : 'bg-green-50 text-green-600 border-green-100 hover:bg-green-100'
                        }
                    `}
                >
                    <Power size={16} /> {servicio.activo ? 'Desactivar' : 'Activar'}
                </button>
            </div>

          </div>
        ))}
      </div>

      {/* RENDERIZADO DEL MODAL */}
      <ServiceModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        servicio={editingService}
      />

    </div>
  );
};

export default AdminServicios;