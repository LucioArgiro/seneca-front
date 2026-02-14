import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Navbar } from '../components/Navbar';
import { MapaOscuro } from '../components/common/MapaOscuro';
import { Mail, Phone, MapPin, Send, Instagram, MessageSquare, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNegocio } from '../hooks/useNegocio';
import { emailApi } from '../api/contacto';

export const Contacto = () => {
  const [form, setForm] = useState({ nombre: '', email: '', mensaje: '' });
  const { negocio, isLoading } = useNegocio();
  const telefono = negocio?.telefono || "+54 381 000-0000";
  const email = negocio?.email || "contacto@barberia.com";
  const direccion = negocio?.direccion || "Dirección no configurada";

  // Limpiador de URL de Instagram
  const getInstagramUrl = (input: string) => {
    if (!input) return "https://instagram.com";
    let user = input.trim();
    user = user.replace(/^(https?:\/\/)?(www\.)?instagram\.com\//, '').replace('@', '').replace('/', '');
    return `https://instagram.com/${user}`;
  };
  const instagramUrl = getInstagramUrl(negocio?.instagram || "barberia");
  const enviarMensaje = useMutation({
    mutationFn: emailApi.enviarContacto,
    onSuccess: () => {
      toast.success('¡Mensaje enviado con éxito! Te responderemos pronto.');
      setForm({ nombre: '', email: '', mensaje: '' });
    },
    onError: (error) => {
      console.error(error);
      toast.error('Hubo un error al enviar. Por favor intenta más tarde.');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Disparamos el envío
    enviarMensaje.mutate(form);
  };

  if (isLoading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-[#C9A227]" size={40} />
      <p className="text-[#C9A227] font-serif tracking-widest animate-pulse text-sm">CARGANDO...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-200 font-sans selection:bg-[#C9A227] selection:text-[#131313] pb-20">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 pt-32">

        {/* ENCABEZADO LUXURY */}
        <div className="flex flex-col items-center mb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-[#C9A227]/10 border border-[#C9A227]/20 px-4 py-1.5 rounded-full mb-6 shadow-[0_0_15px_rgba(201,162,39,0.1)]">
            <MessageSquare size={14} className="text-[#C9A227]" />
            <span className="text-[10px] font-bold text-[#C9A227] tracking-widest uppercase">Contáctanos</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">
            Estamos para <span className="text-[#C9A227]">Ayudarte</span>
          </h1>
          <p className="text-zinc-500 max-w-lg mx-auto text-sm">Cualquier duda, consulta o sugerencia es bienvenida.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* --- COLUMNA 1: DATOS + FORMULARIO (5 columnas) --- */}
          <div className="lg:col-span-5 space-y-6">

            {/* Tarjetas de Info Rápida */}
            <div className="grid grid-cols-2 gap-4">
              <a href={`tel:${telefono}`} className="bg-[#131313] p-6 rounded-2xl border border-white/5 hover:border-[#C9A227]/30 transition-all group flex flex-col items-center text-center cursor-pointer hover:bg-[#1A1A1A] hover:shadow-[0_0_20px_rgba(201,162,39,0.05)]">
                <div className="p-3 bg-[#0a0a0a] rounded-full mb-3 text-[#C9A227] border border-[#333] group-hover:scale-110 transition shadow-inner"><Phone size={20} /></div>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">Llámanos</p>
                <p className="text-white text-xs font-bold break-all">{telefono}</p>
              </a>
              <a href={`mailto:${email}`} className="bg-[#131313] p-6 rounded-2xl border border-white/5 hover:border-[#C9A227]/30 transition-all group flex flex-col items-center text-center cursor-pointer hover:bg-[#1A1A1A] hover:shadow-[0_0_20px_rgba(201,162,39,0.05)]">
                <div className="p-3 bg-[#0a0a0a] rounded-full mb-3 text-[#C9A227] border border-[#333] group-hover:scale-110 transition shadow-inner"><Mail size={20} /></div>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">Escríbenos</p>
                <p className="text-white text-xs font-bold break-all">{email}</p>
              </a>
            </div>

            {/* Formulario Luxury */}
            <form onSubmit={handleSubmit} className="bg-[#131313] p-8 rounded-3xl border border-[#C9A227]/20 shadow-2xl shadow-black relative overflow-hidden group">
              <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3 uppercase tracking-wide">
                <div className="p-2 bg-[#1A1A1A] rounded-lg border border-[#C9A227]/30 text-[#C9A227]">
                  <Send size={18} />
                </div>
                Envíanos un mensaje
              </h3>

              <div className="space-y-5 relative z-10">
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-bold text-[#C9A227] uppercase tracking-widest mb-2">Nombre</label>
                    <input
                      required
                      type="text"
                      value={form.nombre}
                      onChange={e => setForm({ ...form, nombre: e.target.value })}
                      disabled={enviarMensaje.isPending}
                      className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] transition-all disabled:opacity-50"
                      placeholder="Tu Nombre"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#C9A227] uppercase tracking-widest mb-2">Email</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      disabled={enviarMensaje.isPending}
                      className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] transition-all disabled:opacity-50"
                      placeholder="tucorreo@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#C9A227] uppercase tracking-widest mb-2">Mensaje</label>
                  <textarea
                    required
                    rows={4}
                    value={form.mensaje}
                    onChange={e => setForm({ ...form, mensaje: e.target.value })}
                    disabled={enviarMensaje.isPending}
                    className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] transition-all resize-none disabled:opacity-50"
                    placeholder="Escribe tu consulta aquí..."
                  />
                </div>

                {/* BOTÓN DORADO */}
                <button
                  type="submit"
                  disabled={enviarMensaje.isPending}
                  className="w-full bg-[#C9A227] hover:bg-[#b88d15] text-[#131313] font-black uppercase tracking-widest py-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(201,162,39,0.2)] hover:shadow-[0_0_30px_rgba(201,162,39,0.4)] hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 mt-2"
                >
                  {enviarMensaje.isPending ? (
                    <><Loader2 size={16} className="animate-spin" /> ENVIANDO...</>
                  ) : (
                    <>ENVIAR MENSAJE</>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* --- COLUMNA 2: MAPA (7 columnas) --- */}
          <div className="lg:col-span-7 flex flex-col h-[500px] lg:h-[600px]">
            <div className="flex-1 bg-[#131313] rounded-3xl border border-white/5 p-2 relative shadow-2xl overflow-hidden group">

              {/* Contenedor del mapa con borde interno */}
              <div className="w-full h-full rounded-2xl overflow-hidden relative border border-[#333]">
                <MapaOscuro
                  nombre={negocio?.nombre}
                  direccion={direccion}
                />
              </div>

              {/* Tarjeta Flotante de Dirección */}
              <div className="absolute top-6 left-6 right-6 sm:left-auto sm:right-6 sm:w-72 bg-[#131313]/90 p-4 rounded-xl border border-[#C9A227]/20 shadow-xl z-[15] flex items-start gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="p-2.5 bg-[#0a0a0a] rounded-lg text-[#C9A227] border border-[#333] shrink-0"><MapPin size={20} /></div>
                <div>
                  <p className="text-[#C9A227] text-[10px] font-bold uppercase tracking-widest mb-1">Nuestra Ubicación</p>
                  <p className="text-white text-xs font-medium leading-relaxed">{direccion}</p>
                </div>
              </div>

              {/* Botón Flotante Instagram */}
              {negocio?.instagram && (
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer"
                  className="absolute bottom-6 right-6 bg-gradient-to-tr from-[#fd5949] to-[#d6249f] text-white p-3.5 rounded-full shadow-lg z-[400] hover:scale-110 hover:shadow-pink-500/30 transition-all duration-300 group/insta"
                  title="Ver en Instagram">
                  <Instagram size={24} className="group-hover/insta:rotate-12 transition-transform" />
                </a>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};