import { type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import Login from "../pages/Login";
import ClientDashboard from "../pages/ClientDashboard";
import AdminLayout from "../layout/AdminLayout";
import AdminAgenda from "../pages/AdminAgenda";
import AdminHistorial from "../pages/AdminHistorial";
import Register from '../pages/Register';
import AdminServicios from "../pages/AdminServicios";
import Landing from '../pages/Landing';
const AdminGuard = ({ children }: { children: ReactNode }) => {
  const { isAuth, user } = useAuthStore();
  console.log("AdminGuard Check -> Auth:", isAuth, "Role:", user?.role);
  if (!isAuth) return <Navigate to="/login" replace />;
  if (user?.role !== 'BARBER') return <Navigate to="/turnos" replace />;
  return children;
};

export default function AppRouter() {
    const { isAuth, user } = useAuthStore();

    return (
        <BrowserRouter>
            <Routes>
                {/* LOGIN */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={
                    !isAuth ? <Login /> : <Navigate to={user?.role === 'BARBER' ? "/admin/agenda" : "/turnos"} />
                } />
                <Route path="/register" element={<Register />} />

                {/* RUTA CLIENTE (Protegida para que el Barbero no entre aquí) */}
                <Route path="/turnos" element={
                    !isAuth ? <Navigate to="/login" replace /> :
                    user?.role === 'BARBER' ? <Navigate to="/admin/agenda" replace /> : 
                    <ClientDashboard />
                } />

                {/* RUTAS ADMIN (Protegidas por AdminGuard) */}
                <Route path="/admin" element={
                    <AdminGuard><AdminLayout /></AdminGuard>
                }>
                    <Route index element={<Navigate to="agenda" replace />} />
                    <Route path="agenda" element={<AdminAgenda />} />
                    <Route path="historial" element={<AdminHistorial />} />
                    <Route path="servicios" element={<AdminServicios />} />
                </Route>
                <Route path="*" element={
                    !isAuth ? <Navigate to="/login" /> :
                    user?.role === 'BARBER' ? <Navigate to="/admin/agenda" /> :
                    <Navigate to="/turnos" />
                } />
            </Routes>
        </BrowserRouter>
    );
}