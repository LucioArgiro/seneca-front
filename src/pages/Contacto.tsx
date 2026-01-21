import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useEnviarMensaje } from '../hooks/useMensajes'; 

const Contacto = () => {
  const [mensaje, setMensaje] = useState('');
  const { mutate, isPending, isError, error, isSuccess, reset } = useEnviarMensaje();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mensaje.trim()) return;
    mutate(mensaje);
  };
  useEffect(() => {
    if (isSuccess) {
      setMensaje('');
      const timer = setTimeout(() => reset(), 5000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, reset]);
  const errorMsg = error?.response?.data?.message || error?.message || 'Error al enviar';
  return (
    <section className="py-20 bg-slate-50 min-h-screen flex items-center">
      <div className="container mx-auto px-4">
        
        {/* ENCABEZADO */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">Contáctanos</span>
          <h2 className="text-4xl font-bold text-slate-900 mt-2 mb-4">Estamos para Escucharte</h2>
          <p className="text-slate-500 text-lg">¿Tienes dudas o sugerencias? Déjanos un mensaje y el equipo te responderá a la brevedad.</p>
        </div>

        <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
          
          {/* LADO IZQUIERDO: INFO */}
          <div className="md:w-5/12 bg-slate-900 p-10 text-white flex flex-col justify-between relative overflow-hidden">
             <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-[#c4a484] rounded-full opacity-20 blur-3xl"></div>
             <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-blue-600 rounded-full opacity-20 blur-3xl"></div>
             
             <div>
                <h3 className="text-2xl font-bold mb-6">Información de Contacto</h3>
                <p className="text-slate-400 mb-8 leading-relaxed">Ven a visitarnos para vivir la experiencia completa.</p>
                <div className="space-y-6">
                    <div className="flex items-start gap-4"><div className="p-3 bg-slate-800 rounded-lg text-[#c4a484]"><MapPin size={24} /></div><div><p className="font-semibold text-white">Ubicación</p><p className="text-slate-400 text-sm">Av. Aconquija 1234, Tucumán</p></div></div>
                    <div className="flex items-start gap-4"><div className="p-3 bg-slate-800 rounded-lg text-[#c4a484]"><Phone size={24} /></div><div><p className="font-semibold text-white">Teléfono</p><p className="text-slate-400 text-sm">+54 381 444-5555</p></div></div>
                    <div className="flex items-start gap-4"><div className="p-3 bg-slate-800 rounded-lg text-[#c4a484]"><Mail size={24} /></div><div><p className="font-semibold text-white">Email</p><p className="text-slate-400 text-sm">contacto@seneca.com</p></div></div>
                </div>
             </div>
          </div>

          {/* LADO DERECHO: FORMULARIO */}
          <div className="md:w-7/12 p-10 md:p-14 bg-white">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Envíanos un Mensaje</h3>
            <p className="text-slate-500 mb-8">Te responderemos directamente a tu panel de usuario.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div>
                <label htmlFor="mensaje" className="block text-sm font-medium text-slate-700 mb-2">Tu Consulta</label>
                <textarea
                  id="mensaje"
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:ring-2 focus:ring-[#c4a484] focus:border-transparent outline-none transition-all resize-none placeholder:text-slate-400"
                  placeholder="Hola, quisiera saber disponibilidad..."
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  disabled={isPending}
                  required
                ></textarea>
              </div>

              {/* FEEDBACK UI */}
              {isError && (
                <div className="p-4 rounded-xl bg-red-50 text-red-600 flex items-center gap-3 animate-in fade-in">
                  <AlertCircle size={20} />
                  <span className="text-sm font-medium">{errorMsg}</span>
                </div>
              )}

              {isSuccess && (
                <div className="p-4 rounded-xl bg-green-50 text-green-700 flex items-center gap-3 animate-in fade-in">
                  <CheckCircle size={20} />
                  <div>
                    <p className="font-bold text-sm">¡Mensaje Enviado!</p>
                    <p className="text-xs opacity-90">Pronto recibirás respuesta.</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isPending || isSuccess}
                className="w-full py-4 px-6 bg-[#c4a484] hover:bg-[#a88b6e] text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <> <Loader2 size={20} className="animate-spin" /> Enviando... </>
                ) : (
                  <> Enviar Mensaje <Send size={20} /> </>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contacto;