import { useState, useMemo, useRef, useEffect } from 'react';
import { useStaffMensajes } from '../../hooks/useMensajes';
import {
  Mail, Send, User, Loader2, Search, X, MessageSquare,
  CheckCircle2, Clock, ChevronRight, ArrowLeft, Trash2
} from 'lucide-react';
import { formatearHoraArgentina, formatearFechaCompleta } from '../../utils/dateUtils';

const AdminMensajes = () => {
  // 👇 Asegúrate de que tu hook exporte 'borrarMensaje'
  const { pendientes, respondidos, isLoading, responder, isReplying, borrarMensaje } = useStaffMensajes();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');

  // 1. CREAMOS LA REFERENCIA PARA EL SCROLL
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // LOGICA TOGGLE
  const toggleConversation = (id: string) => {
    if (selectedId === id) {
      setSelectedId(null);
    } else {
      setSelectedId(id);
    }
  };

  // ORDENAMIENTO
  const allConversations = useMemo(() => {
    const combined = [...pendientes, ...respondidos];
    return combined.sort((a: any, b: any) => {
      const lastUpdateA = a.updatedAt ? new Date(a.updatedAt).getTime() : new Date(a.createdAt).getTime();
      const lastUpdateB = b.updatedAt ? new Date(b.updatedAt).getTime() : new Date(b.createdAt).getTime();
      return lastUpdateB - lastUpdateA;
    });
  }, [pendientes, respondidos]);

  const activeChat = useMemo(() => allConversations.find((c: any) => c.id === selectedId), [allConversations, selectedId]);
  
  // Auto-scroll effect
  useEffect(() => { if (activeChat) { setTimeout(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, 100); } }, [activeChat]);

  const handleSend = () => {
    if (!selectedId || !responseText.trim()) return;

    responder({ id: selectedId, respuesta: responseText }, {
      onSuccess: () => {
        setResponseText('');
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    });
  };

  // 👇 LÓGICA DE ELIMINAR
  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta conversación?')) {
        // Asumimos que borrarMensaje existe en el hook
        if (borrarMensaje) {
            borrarMensaje(id);
            setSelectedId(null); // Cerramos el chat al borrar
        } else {
            console.error("La función borrarMensaje no está disponible en el hook.");
        }
    }
  };

  const renderChatBubbles = (msg: any) => {
    const replies = msg.replies || [];

    return (
      <div className="flex flex-col gap-4 p-4 pb-4">
        {/* MENSAJE ORIGINAL */}
        <div className="flex justify-start pr-8 md:pr-16">
          <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none shadow-sm max-w-[90%] md:max-w-[85%]">
            <div className="flex justify-between items-baseline gap-4 mb-1 border-b border-slate-100 pb-1">
              <span className="text-xs font-bold text-slate-700 uppercase truncate">
                {msg.cliente?.usuario?.fullname || 'Cliente'}
              </span>
              <span className="text-[10px] text-slate-400 shrink-0">
                {formatearFechaCompleta(msg.createdAt)}
              </span>
            </div>
            <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-wrap">{msg.contenido}</p>
          </div>
        </div>

        {/* RESPUESTA LEGACY */}
        {msg.respuesta && (
          <div className="flex justify-center my-2">
            <span className="text-[10px] bg-slate-100 text-slate-400 px-3 py-1 rounded-full border border-slate-200">
              Respuesta antigua importada
            </span>
          </div>
        )}

        {/* HILO DE RESPUESTAS */}
        {replies.map((reply: any) => {
          const isStaff = reply.autor?.role === 'ADMIN' || reply.autor?.role === 'BARBER';

          return (
            <div key={reply.id} className={`flex ${isStaff ? 'justify-end pl-8 md:pl-16' : 'justify-start pr-8 md:pr-16'}`}>
              <div className={`p-3 rounded-2xl text-sm shadow-sm max-w-[90%] md:max-w-[85%]
                        ${isStaff
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'
                }`}
              >
                <div className={`flex justify-between items-center gap-3 mb-1 border-b pb-1 ${isStaff ? 'border-white/20' : 'border-slate-100'}`}>
                  <span className="text-[10px] font-bold uppercase">
                    {isStaff ? 'Staff' : (reply.autor?.fullname || 'Cliente')}
                  </span>
                  <span className={`text-[10px] ${isStaff ? 'text-blue-100' : 'text-slate-400'}`}>
                    {formatearHoraArgentina(reply.createdAt)}
                  </span>
                </div>
                <p className="leading-relaxed whitespace-pre-wrap">{reply.texto}</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (isLoading) return <div className="h-full flex items-center justify-center text-slate-400"><Loader2 className="animate-spin mr-2" /> Cargando buzón...</div>;

  return (
    <div className="w-full h-full bg-white flex flex-col md:flex-row relative">

      {/* IZQUIERDA: SIDEBAR */}
      <div className={`w-full md:w-80 lg:w-96 border-r border-slate-100 flex-col bg-slate-50/30 h-full
          ${selectedId ? 'hidden md:flex' : 'flex'}`}
      >
        <div className="p-4 border-b border-slate-100 bg-white sticky top-0 z-10">
          <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
            <Mail className="text-blue-600" size={20} /> Mensajes
          </h2>
          <div className="mt-3 relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Buscar cliente..."
              className="w-full bg-slate-100 border-none rounded-xl pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
          {allConversations.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm flex flex-col items-center gap-2">
              <MessageSquare size={30} className="opacity-20" />
              <p>No hay conversaciones.</p>
            </div>
          ) : (
            allConversations.map((conv: any) => {
              // Lógica de "Activo" (si el último mensaje es del cliente)
              const replies = conv.replies || [];
              const hasReplies = replies.length > 0;
              
              // Determinar texto del último mensaje
              let ultimoTexto = conv.contenido;
              let ultimoAutorEsStaff = false;

              if (hasReplies) {
                  const ultimoReply = replies[replies.length - 1];
                  ultimoTexto = ultimoReply.texto;
                  ultimoAutorEsStaff = ultimoReply.autor?.role === 'ADMIN' || ultimoReply.autor?.role === 'BARBER';
              }

              // Si no está leído O el último mensaje es del cliente -> Activo (Negrita)
              const isActive = !conv.leido || (hasReplies && replies[replies.length - 1].autor?.role === 'CLIENT');
              const isSelected = selectedId === conv.id;

              return (
                <div key={conv.id} onClick={() => toggleConversation(conv.id)} className={`p-4 border-b border-slate-100 cursor-pointer transition-all hover:bg-slate-50 group relative ${isSelected ? 'bg-blue-50 border-l-4 border-l-blue-600 z-10' : 'border-l-4 border-l-transparent hover:border-l-slate-200'}`}>
                  <div className="flex justify-between items-start mb-1">
                    <span className={`font-bold text-sm truncate max-w-[65%] ${isActive ? 'text-slate-900' : 'text-slate-600'}`}>
                      {conv.cliente?.usuario?.fullname || 'Usuario'}
                    </span>
                    <div className="flex items-center gap-1">
                      {isActive ? <CheckCircle2 size={12} className="text-orange-500" /> : <Clock size={12} className="text-slate-300" />}
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">
                        {formatearFechaCompleta(conv.createdAt)}
                      </span>
                    </div>
                  </div>
                  
                  {/* ULTIMO MENSAJE */}
                  <div className="flex justify-between items-end gap-2">
                    <p className={`text-xs line-clamp-1 flex-1 ${isActive ? 'text-slate-700 font-medium' : 'text-slate-500 italic'}`}>
                      {ultimoAutorEsStaff && <span className="font-semibold text-slate-400 mr-1">Tú:</span>}
                      "{ultimoTexto}"
                    </p>
                    <ChevronRight size={14} className={`text-slate-300 transition-transform ${isSelected ? 'text-blue-500 translate-x-1' : 'group-hover:translate-x-1'}`} />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* DERECHA: CHAT */}
      <div className={`flex-col bg-[#efeae2] relative h-full
           ${!selectedId ? 'hidden md:flex flex-1' : 'flex w-full md:flex-1'}`}
      >
        {selectedId && activeChat ? (
          <>
            {/* Cabecera */}
            <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 shadow-sm z-20 shrink-0 relative">
              <div className="flex items-center gap-3 overflow-hidden">
                <button
                  onClick={() => setSelectedId(null)}
                  className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-full active:bg-slate-200"
                >
                  <ArrowLeft size={22} />
                </button>

                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">
                  {activeChat.cliente?.usuario?.fullname?.charAt(0) || <User size={20} />}
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-bold text-slate-800 text-sm truncate">
                    {activeChat.cliente?.usuario?.fullname}
                  </h3>
                  <p className="text-xs text-slate-500 truncate">
                    {activeChat.cliente?.usuario?.email}
                  </p>
                </div>
              </div>

              {/* ACCIONES (BORRAR Y CERRAR) */}
              <div className="flex items-center gap-1">
                  <button 
                    onClick={() => handleDelete(activeChat.id)} 
                    className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-colors"
                    title="Eliminar conversación"
                  >
                    <Trash2 size={20} />
                  </button>
                  <button 
                    onClick={() => setSelectedId(null)} 
                    className="hidden md:block p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors ml-2" 
                    title="Cerrar chat"
                  >
                    <X size={24} />
                  </button>
              </div>
            </div>

            {/* ZONA DE MENSAJES */}
            <div className="flex-1 relative w-full h-full">
              <div className="absolute inset-0 opacity-[0.6] pointer-events-none bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-cover bg-center bg-no-repeat z-0"></div>
              <div className="absolute inset-0 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-slate-300 z-10">
                {renderChatBubbles(activeChat)}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <div className="p-4 bg-[#16161678] border-t border-slate-200 shrink-0 z-20 relative">
              <div className="flex gap-2 items-end max-w-4xl mx-auto">
                <textarea
                  className="flex-1 bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none scrollbar-hide min-h-[44px] max-h-32 shadow-sm"
                  rows={1}
                  placeholder="Escribe un mensaje..."
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <button
                  onClick={handleSend}
                  disabled={isReplying || !responseText.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white w-11 h-11 rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center shrink-0"
                >
                  {isReplying ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-[#f0f2f5] p-6 text-center border-l border-slate-200">
            <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mb-4">
              <MessageSquare size={40} className="text-slate-400" />
            </div>
            <p className="text-lg font-medium text-slate-500">Buzón de Mensajes</p>
            <p className="text-sm">Selecciona una conversación.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMensajes;