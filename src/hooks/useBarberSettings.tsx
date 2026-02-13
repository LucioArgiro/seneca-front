import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { barberosApi } from '../api/barberos';
import { filesApi } from '../api/files';
import { useClientesCRM } from './useClientesCRM';
import { type UpdateBarberoDto } from '../types';

export const useBarberSettings = () => {
    const { usuario } = useAuthStore();

    // --- 1. LÓGICA DE ESTADÍSTICAS Y CRM ---
    const { clientes, filtros } = useClientesCRM();
    const [statsData, setStatsData] = useState({ promedio: 0, cantidad: 0 });

    useEffect(() => {
        if (usuario?.id) filtros.setBarbero(usuario.id);
    }, [usuario]);

    const stats = useMemo(() => {
        const totalCortes = clientes.reduce((acc, cliente) => acc + cliente.totalTurnos, 0);
        const clientesActivos = clientes.filter(c => c.estadoCliente !== 'INACTIVO').length;

        return {
            cortes: totalCortes,
            activos: clientesActivos,
            rating: statsData.promedio || 0,
            totalReviews: statsData.cantidad || 0
        };
    }, [clientes, statsData]);

    // --- 2. LÓGICA DEL FORMULARIO ---
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [form, setForm] = useState<UpdateBarberoDto>({
        nombre: '', apellido: '', email: '', telefono: '', especialidad: '',
        biografia: '', provincia: '', fotoUrl: '', dni: '', edad: undefined, sexo: ''
    });

    // Cargar datos iniciales
    useEffect(() => {
        const cargarDatos = async () => {
            if (!usuario?.id) return;
            try {
                const data = await barberosApi.getProfile(usuario.id);
                setForm({
                    nombre: data.usuario?.nombre || '',
                    apellido: data.usuario?.apellido || '',
                    email: data.usuario?.email || '',
                    telefono: data.telefono || '',
                    especialidad: data.especialidad || '',
                    biografia: data.biografia || '',
                    provincia: data.provincia || '',
                    fotoUrl: data.fotoUrl || '',
                    dni: data.dni || '',
                    edad: data.edad,
                    sexo: data.sexo || ''
                });
                setStatsData({
                    promedio: Number(data.promedio || 0),
                    cantidad: Number(data.cantidadResenas || 0)
                });
            } catch (error) { console.error(error); }
        };
        cargarDatos();
    }, [usuario]);

    // --- 3. HANDLERS ---

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: name === 'edad' ? Number(value) : value }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const loadingToast = toast.loading("Procesando imagen...", {
            style: { background: '#131313', color: '#C9A227', border: '1px solid #333' }
        });

        try {
            if (form.fotoUrl) {
                try {
                    await filesApi.deleteImage(form.fotoUrl);
                } catch (err) {
                    console.warn("No se pudo eliminar la imagen anterior.", err);
                }
            }

            const url = await barberosApi.uploadImage(file);
            setForm(prev => ({ ...prev, fotoUrl: url }));

            toast.success("Foto de perfil actualizada", {
                id: loadingToast,
                style: { background: '#1A1A1A', color: '#fff', border: '1px solid #C9A227' },
                iconTheme: { primary: '#C9A227', secondary: '#1A1A1A' }
            });

        } catch (error) {
            console.error(error);
            toast.error("Error al subir imagen", { id: loadingToast });
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteImage = async () => {
        const urlToDelete = form.fotoUrl;
        if (!urlToDelete) return;

        toast((t) => (
            <div className="flex flex-col gap-3 min-w-[200px]">
                <div className="flex items-center gap-2">
                    <AlertTriangle size={18} className="text-[#C9A227]" />
                    <span className="font-bold text-sm text-white">¿Borrar foto de perfil?</span>
                </div>
                <p className="text-xs text-slate-400">Se eliminará permanentemente.</p>

                <div className="flex gap-2 mt-1 justify-end">
                    <button
                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 transition"
                        onClick={() => toast.dismiss(t.id)}
                    >
                        Cancelar
                    </button>

                    <button
                        className="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-white transition flex items-center gap-1"
                        onClick={async () => {
                            toast.dismiss(t.id);
                            setUploading(true);
                            const loadingToast = toast.loading("Eliminando...", { style: { background: '#1A1A1A', color: '#fff' } });

                            try {
                                // Usamos la variable segura 'urlToDelete'
                                await filesApi.deleteImage(urlToDelete);
                                setForm(prev => ({ ...prev, fotoUrl: '' }));

                                toast.success("Foto eliminada", {
                                    id: loadingToast,
                                    style: { background: '#1A1A1A', color: '#C9A227', border: '1px solid rgba(201,162,39,0.3)' }
                                });
                            } catch (error) {
                                console.error(error);
                                toast.error("Error al eliminar", { id: loadingToast });
                            } finally {
                                setUploading(false);
                            }
                        }}
                    >
                        <Trash2 size={12} /> Confirmar
                    </button>
                </div>
            </div>
        ), {
            duration: 6000,
            style: {
                background: '#131313',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '16px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
            },
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await barberosApi.updateProfile(form);
            toast.success('¡Perfil guardado correctamente!', {
                style: { background: '#1A1A1A', color: '#fff', border: '1px solid #C9A227' },
                iconTheme: { primary: '#C9A227', secondary: '#1A1A1A' },
                duration: 4000
            });
        } catch {
            toast.error('Error al guardar cambios', {
                style: { background: '#1A1A1A', color: '#ef4444', border: '1px solid #333' }
            });
        } finally {
            setLoading(false);
        }
    };

    return {
        form,
        stats,
        loading,
        uploading,
        handleChange,
        handleImageUpload,
        handleSubmit,
        handleDeleteImage
    };
};