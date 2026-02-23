import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, KeyRound, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { emailApi } from '../../api/contacto';
import axiosInstance from '../../api/axios';

// Regex de seguridad: Mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

export const Recuperar = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Datos del formulario
    const [email, setEmail] = useState('');
    const [codigo, setCodigo] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // --- PASO 1: SOLICITAR CÓDIGO ---
    const handleRequestCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axiosInstance.post('/auth/solicitar-recuperacion', { email });
            const { nombre, codigoTemporale } = data;

            await emailApi.enviarCodigoRecuperacion({
                nombre: nombre || 'Usuario',
                email: email,
                codigo: codigoTemporale
            });

            toast.success('¡Código enviado! Revisa tu correo.', {
                style: { background: '#1A1A1A', color: '#C9A227', border: '1px solid rgba(201,162,39,0.3)' }
            });
            setStep(2);
        } catch (error) {
            console.error(error);
            toast.error('No pudimos encontrar ese email.');
        } finally {
            setLoading(false);
        }
    };

    // --- PASO 2: VERIFICAR CÓDIGO ---
    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Llamamos al nuevo endpoint que creamos en el backend
            await axiosInstance.post('/auth/verificar-codigo', {
                email,
                codigo,
            });

            toast.success('Código verificado correctamente', {
                style: { background: '#1A1A1A', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' },
                iconTheme: { primary: '#10b981', secondary: '#1A1A1A' }
            });
            setStep(3); // Pasamos a crear la nueva contraseña
        } catch (error) {
            toast.error('El código es incorrecto o ha expirado.');
        } finally {
            setLoading(false);
        }
    };

    // --- PASO 3: CAMBIAR CONTRASEÑA ---
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Validaciones del Frontend
        if (password !== confirmPassword) {
            toast.error('Las contraseñas no coinciden.');
            return;
        }

        if (!passwordRegex.test(password)) {
            toast.error('La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un símbolo especial.', {
                duration: 5000
            });
            return;
        }

        setLoading(true);
        try {
            await axiosInstance.post('/auth/restablecer-password', {
                email,
                codigo,
                newPassword: password
            });

            toast.success('¡Contraseña actualizada con éxito!', {
                style: { background: '#1A1A1A', color: '#C9A227', border: '1px solid rgba(201,162,39,0.3)' }
            });
            navigate('/login');
        } catch (error) {
            toast.error('Hubo un error al actualizar la contraseña.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative bg-[#0a0a0a] overflow-hidden selection:bg-[#C9A227] selection:text-[#131313]">

            {/* FONDO FIXED LUXURY */}
            <div
                className="fixed inset-0 bg-cover bg-center z-0 scale-105"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2070&auto=format&fit=crop')" }}
            ></div>
            <div className="fixed inset-0 bg-gradient-to-b from-black/80 via-[#0a0a0a]/85 to-[#0a0a0a] z-0"></div>

            {/* BOTÓN VOLVER AL LOGIN */}
            <Link to="/login" className="absolute top-8 left-8 text-zinc-500 hover:text-[#C9A227] flex items-center gap-2 z-20 transition-all font-bold uppercase tracking-widest text-xs group">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Volver al Login
            </Link>

            {/* TARJETA DE RECUPERACIÓN */}
            <div className="relative z-10 w-full max-w-md bg-[#131313]/90 p-8 md:p-10 rounded-3xl border border-white/5 shadow-2xl animate-in fade-in zoom-in-95 duration-500">

                <div className="text-center mb-8">
                    <div className="inline-flex p-4 rounded-full bg-[#0a0a0a] border border-[#C9A227]/30 text-[#C9A227] mb-6 shadow-[0_0_20px_rgba(201,162,39,0.15)]">
                        {step === 3 ? <CheckCircle size={32} className="text-emerald-500" /> : <KeyRound size={32} />}
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight">
                        {step === 3 ? 'Nueva Contraseña' : 'Recuperar Acceso'}
                    </h1>
                    <p className="text-zinc-500 text-sm mt-3 font-medium">
                        {step === 1 && 'Ingresa tu email para buscar tu cuenta.'}
                        {step === 2 && 'Ingresa el código que te enviamos al correo.'}
                        {step === 3 && 'Crea una contraseña segura para tu cuenta.'}
                    </p>
                </div>

                {/* --- RENDERIZADO CONDICIONAL POR PASOS --- */}

                {step === 1 && (
                    <form onSubmit={handleRequestCode} className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold text-[#C9A227] uppercase tracking-widest ml-1">Tu Email</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="text-zinc-600 group-focus-within:text-[#C9A227] transition-colors" size={18} />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-zinc-700 focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] outline-none transition-all shadow-inner"
                                    placeholder="ejemplo@correo.com"
                                    required
                                />
                            </div>
                        </div>
                        <button
                            disabled={loading}
                            className="w-full bg-[#C9A227] hover:bg-[#b88d15] text-[#131313] py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all shadow-[0_0_20px_rgba(201,162,39,0.2)] hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <>Enviar Código <ArrowRight size={18} /></>}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleVerifyCode} className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold text-[#C9A227] uppercase tracking-widest text-center">Código de 6 dígitos</label>
                            <input
                                type="text"
                                value={codigo}
                                onChange={(e) => setCodigo(e.target.value)}
                                className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl py-4 px-4 text-center text-white text-2xl tracking-[0.5em] font-black focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] outline-none transition-all shadow-inner uppercase"
                                placeholder="000000"
                                maxLength={6}
                                required
                            />
                        </div>
                        <button
                            disabled={loading || codigo.length < 6}
                            className="w-full bg-[#C9A227] hover:bg-[#b88d15] text-[#131313] py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all shadow-[0_0_20px_rgba(201,162,39,0.2)] hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : 'VERIFICAR CÓDIGO'}
                        </button>
                        <p className="text-center text-xs text-zinc-500">
                            ¿No te llegó? <button type="button" onClick={handleRequestCode} className="text-[#C9A227] hover:underline font-bold">Reenviar</button>
                        </p>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handleResetPassword} className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold text-[#C9A227] uppercase tracking-widest ml-1">Nueva Contraseña</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="text-zinc-600 group-focus-within:text-[#C9A227] transition-colors" size={18} />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-zinc-700 focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] outline-none transition-all shadow-inner"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            <p className="text-[10px] text-zinc-500 ml-1">Mín. 8 caracteres, mayúscula, número y símbolo (@$!%*?&)</p>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold text-[#C9A227] uppercase tracking-widest ml-1">Repetir Contraseña</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="text-zinc-600 group-focus-within:text-[#C9A227] transition-colors" size={18} />
                                </div>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-zinc-700 focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] outline-none transition-all shadow-inner"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            className="w-full bg-[#C9A227] hover:bg-[#b88d15] text-[#131313] py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all shadow-[0_0_20px_rgba(201,162,39,0.2)] hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : 'GUARDAR CONTRASEÑA'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};