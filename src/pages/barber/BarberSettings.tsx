import { User, Save, Camera, Scissors, MapPin, Hash, Phone, Mail, TrendingUp, Users, Lock, Trash2 } from 'lucide-react'; // Importa Trash2 y AlertTriangle
import { useBarberSettings } from '../../hooks/useBarberSettings';
import { StarDisplay } from '../../components/StarDisplay';

const BarberSettings = () => {
  // 👇 Desestructuramos handleDeleteImage
  const { form, stats, loading, uploading, handleChange, handleImageUpload, handleSubmit, handleDeleteImage } = useBarberSettings();

  // Estilos reutilizables
  const cardClass = "bg-[#131313] border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden group hover:border-[#C9A227]/30 transition-all duration-300";
  const labelClass = "text-[10px] font-bold text-[#C9A227] uppercase mb-2 block tracking-widest";
  const inputClass = "w-full bg-black/20 border border-[#C9A227]/40 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] transition-all placeholder-zinc-700 font-medium";

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8 pb-24 text-slate-200">
      <div className="mb-10 max-w-7xl mx-auto">
        <h1 className="text-4xl font-black text-[#C9A227] mb-2 tracking-tight">Mi Perfil</h1>
        <p className="text-zinc-500 font-medium">Personaliza tu información pública y privada.</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* COLUMNA 1: FOTO Y BIO */}
          <div className="lg:col-span-3">
            {/* 1. CAMBIO: Quitamos 'h-full' y reducimos padding a 'p-5' */}
            <div className="bg-[#131313] border border-white/10 rounded-2xl p-5 shadow-2xl relative overflow-hidden group hover:border-[#C9A227]/30 transition-all duration-300 flex flex-col items-center text-center">

              {/* 2. CAMBIO: Reducimos márgenes verticales (mb-4 en vez de mb-6) */}
              <div className="relative group/avatar mb-4 mt-2">

                {/* 3. CAMBIO: Avatar más chico (w-32 h-32 en vez de w-40 h-40) */}
                <div className="w-32 h-32 rounded-full border-2 border-[#C9A227] shadow-[0_0_20px_rgba(201,162,39,0.2)] overflow-hidden bg-[#0a0a0a]">
                  {form.fotoUrl ? (
                    <img src={form.fotoUrl} alt="Perfil" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-700"><User size={48} /></div>
                  )}
                </div>

                {uploading && (
                  <div className="absolute inset-0 bg-black/70 rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-[#C9A227] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>

              <h2 className="text-xl font-bold text-white mb-0.5"> {/* Texto un poco más chico */}
                {form.nombre || 'Nombre'} <span className="text-[#C9A227]">{form.apellido}</span>
              </h2>

              <div className="mt-1 mb-5 flex flex-col items-center"> {/* Menos margen inferior */}
                <StarDisplay rating={stats.rating} count={stats.totalReviews} showCount={false} size={18} />
                <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-wider">
                  {stats.totalReviews > 0 ? `${stats.totalReviews} reseñas` : 'Sin reseñas aún'}
                </p>
              </div>

              {/* BIO INPUT COMPACTO */}
              <div className="w-full text-left mb-5">
                <label className={labelClass}>Biografía Pública</label>
                <textarea name="biografia" placeholder="Cuéntanos sobre tu experiencia..." value={form.biografia} onChange={handleChange} className={`${inputClass} min-h-[100px] resize-none text-xs leading-relaxed`} rows={3}/>
              </div>

              {/* BOTONES COMPACTOS */}
              <div className="mt-auto w-full flex flex-col gap-2"> 

                <label className="flex items-center justify-center gap-2 w-full text-[#C9A227] bg-[#1A1A1A] border border-[#C9A227]/30 rounded-xl hover:bg-[#C9A227] hover:text-[#131313] hover:scale-[1.02] font-bold py-2.5 cursor-pointer transition-all uppercase text-[10px] tracking-widest shadow-lg"> <Camera size={14} />{uploading ? 'Subiendo...' : 'Cambiar Foto'}<input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                </label>

                {form.fotoUrl && (
                  <button type="button" onClick={handleDeleteImage} disabled={uploading} className="flex items-center justify-center gap-2 w-full text-red-400 bg-[#1A1A1A] border border-red-500/20 rounded-xl hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/40 font-bold py-2.5 transition-all uppercase text-[10px] tracking-widest"><Trash2 size={14} />Eliminar Foto</button>
                )}
              </div>

            </div>
          </div>

          {/* COLUMNA 2: FORMULARIOS */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            {/* Datos de Cuenta */}
            <div className={cardClass}>
              <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-2">
                <User className="text-[#C9A227]" size={18} />
                <h3 className="font-bold text-zinc-300">Datos de Cuenta</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className={labelClass}>Nombre</label><input type="text" name="nombre" value={form.nombre} onChange={handleChange} className={inputClass} /></div>
                <div><label className={labelClass}>Apellido</label><input type="text" name="apellido" value={form.apellido} onChange={handleChange} className={inputClass} /></div>
                <div className="md:col-span-2"><label className={labelClass}>Email</label><div className="relative"><Mail className="absolute left-4 top-3.5 text-zinc-600" size={16} /><input type="email" value={form.email} disabled className={`${inputClass} pl-10 border-white/10 text-zinc-500 cursor-not-allowed`} /></div></div>
              </div>
            </div>

            {/* Información Privada */}
            <div className={cardClass}>
              <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-2">
                <Hash className="text-[#C9A227]" size={18} />
                <h3 className="font-bold text-zinc-300">Información Privada</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><label className={labelClass}>DNI</label><input type="text" name="dni" value={form.dni} onChange={handleChange} className={inputClass} /></div>
                <div><label className={labelClass}>Edad</label><input type="number" name="edad" value={form.edad || ''} onChange={handleChange} className={inputClass} /></div>
                <div><label className={labelClass}>Teléfono</label><div className="relative"><Phone className="absolute left-4 top-3.5 text-zinc-600" size={16} /><input type="text" name="telefono" value={form.telefono} onChange={handleChange} className={`${inputClass} pl-10`} /></div></div>
              </div>
            </div>

            {/* Perfil Profesional */}
            <div className={cardClass}>
              <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-2">
                <Scissors className="text-[#C9A227]" size={18} />
                <h3 className="font-bold text-zinc-300">Perfil Profesional</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className={labelClass}>Especialidad</label><input type="text" name="especialidad" placeholder="Ej: Fade, Barba..." value={form.especialidad} onChange={handleChange} className={inputClass} /></div>
                <div><label className={labelClass}>Ubicación</label><div className="relative"><MapPin className="absolute left-4 top-3.5 text-zinc-600" size={16} /><input type="text" name="provincia" value={form.provincia} onChange={handleChange} className={`${inputClass} pl-10`} /></div></div>
              </div>
            </div>

            {/* 👇 NUEVA SECCIÓN: SEGURIDAD / CONTRASEÑA */}
            <div className={cardClass}>
              <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-2">
                <Lock className="text-[#C9A227]" size={18} />
                <h3 className="font-bold text-zinc-300">Seguridad</h3>
              </div>
              <p className="text-xs text-zinc-500 mb-4 italic">
                * Deja estos campos vacíos si no deseas cambiar tu contraseña actual.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Nueva Contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 text-zinc-600" size={16} />
                    <input
                      type="password"
                      name="password"
                      onChange={handleChange}
                      className={`${inputClass} pl-10`}
                      placeholder="••••••••"
                      autoComplete="new-password"
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Confirmar Contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 text-zinc-600" size={16} />
                    <input
                      type="password"
                      name="confirmPassword"
                      onChange={handleChange}
                      className={`${inputClass} pl-10`}
                      placeholder="••••••••"
                      autoComplete="new-password"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* COLUMNA 3: ESTADÍSTICAS */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <div className={`${cardClass} flex-1`}>
              <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-2">
                <TrendingUp className="text-[#C9A227]" size={18} />
                <h3 className="font-bold text-zinc-300">Resumen</h3>
              </div>

              <div className="space-y-6">
                {/* Cortes */}
                <div className="bg-[#0a0a0a] p-4 rounded-xl border border-white/5">
                  <p className="text-zinc-500 text-xs font-bold uppercase mb-1">Cortes Realizados</p>
                  <div className="flex items-center gap-2">
                    <Scissors className="text-[#C9A227]" size={20} />
                    <span className="text-3xl font-black text-white">{stats.cortes}+</span>
                  </div>
                </div>

                {/* Clientes */}
                <div className="bg-[#0a0a0a] p-4 rounded-xl border border-white/5">
                  <p className="text-zinc-500 text-xs font-bold uppercase mb-1">Clientes Activos</p>
                  <div className="flex items-center gap-2">
                    <Users className="text-[#C9A227]" size={20} />
                    <span className="text-3xl font-black text-white">{stats.activos}</span>
                  </div>
                </div>

                {/* Calificación */}
                <div className="bg-[#0a0a0a] p-4 rounded-xl border border-white/5">
                  <p className="text-zinc-500 text-xs font-bold uppercase mb-1">Calificación Promedio</p>
                  <div className="mt-1">
                    <StarDisplay rating={stats.rating} count={stats.totalReviews} size={18} />
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full text-[#C9A227] bg-[#131313] rounded-lg hover:bg-[#C9A227] hover:text-[#131313] font-black py-6 rounded-2x hover:scale-[1.02] transition-all uppercase tracking-widest text-lg flex items-center justify-center gap-3 disabled:opacity-50">
              {loading ? '...' : <><Save size={24} /> Guardar</>}
            </button>
          </div>

        </div>
      </form>
    </div>
  );
};

export default BarberSettings;