import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/auth';
import { barberosApi } from '../../api/barberos';
import { type UpdateBarberoDto } from '../../types';
import { User, Mail, Save, Scissors, MapPin, Camera, FileText, Phone, Hash, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const BarberSettings = () => {
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [form, setForm] = useState<UpdateBarberoDto>({
        fullname: '',
        email: '',
        telefono: '',
        especialidad: '',
        biografia: '',
        provincia: '',
        fotoUrl: '',
        dni: '',
        edad: undefined,
        sexo: ''
    });

    // 1. Cargar datos al entrar
    useEffect(() => {
        const cargarDatos = async () => {
            if (!user?.id) return;
            try {
                const data = await barberosApi.getProfile(user.id);
                setForm({
                    fullname: data.usuario?.fullname || '',
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
            } catch (error) {
                console.error(error);
                toast.error('Error al cargar tu información');
            }
        };
        cargarDatos();
    }, [user]);

    // 2. Manejar cambios de texto
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: name === 'edad' ? Number(value) : value
        });
    };

    // 3. Manejar SUBIDA DE IMAGEN
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const url = await barberosApi.uploadImage(file);
            setForm(prev => ({ ...prev, fotoUrl: url }));
            toast.success("Foto subida. Dale a 'Guardar' para confirmar.");
        } catch (error) {
            console.error(error);
            toast.error("Error al subir la imagen");
        } finally {
            setUploading(false);
        }
    };

    // 4. Manejar ELIMINAR IMAGEN (Nube + Base de Datos)
    const handleDeleteImage = async () => {
        if (!form.fotoUrl) return;
        if (!confirm('¿Seguro que quieres eliminar tu foto de perfil?')) return;

        setUploading(true);
        try {
            await barberosApi.deleteImage(form.fotoUrl);
            const nuevoForm = { ...form, fotoUrl: '' };
            await barberosApi.updateProfile(nuevoForm);
            setForm(nuevoForm);
            toast.success("Foto eliminada correctamente.");
        } catch (error) {
            console.error(error);
            toast.error("Error al eliminar la imagen");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await barberosApi.updateProfile(form);
            toast.success('¡Perfil actualizado correctamente!');
        } catch (error) {
            console.error(error);
            toast.error('No se pudieron guardar los cambios.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 pb-20">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Editar Mi Perfil</h1>
                <p className="text-slate-500">Mantén tu información actualizada para tus clientes.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* TARJETA 1: DATOS DE CUENTA */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                        <User className="text-blue-600" size={20} /> Datos de Cuenta
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Nombre Completo</label>
                            <input type="text" name="fullname" value={form.fullname} onChange={handleChange}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                <input type="email" name="email" value={form.email} onChange={handleChange}
                                    className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* TARJETA 2: DATOS PERSONALES */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                        <Hash className="text-blue-600" size={20} /> Información Personal
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">DNI</label>
                            <input type="text" name="dni" value={form.dni} onChange={handleChange}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Edad</label>
                            <input type="number" name="edad" value={form.edad || ''} onChange={handleChange}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Teléfono</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                <input type="text" name="telefono" value={form.telefono} onChange={handleChange}
                                    className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* TARJETA 3: PERFIL PROFESIONAL */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                        <Scissors className="text-blue-600" size={20} /> Perfil Profesional (Público)
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Especialidad</label>
                            <input type="text" name="especialidad" placeholder="Ej: Fade, Barba, Tijera" value={form.especialidad} onChange={handleChange}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Ubicación / Provincia</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                <input type="text" name="provincia" value={form.provincia} onChange={handleChange}
                                    className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition"
                                />
                            </div>
                        </div>
                    </div>

                    {/* SECCIÓN FOTO DE PERFIL MEJORADA */}
                    <div className="mb-6">
                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Foto de Perfil</label>

                        <div className="flex items-center gap-5">

                            {/* 1. VISUALIZADOR (Avatar) */}
                            {/* Quitamos el overflow-hidden del padre para que el botón pueda salir por fuera */}
                            <div className="relative w-24 h-24 shrink-0">

                                {/* Círculo de la imagen */}
                                <div className="w-full h-full rounded-full bg-slate-100 border-4 border-white shadow-md overflow-hidden flex items-center justify-center">
                                    {form.fotoUrl ? (
                                        <img src={form.fotoUrl} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={40} className="text-slate-300" />
                                    )}

                                    {/* Spinner de carga (dentro del círculo) */}
                                    {uploading && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-30">
                                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    )}
                                </div>

                                {/* BOTÓN DE BORRAR (SOLO SI HAY FOTO) */}
                                {/* Ahora es un botón rojo en la esquina, imposible de no ver */}
                                {form.fotoUrl && !uploading && (
                                    <button
                                        type="button"
                                        onClick={handleDeleteImage}
                                        className="absolute -bottom-1 -right-1 bg-red-100 text-red-600 p-2 rounded-full border border-red-200 shadow-sm hover:bg-red-200 transition z-40"
                                        title="Eliminar foto"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>

                            {/* 2. BOTÓN DE SUBIDA */}
                            <div className="flex-1">
                                <label className={`
                                    inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold cursor-pointer transition shadow-sm border
                                    ${uploading
                                        ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-slate-400'
                                    }
                                `}>
                                    <Camera size={18} />
                                    {uploading ? 'Subiendo...' : 'Cambiar Foto'}

                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/png, image/jpeg, image/jpg"
                                        onChange={handleImageUpload}
                                        disabled={uploading}
                                    />
                                </label>
                                <p className="text-xs text-slate-400 mt-2">
                                    Formatos: JPG, PNG. Máx 5MB. <br />
                                    <span className="text-blue-600/70">La imagen se subirá automáticamente a la nube.</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Biografía / Sobre mí</label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-3.5 text-slate-400" size={18} />
                            <textarea name="biografia" rows={4} value={form.biografia} onChange={handleChange}
                                placeholder="Cuéntale a tus clientes sobre tu experiencia..."
                                className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* BOTÓN GUARDAR */}
                <div className="flex justify-end">
                    <button type="submit" disabled={loading || uploading}
                        className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
                    >
                        {loading ? 'Guardando...' : <><Save size={20} /> Guardar Cambios</>}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default BarberSettings;