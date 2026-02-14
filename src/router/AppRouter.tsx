import { type ReactNode } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import AdminLayout from "../layout/AdminLayout";
import { BarberLayout } from "../layout/BarberLayout";
import Login from "../pages/Login";
import Register from '../pages/Register';
import Landing from '../pages/Landing';
import BarberProfile from "../pages/barber/BarberProfile";
import BarberSettings from "../pages/barber/BarberSettings";
import ClientDashboard from "../pages/client/ClientDashboard";
import BarberAgenda from "../pages/barber/BarberAgenda";
import BarberHistory from "../pages/barber/BarberHistory";
import { BarberCaja } from '../pages/barber/BarberCaja';
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminServicios from "../pages/admin/AdminServicios";
import AdminHistorial from "../pages/admin/AdminHistorial";
import { AdminEquipo } from "../pages/admin/AdminEquipo";
import { Contacto } from '../pages/Contacto';
import { ReservarTurno } from '../pages/client/ReservarTurno';
import { AdminCreateBarber } from '../pages/admin/AdminCreateBarber';
import { AdminEditBarber } from '../pages/admin/AdminEditBarber';
import { AdminAgendaGlobal } from '../pages/admin/AdminAgendaGlobal';
import { Recuperar } from '../pages/auth/Recuperar';
import { CajaDashboard } from '../pages/CajaDashboard';
import { AdminConfiguracion } from '../pages/admin/AdminConfiguracion';


interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const { isAuth, usuario, isChecking } = useAuthStore();

    if (isChecking) return <div className="min-h-screen bg-[#0a0a0a]" />;
    // 1. Si no está autenticado, al login.
    if (!isAuth) return <Navigate to="/login" replace />;

    // 2. Si el rol no está permitido, lo mandamos a "su casa"
    if (usuario && !allowedRoles.includes(usuario.role)) {
        return <Navigate to={getHomeRoute(usuario.role)} replace />;
    }

    return <>{children}</>;
};

const getHomeRoute = (role?: string) => {
    switch (role) {
        case 'ADMIN': return '/admin/dashboard';
        case 'BARBER': return '/barber/agenda';
        case 'CLIENT': return '/';
        default: return '/login';
    }
};

export default function AppRouter() {
    const { isAuth, usuario, isChecking } = useAuthStore();
    if (isChecking) return <div className="bg-[#0a0a0a] min-h-screen" />;
    return (

        <Routes>
            {/* --- RUTAS PÚBLICAS --- */}
            <Route path="/" element={<Landing />} />
            <Route path='/contacto' element={<Contacto />} />
            <Route path="/barberos/:id" element={<BarberProfile />} />
            <Route path='/auth/recuperar' element={<Recuperar />} />
            <Route path="/login" element={!isAuth ? <Login /> : <Navigate to={getHomeRoute(usuario?.role)} replace />} />
            <Route path="/register" element={!isAuth ? <Register /> : <Navigate to={getHomeRoute(usuario?.role)} replace />} />

            {/* --- RUTAS CLIENTE --- */}
            <Route path="/turnos" element={
                <ProtectedRoute allowedRoles={['CLIENT']}>
                    <ClientDashboard />
                </ProtectedRoute>
            } />
            <Route path="/reservar" element={
                <ProtectedRoute allowedRoles={['CLIENT', 'ADMIN', 'BARBER']}>
                    <ReservarTurno />
                </ProtectedRoute>
            } />

            {/* --- RUTAS BARBERO (Anidadas) --- */}
            <Route path="/barber" element={
                <ProtectedRoute allowedRoles={['BARBER']}>
                    <BarberLayout />
                </ProtectedRoute>
            }>
                <Route index element={<Navigate to="agenda" replace />} />
                <Route path="agenda" element={<BarberAgenda />} />
                <Route path="caja" element={<BarberCaja />} />
                <Route path="historial" element={<BarberHistory />} />
                <Route path="perfil" element={<BarberSettings />} />
                <Route path="mi-caja" element={<CajaDashboard role="BARBER" />} />
            </Route>

            {/* --- RUTAS ADMIN (Anidadas) --- */}
            <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminLayout />
                </ProtectedRoute>
            }>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="agenda" element={<AdminAgendaGlobal />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="servicios" element={<AdminServicios />} />
                <Route path="historial" element={<AdminHistorial />} />
                <Route path="equipo" element={<AdminEquipo />} />
                <Route path="equipo/nuevo" element={<AdminCreateBarber />} />
                <Route path="equipo/editar/:id" element={<AdminEditBarber />} />
                <Route path="configuracion" element={<AdminConfiguracion />} />
                <Route path="finanzas" element={<CajaDashboard role="ADMIN" />} />
            </Route>

            {/* --- 404 FALLBACK --- */}
            <Route path="*" element={<Navigate to={isAuth ? getHomeRoute(usuario?.role) : "/"} replace />} />

        </Routes>
    );
}