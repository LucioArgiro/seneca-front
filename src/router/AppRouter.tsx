import { type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminServicios from "../pages/admin/AdminServicios";
/* import AdminAgenda from "../pages/admin/AdminAgenda"; */
import AdminHistorial from "../pages/admin/AdminHistorial";
import { AdminEquipo } from "../pages/admin/AdminEquipo";
import Contacto from '../pages/Contacto';
import AdminMensajes from '../pages/admin/AdminMensajes';
import { ReservarTurno } from '../pages/client/ReservarTurno';
import { AdminCreateBarber } from '../pages/admin/AdminCreateBarber';
import { AdminEditBarber } from '../pages/admin/AdminEditBarber';
import { AdminAgendaGlobal } from '../pages/admin/AdminAgendaGlobal';

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const { isAuth, usuario } = useAuthStore();

    if (!isAuth) return <Navigate to="/login" replace />;

    if (usuario && !allowedRoles.includes(usuario.role)) {
        if (usuario.role === 'ADMIN') return <Navigate to="/admin/agenda" replace />; // Cambiado a agenda
        if (usuario.role === 'BARBER') return <Navigate to="/barber/agenda" replace />;
        return <Navigate to="/turnos" replace />;
    }

    return <>{children}</>;
};

const getHomeRoute = (role?: string) => {
    switch (role) {
        case 'ADMIN': return '/admin/agenda'; // Cambiado a agenda
        case 'BARBER': return '/barber/agenda';
        default: return '/turnos';
    }
};

export default function AppRouter() {
    const { isAuth, usuario } = useAuthStore();

    return (
        <BrowserRouter>
            <Routes>
                {/* RUTAS PÚBLICAS */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={!isAuth ? <Login /> : <Navigate to={getHomeRoute(usuario?.role)} />} />
                <Route path="/register" element={!isAuth ? <Register /> : <Navigate to={getHomeRoute(usuario?.role)} />} />
                <Route path="/barberos/:id" element={<BarberProfile />} />
                <Route path='/contacto' element={<Contacto />} />

                {/* RUTAS CLIENTE */}
                <Route path="/turnos" element={
                    <ProtectedRoute allowedRoles={['CLIENT']}>
                        <ClientDashboard />
                    </ProtectedRoute>

                } />
                <Route path="/reservar" element={<ReservarTurno />} />


                {/* RUTAS BARBERO */}
                <Route path="/barber" element={
                    <ProtectedRoute allowedRoles={['BARBER']}>
                        <BarberLayout />
                    </ProtectedRoute>
                }>
                    <Route index element={<Navigate to="agenda" replace />} />
                    <Route path="agenda" element={<BarberAgenda />} />
                    <Route path="historial" element={<BarberHistory />} />
                    <Route path="perfil" element={<BarberSettings />} />
                    <Route path='mensajes' element={<AdminMensajes />} />
                </Route>

                {/* RUTAS ADMIN */}
                <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']}> <AdminLayout /></ProtectedRoute>}>
                    <Route index element={<Navigate to="agenda" replace />} />
                    {/* <Route path="agenda" element={<AdminAgenda />} /> */}
                    <Route path="historial" element={<AdminHistorial />} />
                    <Route path="equipo" element={<AdminEquipo />} />
                    <Route path="/admin/equipo/nuevo" element={<AdminCreateBarber />} />
                    <Route path="/admin/equipo/editar/:id" element={<AdminEditBarber />} />
                    <Route path="/admin/agenda" element={<AdminAgendaGlobal />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="servicios" element={<AdminServicios />} />
                    <Route path='mensajes' element={<AdminMensajes />} />
                </Route>

                {/* 404 */}
                <Route path="*" element={
                    !isAuth
                        ? <Navigate to="/login" />
                        : <Navigate to={getHomeRoute(usuario?.role)} />
                } />

            </Routes>
        </BrowserRouter>
    );
}