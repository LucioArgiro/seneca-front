import { Link } from 'react-router-dom';
import { Users, Scissors, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Panel de Control</h1>
      <p className="text-slate-500 mb-8">Bienvenido, aquí tienes el resumen de tu barbería.</p>

      {/* Tarjetas de Resumen (Ejemplo visual) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Users size={24}/></div>
                <div>
                    <p className="text-slate-500 text-sm">Clientes Totales</p>
                    <p className="text-2xl font-bold text-slate-900">1,240</p>
                </div>
            </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 text-purple-600 rounded-xl"><Scissors size={24}/></div>
                <div>
                    <p className="text-slate-500 text-sm">Barberos Activos</p>
                    <p className="text-2xl font-bold text-slate-900">4</p>
                </div>
            </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 text-green-600 rounded-xl"><TrendingUp size={24}/></div>
                <div>
                    <p className="text-slate-500 text-sm">Ingresos del Mes</p>
                    <p className="text-2xl font-bold text-slate-900">$4.5k</p>
                </div>
            </div>
        </div>
      </div>

      {/* Accesos Rápidos */}
      <h2 className="text-xl font-bold text-slate-900 mb-4">Gestión Rápida</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/admin/crear-barbero" className="p-4 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition text-center font-medium">
              + Contratar Nuevo Barbero
          </Link>
          <Link to="/admin/servicios" className="p-4 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition text-center font-medium">
              Gestionar Servicios y Precios
          </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;