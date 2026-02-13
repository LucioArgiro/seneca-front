import { useEffect, useState } from 'react';
import { getServicios, createServicio, updateServicio, type Servicio } from '../../api/servicios';
import { ServiceModal } from '../../components/dashboard/ServiceModal';
import { Edit, Power, Star, Clock, CheckCircle, Plus } from 'lucide-react';

const AdminServicios = () => {
    const [servicios, setServicios] = useState<Servicio[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<Servicio | null>(null);

    const cargarServicios = async () => {
        const data = await getServicios();
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
        // 1. FONDO GENERAL: #131313
        <div className="p-4 md:p-8 w-full min-h-screen bg-[#131313] text-slate-200">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Servicios y Precios</h1>
                    <p className="text-slate-400 mt-2 text-sm md:text-base">Administra el catálogo exclusivo para tus clientes.</p>
                </div>

                {/* BOTÓN NUEVO SERVICIO (Dorado Nuevo) */}
                <button onClick={handleNew} className=" w-full md:w-auto text-[#C9A227] bg-[#131313] rounded-lg hover:bg-[#C9A227] hover:text-[#131313] transition border border-[#C9A227] px-6 py-3 rounded-xl font-bold transition-all transform hover:-translate-y-0.5 active:scale-95 border border-[#C9A227]/50 flex items-center justify-center gap-2">
                    <div className="bg-black/20 p-1 rounded-full border"><Plus size={18} /></div>
                    <span>NUEVO SERVICIO</span>
                </button>
            </div>

            {/* GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {servicios.map((servicio) => (
                    <div
                        key={servicio.id}
                        className={`
                relative rounded-2xl p-6 transition-all duration-300 border flex flex-col group
                ${servicio.activo
                                ? 'bg-granular-dark border-[#C9A227]/20 hover:border-[#C9A227]/60 hover:shadow-[0_0_20px_rgba(201,162,39,0.1)] shadow-lg'
                                : 'bg-[#0f0f0f] border-slate-800 opacity-60 grayscale hover:opacity-100 hover:grayscale-0'
                            }
            `}
                    >
                        {/* BADGE POPULAR */}
                        {servicio.popular && servicio.activo && (
                            <div className="absolute -top-3 left-6 bg-gradient-to-r text-[#C9A227] bg-[#131313] rounded-lg hover:bg-[#C9A227] hover:text-[#131313] transition border border-[#C9A227] text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg z-10 border border-[#C9A227] tracking-widest uppercase">
                                <Star size={10} fill="currentColor" />Mas Popular</div>
                        )}

                        {/* HEADER TARJETA */}
                        <div className="flex justify-between items-start mb-4">
                            <h3 className={`text-xl font-bold w-3/4 leading-tight ${servicio.activo ? 'text-white' : 'text-slate-500'}`}>{servicio.nombre}</h3>
                            <span className={`text-[10px] font-bold px-2 py-1 uppercase tracking-wider ${servicio.activo? ' text-[#C9A227] ': 'bg-slate-800 text-slate-500 border-slate-700'}`}>{servicio.activo ? 'ACTIVO' : 'INACTIVO'}</span>
                        </div>

                        {/* PRECIO Y DURACIÓN */}
                        <div className="text-3xl font-black text-[#C9A227] mb-2 tracking-tight flex items-baseline gap-1">
                            <span className="text-lg">$</span>{servicio.precio}
                        </div>

                        <div className="flex items-center gap-2 text-slate-400 text-sm mb-6 font-medium"><Clock size={16} className="text-slate-500" /> {servicio.duracionMinutos} minutos</div>

                        {/* LISTA DE FEATURES */}
                        <div className="space-y-3 mb-6 min-h-[50px]">
                            {servicio.features ? (servicio.features.split(',').slice(0, 2).map((feat, i) => (<p key={i} className="text-sm text-slate-300 flex items-center gap-2"><CheckCircle size={14} className="text-[#C9A227] shrink-0" /><span className="truncate">{feat.trim()}</span></p>))) : (<p className="text-xs text-slate-600 italic pl-1">Sin detalles adicionales.</p>)}</div>

                        {/* ACCIONES */}
                        <div className="grid grid-cols-2 gap-3 mt-auto pt-5 border-t border-white/5">
                            <button onClick={() => handleEdit(servicio)} className="flex items-center justify-center gap-2 bg-[#252525] hover:bg-[#333] text-slate-300 border border-white/5 py-3 rounded-xl font-bold text-xs transition active:scale-95 hover:text-white"><Edit size={16} /> EDITAR</button>

                            <button onClick={() => toggleEstado(servicio)} className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs transition border active:scale-95 ${servicio.activo? 'bg-red-900/10 text-red-400 border-red-900/30 hover:bg-red-900/20':'bg-emerald-900/10 text-emerald-400 border-emerald-900/30 hover:bg-emerald-900/20'}`}><Power size={16} /> {servicio.activo ?'DESACTIVAR' : 'ACTIVAR'}</button></div>
                    </div>
                ))}
            </div>

            <ServiceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} servicio={editingService}/>

        </div>
    );
};

export default AdminServicios;