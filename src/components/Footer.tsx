import { Instagram, MapPin, Phone, Mail, Scissors } from 'lucide-react';
import { useNegocio } from '../hooks/useNegocio'; // 👈 Importamos el hook
import { WhatsAppBtn } from './common/WhatsAppBtn';


export const Footer = () => {
    const { negocio } = useNegocio();

    // Datos dinámicos o por defecto
    const direccion = negocio?.direccion || "9 de Julio 169, Manantial, Tucumán";
    const telefono = negocio?.telefono || "+54 9 381 208-9809";
    const email = negocio?.email || "pedroaguirre@gmail.com"; // Si tienes este dato en el back, úsalo

    return (
        <footer className="bg-granular-dark text-zinc-400 py-16 border-t border-white/10 relative overflow-hidden">

            <div className="z-1 absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-50 transition-opacity duration-300"></div>

            <div className="max-w-6xl mx-auto px-6">

                {/* GRID PRINCIPAL: 3 COLUMNAS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

                    {/* COLUMNA 1: MARCA (Lógica del Navbar) */}
                    <div>
                        <div className="mb-10 flex items-center justify-center mr-20 gap-3 z-10 relative">
                            {negocio?.logoUrl ? (<img src={negocio.logoUrl} alt="Logo" className="h-25 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-500 " />
                            ) : (
                                <div className="flex items-center gap-3">
                                    <div className="bg-[#C9A227]/10 p-2.5 rounded-xl border border-[#C9A227]/20">
                                        <Scissors className="text-[#C9A227]" size={28} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-white font-black tracking-widest text-2xl leading-none">SÉNECA</span>
                                        <span className="text-[#C9A227] text-[10px] tracking-[0.4em] font-bold">BARBERÍA</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* REDES SOCIALES */}
                        <div className="flex gap-3 justify-center mr-20 z-10 relative">
                            <a key="instagram" href="https://www.instagram.com/barberiaseneca/" className="bg-[#131313] p-2.5 rounded-lg border border-white/5 text-zinc-400 hover:bg-[#C9A227] hover:text-[#131313] hover:border-[#C9A227] transition-all duration-300 hover:-translate-y-1"><Instagram size={18} /></a>
                            <WhatsAppBtn telefono={negocio?.telefono || "+54 9 381 208-9809"} tipo="ICON" iconSize={18} className="bg-[#131313] p-2.5 rounded-lg border border-white/5 text-zinc-400 hover:bg-[#C9A227] hover:text-[#131313] hover:border-[#C9A227] transition-all duration-300 hover:-translate-y-1 flex items-center justify-center"/>
                        </div>
                    </div>

                    {/* COLUMNA 2: CONTACTO RÁPIDO */}
                    <div>
                        <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
                            <span className="w-8 h-0.5 bg-[#C9A227]"></span> Contacto
                        </h3>
                        <ul className="space-y-5 text-sm z-10 relative">
                            <li className="flex items-start gap-4 group">
                                <div className="p-2 bg-[#131313] rounded-lg text-[#C9A227] group-hover:text-white transition-colors border border-white/5">
                                    <MapPin size={16} />
                                </div>
                                <span className="text-zinc leading-snug mt-1.5">{direccion}</span>
                            </li>
                            <li className="flex items-center gap-4 group">
                                <div className="p-2 bg-[#131313] rounded-lg text-[#C9A227] group-hover:text-white transition-colors border border-white/5">
                                    <Phone size={16} />
                                </div>
                                <span className="text-zinc">{telefono}</span>
                            </li>
                            <li className="flex items-center gap-4 group">
                                <div className="p-2 bg-[#131313] rounded-lg text-[#C9A227] group-hover:text-white transition-colors border border-white/5">
                                    <Mail size={16} />
                                </div>
                                <span className="text-zinc">{email}</span>
                            </li>
                        </ul>
                    </div>

                    {/* COLUMNA 3: HORARIOS */}
                    <div>
                        <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
                            <span className="w-8 h-0.5 bg-[#C9A227]"></span> Horarios
                        </h3>
                        <ul className="space-y-3 text-sm z-10 relative">
                            <li className="flex justify-between items-start border-b border-zinc-700 pb-3">
                                <span className="text-zinc font-medium">Lunes - Viernes</span>
                                <div className="flex flex-col items-end gap-0.5">
                                    <span className="font-mono font-bold text-zinc-300">09:00 - 14:00</span>
                                    <span className="font-mono font-bold text-zinc-300">16:00 - 22:00</span>
                                </div>
                            </li>
                            <li className="flex justify-between items-center border-b border-zinc-700 pb-3 pt-1">
                                <span className="text-zinc font-medium">Sábados</span>
                                <span className="font-mono font-bold text-zinc-300">10:00 - 18:00</span>
                            </li>
                            <li className="flex justify-between items-center pt-2">
                                <span className="text-zinc font-medium">Domingos</span>
                                <span className="font-bold text-[10px] text-red-400 bg-red-900/10 px-2 py-0.5 rounded border border-red-900/20 uppercase tracking-wider">
                                    Cerrado
                                </span>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* BARRA INFERIOR */}
                <div className="border-t border-zinc-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest text-zinc z-10 relative">
                    <p>© {new Date().getFullYear()} SÉNECA BARBERÍA. Todos los derechos reservados.</p>
                    <p className="flex items-center gap-1">
                        Designed by <span className="text-[#C9A227]">LUCIO A. ARGIRO</span>
                    </p>
                </div>

            </div>
        </footer>
    );
};