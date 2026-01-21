import { useState, useMemo, useRef, useEffect } from 'react';
import { useMisMensajes } from '../../hooks/useMensajes';
import { useAuthStore } from '../../store/auth';
import {MessageSquare, Clock, Trash2, Send, Loader2, AlertCircle, Search, X, ArrowLeft, ChevronRight, User} from 'lucide-react';
import { formatearHoraArgentina, formatearFechaCompleta } from '../../utils/dateUtils';

const MisMensajesList = () => {
  const { user } = useAuthStore();
  const { data: mensajes, isLoading, isError, borrarMensaje, responderMensaje, isReplying } = useMisMensajes();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ORDENAMIENTO
  const sortedMensajes = useMemo(() => {
    if (!mensajes) return [];
    return [...mensajes].sort((a: any, b: any) => {
      const lastUpdateA = a.updatedAt ? new Date(a.updatedAt).getTime() : new Date(a.createdAt).getTime();
      const lastUpdateB = b.updatedAt ? new Date(b.updatedAt).getTime() : new Date(b.createdAt).getTime();
      return lastUpdateB - lastUpdateA;
    });
  }, [mensajes]);

  const activeChat = useMemo(() => sortedMensajes.find((m: any) => m.id === selectedId), [sortedMensajes, selectedId]);

  // SCROLL AUTOMÁTICO
  useEffect(() => {
    if (selectedId) {
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [selectedId, mensajes]);

  const toggleConversation = (id: string) => {
    if (selectedId === id) setSelectedId(null);
    else setSelectedId(id);
  };

  const handleSend = () => {
    if (!selectedId || !replyText.trim()) return;

    responderMensaje({ id: selectedId, texto: replyText }, {
      onSuccess: () => {
        setReplyText('');
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
      }
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Quieres eliminar esta consulta?')) {
      borrarMensaje(id);
      if (selectedId === id) setSelectedId(null);
    }
  };

  const renderChatBubbles = (msg: any) => {
    const replies = msg.replies || [];

    return (
      <div className="flex flex-col gap-4 p-4 pb-4">
        {/* Mensaje Inicial */}
        <div className="flex justify-end pl-8 md:pl-16">
          <div className="bg-[#c4a484] text-white p-4 rounded-2xl rounded-tr-none shadow-sm max-w-[90%] md:max-w-[85%]">
            <div className="flex justify-between items-baseline gap-4 mb-1 border-b border-white/20 pb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-white/90">Tú (Consulta)</span>
              <span className="text-[10px] text-white/70 shrink-0">{formatearFechaCompleta(msg.createdAt)}</span>
            </div>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.contenido}</p>
          </div>
        </div>

        {/* Respuesta Legacy */}
        {msg.respuesta && (
          <div className="flex justify-start pr-8 md:pr-16">
            <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none shadow-sm max-w-[90%]">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-blue-600 uppercase">Staff</span>
                <span className="text-[10px] bg-slate-100 px-2 rounded-full text-slate-400">Respuesta anterior</span>
              </div>
              <p className="text-slate-700 text-sm">{msg.respuesta}</p>
            </div>
          </div>
        )}

        {/* Hilo */}
        {replies.map((reply: any) => {
          const esMio = reply.autor?.id === user?.id;
          return (
            <div key={reply.id} className={`flex ${esMio ? 'justify-end pl-8 md:pl-16' : 'justify-start pr-8 md:pr-16'}`}>
              <div className={`p-3 rounded-2xl text-sm shadow-sm max-w-[90%] md:max-w-[85%]
                            ${esMio ? 'bg-[#c4a484] text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'}`}
              >
                <div className={`flex justify-between items-center gap-3 mb-1 border-b pb-1 ${esMio ? 'border-white/20' : 'border-slate-100'}`}>
                  <span className={`text-[10px] font-bold uppercase ${esMio ? 'text-white/90' : 'text-blue-600'}`}>
                    {esMio ? 'Tú' : (reply.autor?.fullname || 'Staff')}
                  </span>
                  <span className={`text-[10px] ${esMio ? 'text-white/70' : 'text-slate-400'}`}>
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

  if (isLoading) return <div className="h-60 flex items-center justify-center text-slate-400"><Loader2 className="animate-spin mr-2" /> Cargando...</div>;
  if (isError) return <div className="p-10 text-center text-red-500"><AlertCircle className="mx-auto mb-2" /> Error al cargar.</div>;

  return (
    <div className="w-full h-[calc(100vh-180px)] bg-white flex flex-col md:flex-row relative rounded-xl overflow-hidden border border-slate-200 shadow-sm mt-4">

      {/* SIDEBAR */}
      <div className={`w-full md:w-80 lg:w-96 border-r border-slate-100 flex-col bg-slate-50/30 h-full ${selectedId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-slate-100 bg-white sticky top-0 z-10">
          <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
            <MessageSquare className="text-[#c4a484]" size={20} /> Mis Consultas
          </h2>
          <div className="mt-3 relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <input type="text" placeholder="Buscar..." className="w-full bg-slate-100 border-none rounded-xl pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-[#c4a484] outline-none transition-all" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
          {!sortedMensajes || sortedMensajes.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm flex flex-col items-center gap-2 h-full justify-center">
              <MessageSquare size={30} className="opacity-20" />
              <p>Aún no has realizado consultas.</p>
            </div>
          ) : (
            sortedMensajes.map((msg: any) => {
              // Lógica para detectar si lo último fue del Staff
              const replies = msg.replies || [];
              const hasReplies = replies.length > 0;

              let ultimoTexto = msg.contenido;
              let ultimoEsStaff = false; // Indica si el Staff habló al final

              if (hasReplies) {
                const ultimoReply = replies[replies.length - 1];
                ultimoTexto = ultimoReply.texto;
                ultimoEsStaff = ultimoReply.autor?.role !== 'CLIENT';
              } else if (msg.respuesta) {
                ultimoTexto = msg.respuesta;
                ultimoEsStaff = true;
              }
              const isSelected = selectedId === msg.id;
              const showNotification = ultimoEsStaff;

              return (
                <div
                  key={msg.id}
                  onClick={() => toggleConversation(msg.id)}
                  className={`p-4 border-b border-slate-100 cursor-pointer transition-all hover:bg-slate-50 group relative
                                ${isSelected ? 'bg-[#f8f5f2] border-l-4 border-l-[#c4a484] z-10' : 'border-l-4 border-l-transparent hover:border-l-slate-200'}
                            `}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={`font-bold text-sm truncate max-w-[65%] ${showNotification ? 'text-slate-900' : 'text-slate-500'}`}>
                      {showNotification ? '¡Nueva Respuesta!' : 'Enviado'}
                    </span>
                    <div className="flex items-center gap-1">
                      {/* Icono de estado */}
                      {showNotification ? (
                        <span className="flex h-2 w-2 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                      ) : (
                        <Clock size={12} className="text-slate-300" />
                      )}
                      <span className={`text-[10px] whitespace-nowrap ${showNotification ? 'text-green-600 font-bold' : 'text-slate-400'}`}>
                        {formatearFechaCompleta(msg.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-end gap-2">
                    <p className={`text-xs line-clamp-1 flex-1 ${showNotification ? 'text-slate-800 font-medium' : 'text-slate-500 italic'}`}>
                      {ultimoEsStaff && <span className="text-blue-600 font-bold mr-1">Staff:</span>}
                      "{ultimoTexto}"
                    </p>
                    <ChevronRight size={14} className={`text-slate-300 transition-transform ${isSelected ? 'text-[#c4a484] translate-x-1' : 'group-hover:translate-x-1'}`} />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* CHAT */}
      <div className={`flex-col bg-[#efeae2] relative h-full ${!selectedId ? 'hidden md:flex flex-1' : 'flex w-full md:flex-1'}`}>
        {selectedId && activeChat ? (
          <>
            <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 shadow-sm z-20 shrink-0 relative">
              <div className="flex items-center gap-3 overflow-hidden">
                <button onClick={() => setSelectedId(null)} className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-full active:bg-slate-200"><ArrowLeft size={22} /></button>
                <div className="w-10 h-10 rounded-full bg-[#c4a484] flex items-center justify-center text-white font-bold shrink-0"><User size={20} /></div>
                <div className="overflow-hidden">
                  <h3 className="font-bold text-slate-800 text-sm">Soporte Séneca</h3>
                 
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => handleDelete(activeChat.id)} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-colors" title="Eliminar conversación"><Trash2 size={20} /></button>
                <button onClick={() => setSelectedId(null)} className="hidden md:block p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors ml-2"><X size={24} /></button>
              </div>
            </div>

            <div className="flex-1 relative w-full h-full">
              <div className="absolute inset-0 opacity-[0.6] pointer-events-none bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-cover bg-center bg-no-repeat z-0"></div>
              <div className="absolute inset-0 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-slate-300 z-10">
                {renderChatBubbles(activeChat)}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="p-4 bg-[#f0f2f5] border-t border-slate-200 shrink-0 z-20 relative">
              <div className="flex gap-2 items-end max-w-4xl mx-auto">
                <textarea className="flex-1 bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#c4a484] focus:border-transparent outline-none resize-none scrollbar-hide min-h-[44px] max-h-32 shadow-sm" rows={1} placeholder="Escribe una respuesta..." value={replyText} onChange={(e) => setReplyText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} />
                <button onClick={handleSend} disabled={isReplying || !replyText.trim()} className="bg-[#c4a484] hover:bg-[#a88b6e] text-white w-11 h-11 rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center shrink-0">
                  {isReplying ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-[#f0f2f5] p-6 text-center border-l border-slate-200">
            <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mb-4"><MessageSquare size={40} className="text-slate-400" /></div>
            <p className="text-lg font-medium text-slate-500">Historial de Consultas</p>
            <p className="text-sm">Selecciona una consulta para ver la respuesta.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MisMensajesList;