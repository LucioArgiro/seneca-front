import { useState, useEffect, useRef } from 'react';
import { useNegocio } from '../../hooks/useNegocio';
import { filesApi } from '../../api/files';
import { Save, AlertCircle, Building, Clock, Upload, Camera, Trash2, Plus, Sun, Moon, Image as ImageIcon, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

interface NegocioForm {
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
  instagram: string;
  mapsUrl: string;
  logoUrl: string;
  galeria: string[];
}

export const AdminConfiguracion = () => {
  const { negocio, isLoading, updateNegocio } = useNegocio();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const [horariosModificados, setHorariosModificados] = useState(false);

  // 1. AJUSTE DE ESTADO: Agregamos 'activo' a manana
  const [rangos, setRangos] = useState([
    {
      id: 1,
      diaInicio: 'Lunes',
      diaFin: 'Viernes',
      manana: { activo: true, desde: '09:00', hasta: '13:00' }, // 👈 Ahora tiene activo
      tarde: { activo: true, desde: '17:00', hasta: '21:00' }
    }
  ]);

  const [form, setForm] = useState<NegocioForm>({
    nombre: '', direccion: '', telefono: '', email: '', instagram: '', mapsUrl: '', logoUrl: '',
    galeria: []
  });

  useEffect(() => {
    if (negocio) {
      setForm({
        nombre: negocio.nombre || '',
        direccion: negocio.direccion || '',
        telefono: negocio.telefono || '',
        email: negocio.email || '',
        instagram: negocio.instagram || '',
        mapsUrl: negocio.mapsUrl || '',
        logoUrl: negocio.logoUrl || '',
        galeria: negocio.galeria || []
      });
    }
  }, [negocio]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const marcarModificado = () => { if (!horariosModificados) setHorariosModificados(true); };

  const addRango = () => {
    marcarModificado();
    const newId = rangos.length > 0 ? Math.max(...rangos.map(r => r.id)) + 1 : 1;
    setRangos([...rangos, {
      id: newId,
      diaInicio: 'Sábado',
      diaFin: 'Domingo',
      manana: { activo: true, desde: '09:00', hasta: '14:00' },
      tarde: { activo: false, desde: '17:00', hasta: '21:00' }
    }]);
  };

  const removeRango = (id: number) => { marcarModificado(); setRangos(rangos.filter(r => r.id !== id)); };

  const updateRango = (id: number, field: string, value: any, subfield?: string) => {
    marcarModificado();
    setRangos(rangos.map(r => {
      if (r.id !== id) return r;
      if (field === 'manana' || field === 'tarde') {
        return { ...r, [field]: { ...r[field as 'manana' | 'tarde'], [subfield!]: value } };
      }
      return { ...r, [field]: value };
    }));
  };

  const generarEstructuraBackend = () => {
    return DIAS_SEMANA.map((diaActual, indexActual) => {
      const rangoActivo = rangos.find(r => {
        const inicioIdx = DIAS_SEMANA.indexOf(r.diaInicio);
        const finIdx = DIAS_SEMANA.indexOf(r.diaFin);

        if (inicioIdx <= finIdx) {
          return indexActual >= inicioIdx && indexActual <= finIdx;
        } else {
          return indexActual >= inicioIdx || indexActual <= finIdx;
        }
      });

      if (rangoActivo) {
        // 2. LÓGICA DE GUARDADO: Si manana.activo es false, guardamos null
        const mananaData = rangoActivo.manana.activo
          ? { desde: rangoActivo.manana.desde, hasta: rangoActivo.manana.hasta }
          : null;

        // Calculamos si está abierto en general (al menos un turno activo)
        const estaAbierto = rangoActivo.manana.activo || rangoActivo.tarde.activo;

        return {
          dia: diaActual,
          abierto: estaAbierto,
          manana: mananaData,
          tarde: { ...rangoActivo.tarde }
        };
      } else {
        return {
          dia: diaActual,
          abierto: false,
          manana: null,
          tarde: { activo: false, desde: '17:00', hasta: '21:00' }
        };
      }
    });
  };

  const handleLogoUpload = async (e: any) => {
    const file = e.target.files?.[0]; if (!file) return; setUploading(true);
    try { const url = await filesApi.uploadImage(file); setForm(prev => ({ ...prev, logoUrl: url })); toast.success("Logo actualizado"); }
    catch { toast.error('Error al subir'); } finally { setUploading(false); }
  };

  const handleDeleteLogo = async (e: any) => {
    e.stopPropagation(); if (!confirm('¿Borrar logo?')) return; setUploading(true);
    try { await filesApi.deleteImage(form.logoUrl); setForm(prev => ({ ...prev, logoUrl: '' })); toast.success("Logo eliminado"); }
    catch { toast.error("Error al borrar"); } finally { setUploading(false); }
  };

  const handleGalleryUpload = async (e: any) => {
    if (form.galeria.length >= 4) {
      toast.error("Límite alcanzado: Máximo 4 fotos.");
      return;
    }
    const file = e.target.files?.[0]; if (!file) return; setUploading(true);
    try { const url = await filesApi.uploadImage(file); setForm(prev => ({ ...prev, galeria: [...prev.galeria, url] })); toast.success("Imagen agregada"); }
    catch { toast.error('Error al subir imagen'); } finally { setUploading(false); }
  };

  const removeGalleryImage = (urlToRemove: string) => {
    toast((t) => (
      <div className="flex flex-col gap-3 min-w-[200px]">
        <div className="flex items-center gap-2">
          <AlertTriangle size={18} className="text-[#C9A227]" />
          <span className="font-bold text-sm text-white">¿Borrar imagen?</span>
        </div>
        <p className="text-xs text-slate-400">Se eliminará permanentemente de la nube.</p>

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
                await filesApi.deleteImage(urlToRemove);
                setForm(prev => ({
                  ...prev,
                  galeria: prev.galeria.filter(url => url !== urlToRemove)
                }));

                toast.success("Imagen borrada correctamente", {
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

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const datos: any = { ...form };

    if (horariosModificados) {
      datos.horarios = JSON.stringify(generarEstructuraBackend());
    } else {
      delete datos.horarios;
    }

    if (!datos.email) delete datos.email;
    if (!datos.instagram) delete datos.instagram;
    if (!datos.mapsUrl) delete datos.mapsUrl;

    updateNegocio.mutate(datos);
    setHorariosModificados(false);
  };

  if (isLoading) return <div className="h-full flex items-center justify-center text-[#C9A227] animate-pulse">Cargando...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto pb-20 bg-[#131313] min-h-screen text-slate-200">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-white">Configuración General</h1>
        <p className="text-slate-400">Gestiona la identidad y disponibilidad de tu negocio.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#1A1A1A] rounded-3xl shadow-xl border border-white/5 overflow-hidden">

        {/* 1. SECCIÓN SUPERIOR (Logo e Info) */}
        <div className="p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex flex-col items-center gap-4 lg:w-64 shrink-0">
              <div className="relative w-48 h-48 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-[#C9A227]/30 shadow-[0_0_15px_rgba(201,162,39,0.2)] bg-[#131313] flex items-center justify-center relative">
                  {form.logoUrl ? <img src={form.logoUrl} className="w-full h-full object-cover" /> : <Building size={48} className="text-[#C9A227]" />}
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="text-white" size={32} />
                  </div>
                </div>
                {!form.logoUrl && <div className="absolute bottom-4 right-4 bg-[#C9A227] text-black p-2.5 rounded-full shadow-lg"><Upload size={18} /></div>}
              </div>
              {form.logoUrl && (
                <button type="button" onClick={handleDeleteLogo} className="text-xs text-[#C9A227] font-bold hover:underline flex items-center gap-1"><Trash2 size={12} /> Eliminar Logo</button>)}
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 content-center">
              <div><label className="label">Nombre del Local</label><input name="nombre" value={form.nombre} onChange={handleChange} className="input" placeholder="Ej: Barbería Estilo" /></div>
              <div><label className="label">WhatsApp Principal</label><input name="telefono" value={form.telefono} onChange={handleChange} className="input" placeholder="Ej: 549381..." /></div>
              <div className="md:col-span-2"><label className="label">Dirección Física</label><input name="direccion" value={form.direccion} onChange={handleChange} className="input" placeholder="Ej: Av. Aconquija 1234, Yerba Buena" /></div>
              <div className="md:col-span-2"><label className="label">Link Google Maps</label>
                <input name="mapsUrl" value={form.mapsUrl} onChange={handleChange} className="input" placeholder="https://maps.google..." />
              </div>
            </div>
          </div>
        </div>

        {/* 2. SECCIÓN HORARIOS */}
        <div className="p-4 sm:p-6 lg:p-8 bg-[#131313] border-t border-white/5 rounded-b-2xl">

          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-start gap-3">
              <div className={`p-2.5 rounded-xl shrink-0 ${horariosModificados ? 'bg-[#C9A227]/20 text-[#C9A227]' : 'bg-[#252525] text-zinc-400'}`}>
                <Clock size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white leading-tight">Horarios de Atención</h3>
                <p className="text-xs text-zinc-500 mt-1 max-w-md">
                  Configura los rangos de días y horas en los que tu local está abierto.
                </p>
              </div>
            </div>
            {horariosModificados && (
              <div className="flex items-center gap-2 text-xs font-bold text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20 self-start sm:self-center animate-pulse">
                <AlertCircle size={14} /> Cambios sin guardar
              </div>
            )}
          </div>

          {/* LISTA DE RANGOS */}
          <div className="space-y-4">
            {rangos.map((rango) => (
              <div
                key={rango.id}
                className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-4 sm:p-5 shadow-lg relative group transition-all hover:border-[#C9A227]/30 hover:shadow-[#C9A227]/5 flex flex-col xl:flex-row gap-5 xl:items-center"
              >
                {/* BOTÓN ELIMINAR (FLOTANTE EN MÓVIL, FINAL EN PC) */}
                <button
                  type="button"
                  onClick={() => removeRango(rango.id)}
                  className="absolute -top-3 -right-3 xl:static p-2 bg-[#252525] xl:bg-transparent text-zinc-500 hover:text-red-400 hover:bg-red-900/20 xl:hover:bg-transparent rounded-full shadow-md xl:shadow-none border border-white/10 xl:border-0 transition-colors z-10"
                  title="Eliminar rango"
                >
                  <Trash2 size={18} />
                </button>

                {/* 1. SELECTORES DE DÍA (RANGO) */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full xl:w-auto xl:min-w-[320px]">
                  <div className="flex items-center gap-2 w-full">
                    <span className="text-[10px] font-bold text-zinc-600 uppercase w-6 shrink-0">De</span>
                    <div className="relative w-full">
                      <select
                        value={rango.diaInicio}
                        onChange={(e) => updateRango(rango.id, 'diaInicio', e.target.value)}
                        className="w-full bg-[#131313] text-white text-sm border border-white/10 rounded-lg px-3 py-2.5 appearance-none focus:outline-none focus:border-[#C9A227] transition-colors cursor-pointer"
                      >
                        {DIAS_SEMANA.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full">
                    <span className="text-[10px] font-bold text-zinc-600 uppercase w-6 shrink-0 text-center sm:text-left">A</span>
                    <div className="relative w-full">
                      <select
                        value={rango.diaFin}
                        onChange={(e) => updateRango(rango.id, 'diaFin', e.target.value)}
                        className="w-full bg-[#131313] text-white text-sm border border-white/10 rounded-lg px-3 py-2.5 appearance-none focus:outline-none focus:border-[#C9A227] transition-colors cursor-pointer"
                      >
                        {DIAS_SEMANA.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* 2. CONTENEDORES DE HORA */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 w-full">

                  {/* MAÑANA */}
                  <div className={`flex items-center gap-2 bg-[#252525] px-3 py-2.5 rounded-xl border border-white/5 transition-all duration-200 ${!rango.manana.activo ? 'opacity-40 grayscale' : 'hover:border-white/10'}`}>
                    <input
                      type="checkbox"
                      checked={rango.manana.activo}
                      onChange={(e) => updateRango(rango.id, 'manana', e.target.checked, 'activo')}
                      className="accent-[#C9A227] cursor-pointer w-4 h-4 bg-[#333] border-[#444] rounded shrink-0"
                    />
                    <Sun size={16} className={`shrink-0 ${rango.manana.activo ? "text-[#C9A227]" : "text-slate-500"}`} />

                    <div className="flex items-center gap-2 w-full ml-1">
                      <input
                        disabled={!rango.manana.activo}
                        type="time"
                        value={rango.manana.desde}
                        onChange={(e) => updateRango(rango.id, 'manana', e.target.value, 'desde')}
                        className="bg-transparent text-white text-sm w-full focus:outline-none text-center disabled:cursor-not-allowed font-medium"
                      />
                      <span className="text-zinc-600 font-light">-</span>
                      <input
                        disabled={!rango.manana.activo}
                        type="time"
                        value={rango.manana.hasta}
                        onChange={(e) => updateRango(rango.id, 'manana', e.target.value, 'hasta')}
                        className="bg-transparent text-white text-sm w-full focus:outline-none text-center disabled:cursor-not-allowed font-medium"
                      />
                    </div>
                  </div>

                  {/* TARDE */}
                  <div className={`flex items-center gap-2 bg-[#252525] px-3 py-2.5 rounded-xl border border-white/5 transition-all duration-200 ${!rango.tarde.activo ? 'opacity-40 grayscale' : 'hover:border-white/10'}`}>
                    <input
                      type="checkbox"
                      checked={rango.tarde.activo}
                      onChange={(e) => updateRango(rango.id, 'tarde', e.target.checked, 'activo')}
                      className="accent-[#C9A227] cursor-pointer w-4 h-4 bg-[#333] border-[#444] rounded shrink-0"
                    />
                    <Moon size={16} className={`shrink-0 ${rango.tarde.activo ? "text-blue-200" : "text-slate-500"}`} />

                    <div className="flex items-center gap-2 w-full ml-1">
                      <input
                        disabled={!rango.tarde.activo}
                        type="time"
                        value={rango.tarde.desde}
                        onChange={(e) => updateRango(rango.id, 'tarde', e.target.value, 'desde')}
                        className="bg-transparent text-white text-sm w-full focus:outline-none text-center disabled:cursor-not-allowed font-medium"
                      />
                      <span className="text-zinc-600 font-light">-</span>
                      <input
                        disabled={!rango.tarde.activo}
                        type="time"
                        value={rango.tarde.hasta}
                        onChange={(e) => updateRango(rango.id, 'tarde', e.target.value, 'hasta')}
                        className="bg-transparent text-white text-sm w-full focus:outline-none text-center disabled:cursor-not-allowed font-medium"
                      />
                    </div>
                  </div>

                </div>
              </div>
            ))}

            {/* BOTÓN AGREGAR */}
            <button type="button" onClick={addRango} className="w-full py-3.5 bg-[#1A1A1A] border border-dashed border-[#C9A227]/30 text-zinc-300 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#C9A227]/5 hover:text-[#C9A227] hover:border-[#C9A227] transition-all active:scale-[0.99]"><Plus size={18} />Agregar rango horario</button>
          </div>
        </div>


        {/* 3. SECCIÓN GALERÍA */}
        <div className="p-8 bg-[#1A1A1A] border-t border-white/5">
          {/* ... (Se mantiene igual que antes) ... */}
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#C9A227]/10 p-2 rounded-lg text-[#C9A227]">
              <ImageIcon size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Galería de Trabajos</h3>
              <p className="text-xs text-slate-500">Estas 4 fotos se mostrarán en tu página principal.</p>
            </div>
          </div>
          {/* INDICADOR DE LÍMITE */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold uppercase tracking-wider w-fit mb-4 ${form.galeria.length >= 4 ? 'bg-red-900/10 border-red-500/30 text-red-400' : 'bg-[#C9A227]/5 border-[#C9A227]/20 text-[#C9A227]'}`}>
            <span>{form.galeria.length} / 4 Fotos</span>
            {form.galeria.length >= 4 && <AlertTriangle size={14} />}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div
              onClick={() => { if (form.galeria.length < 4) galleryInputRef.current?.click(); }}
              className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition group ${form.galeria.length >= 4 ? 'border-zinc-700 bg-[#131313] opacity-50 cursor-not-allowed' : 'border-[#333] hover:border-[#C9A227] cursor-pointer hover:bg-[#131313]'}`}
            >
              <div className={`p-3 rounded-full mb-2 transition ${form.galeria.length >= 4 ? 'bg-zinc-800' : 'bg-[#252525] group-hover:bg-[#C9A227]'}`}>
                <Plus size={20} className={`${form.galeria.length >= 4 ? 'text-zinc-600' : 'text-slate-400 group-hover:text-black'}`} />
              </div>
              <span className={`text-xs font-bold ${form.galeria.length >= 4 ? 'text-zinc-600' : 'text-slate-500 group-hover:text-[#C9A227]'}`}>{form.galeria.length >= 4 ? 'Límite Completo' : 'Agregar Foto'}</span>
              <input type="file" ref={galleryInputRef} className="hidden" accept="image/*" onChange={handleGalleryUpload} disabled={form.galeria.length >= 4} />
            </div>
            {form.galeria.map((fotoUrl, index) => (
              <div key={index} className="aspect-square rounded-xl overflow-hidden relative group border border-white/10">
                <img src={fotoUrl} alt="Trabajo" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button type="button" onClick={() => removeGalleryImage(fotoUrl)} className="bg-red-500/80 p-2 rounded-full text-white hover:bg-red-600 transition shadow-lg"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. SECCIÓN CONTACTO */}
        <div className="p-8 border-t border-white/5 bg-[#131313]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div><label className="label">Link de Instagram</label><div><input name="instagram" value={form.instagram} onChange={handleChange} className="input" placeholder="@tubarberia" /></div></div>
            <div><label className="label">Email de Contacto</label><div><input name="email" value={form.email} onChange={handleChange} className="input" placeholder="contacto@barberia.com" /></div></div>
          </div>
          <div className="flex justify-end pt-4 border-t border-white/5">
            <button disabled={updateNegocio.isPending || uploading} type="submit" className="text-[#C9A227] hover:bg-[#C9A227] hover:text-[#111827] px-12 py-4 rounded-2xl font-bold flex items-center gap-3 active:scale-95 disabled:opacity-70 cursor-pointer transition-all transform hover:-translate-y-0.5 border border-[#C9A227]/50">
              {updateNegocio.isPending ? 'Guardando...' : <><Save size={20} /> Guardar Configuración</>}
            </button>
          </div>
        </div>

      </form>
      <style>{`.label { display: block; font-size: 0.75rem; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; } .input { width: 100%; padding: 0.75rem 1rem; border: 1px solid #333; border-radius: 0.75rem; background-color: #131313; outline: none; transition: all; font-weight: 500; color: #e2e8f0; } .input:focus { border-color: #C9A227; box-shadow: 0 0 0 1px rgba(201, 162, 39, 0.2); } .input-select { padding: 0.5rem; border: 1px solid #333; border-radius: 0.5rem; font-size: 0.875rem; color: #e2e8f0; background-color: #131313; cursor: pointer; outline: none; font-weight: 600; } .input-select:focus { border-color: #C9A227; } .input-mini { padding: 0.25rem; background: transparent; border: none; font-size: 0.85rem; outline: none; text-align: center; color: #e2e8f0; font-weight: 600; width: 100%; } .input-mini:focus { color: #C9A227; } input[type="time"]::-webkit-calendar-picker-indicator { filter: invert(1); cursor: pointer; }`}</style>
    </div>
  );
};