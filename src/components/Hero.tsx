import { useNavigate } from "react-router-dom";

export const Hero = () => {
    const navigate = useNavigate();

    return (
        <section id="inicio" className="relative h-[600px] flex items-center justify-center">
            {/* IMAGEN DE FONDO */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop')" }}
            ></div>
            {/* Capa Oscura */}
            <div className="absolute inset-0 bg-black/60"></div>
            {/* CONTENIDO TEXTO */}
            <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
                <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">Estilo Clásico,
                    <span className="text-blue-400">Corte Moderno</span>
                </h1>
                <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
                    Descubre la experiencia definitiva en cuidado masculino.
                    Reserva tu cita con los mejores profesionales de la ciudad.
                </p>
                <div className="flex gap-4 justify-center">
                    <button onClick={() => navigate('/login')} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold transition">
                        Reservar Ahora
                    </button>
                    <a
                        href="#servicios"
                        className="border border-white hover:bg-white hover:text-black text-white px-8 py-3 rounded font-bold text-lg transition inline-block"
                    >
                        Ver Servicios
                    </a>
                </div>
            </div>
        </section>
    );
};
