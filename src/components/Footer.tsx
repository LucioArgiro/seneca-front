import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, Scissors } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="bg-slate-900 text-gray-300 py-16">
            <div className="max-w-6xl mx-auto px-4">

                {/* GRID PRINCIPAL: 3 COLUMNAS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

                    {/* COLUMNA 1: MARCA Y DESCRIPCIÓN */}
                    <div>
                        <div className="flex items-center gap-2 font-bold text-2xl text-white mb-4">
                            <Scissors className="text-blue-500" />
                            <span>Barbería Elite</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Redefiniendo el estilo clásico para el hombre moderno.
                            Profesionalismo, higiene y estilo en un solo lugar.
                        </p>
                        {/* REDES SOCIALES */}
                        <div className="flex gap-4">
                            <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-blue-600 hover:text-white transition">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-blue-600 hover:text-white transition">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-blue-600 hover:text-white transition">
                                <Twitter size={20} />
                            </a>
                        </div>
                    </div>

                    {/* COLUMNA 2: CONTACTO RÁPIDO */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Contacto</h3>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin className="text-blue-500 shrink-0" size={18} />
                                <span>Av. Corrientes 1234, CABA<br />Buenos Aires, Argentina</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="text-blue-500 shrink-0" size={18} />
                                <span>+54 11 1234-5678</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="text-blue-500 shrink-0" size={18} />
                                <span>contacto@barberiaelite.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* COLUMNA 3: HORARIOS */}
                    <ul className="space-y-3 text-sm">
                        <li className="flex justify-between items-start border-b border-slate-800 pb-2">
                            <span className="mt-0.5 text-gray-400">Lunes - Viernes</span>
                            <div className="flex flex-col items-end gap-1">
                                <span className="font-bold text-white">09:00 - 14:00</span>
                                <span className="font-bold text-white">16:00 - 22:00</span> {/* Ajusté a 16 o 17 según prefieras */}
                            </div>
                        </li>
                        <li className="flex justify-between items-center border-b border-slate-800 pb-2">
                            <span className="text-gray-400">Sábados</span>
                            <span className="font-bold text-white">10:00 - 18:00</span>
                        </li>
                        <li className="flex justify-between items-center pt-1">
                            <span className="text-gray-400">Domingos</span>
                            <span className="font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded text-xs uppercase tracking-wider">
                                Cerrado
                            </span>
                        </li>
                    </ul>

                </div>

                {/* BARRA INFERIOR DE COPYRIGHT */}
                <div className="border-t border-slate-800 pt-8 text-center text-xs text-gray-500">
                    <p>© {new Date().getFullYear()} Séneca. Todos los derechos reservados.</p>
                </div>

            </div>
        </footer>
    );
};