import { type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import AdminLayout  from "../layout/AdminLayout"; 
import { BarberLayout } from "../layout/BarberLayout"; 
import Login from "../pages/Login";
import Register from '../pages/Register';
import Landing from '../pages/Landing';
import BarberProfile from "../pages/barber/BarberProfile"; 
import ClientDashboard from "../pages/ClientDashboard"; 
import BarberAgenda from "../pages/barber/BarberAgenda";
import BarberHistory from "../pages/barber/BarberHistory"; 
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminServicios from "../pages/admin/AdminServicios";
import {AdminCreateBarber} from "../pages/admin/AdminCreateBarber";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuth, user } = useAuthStore();

  // 1. Si no está autenticado -> Login
  if (!isAuth) return <Navigate to="/login" replace />;

  // 2. Si el rol no está permitido -> Redirigir a su "Home" correspondiente
  if (user && !allowedRoles.includes(user.role)) {
    if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'BARBER') return <Navigate to="/barber/agenda" replace />;
    return <Navigate to="/turnos" replace />; // Cliente
  }

  return <>{children}</>;
};

// Función auxiliar para redirigir si ya está logueado
const getHomeRoute = (role?: string) => {
  switch (role) {
    case 'ADMIN': return '/admin/dashboard';
    case 'BARBER': return '/barber/agenda';
    default: return '/turnos';
  }
};

export default function AppRouter() {
    const { isAuth, user } = useAuthStore();

    return (
        <BrowserRouter>
            <Routes>
                
                {/* =========================================
                    1. RUTAS PÚBLICAS (Cualquiera entra)
                   ========================================= */}
                <Route path="/" element={<Landing />} />
                
                <Route path="/login" element={
                    !isAuth ? <Login /> : <Navigate to={getHomeRoute(user?.role)} />
                } />
                
                <Route path="/register" element={
                    !isAuth ? <Register /> : <Navigate to={getHomeRoute(user?.role)} />
                } />

                {/* Perfil público del barbero (para que el cliente reserve) */}
                <Route path="/barberos/:id" element={<BarberProfile />} />


                {/* =========================================
                    2. RUTAS DE CLIENTE (Solo Clientes)
                   ========================================= */}
                <Route path="/turnos" element={
                    <ProtectedRoute allowedRoles={['CLIENT']}>
                         {/* Si tienes un MainLayout, envuélvelo aquí */}
                        <ClientDashboard />
                    </ProtectedRoute>
                } />


                {/* =========================================
                    3. RUTAS DE BARBERO (Solo Empleados)
                   ========================================= */}
                <Route path="/barber" element={
                    <ProtectedRoute allowedRoles={['BARBER']}>
                        <BarberLayout />
                    </ProtectedRoute>
                }>
                    <Route index element={<Navigate to="agenda" replace />} />
                    <Route path="agenda" element={<BarberAgenda />} />
                    <Route path="historial" element={<BarberHistory />} />
                </Route>


                {/* =========================================
                    4. RUTAS DE ADMIN (Dueño / Superusuario)
                   ========================================= */}
                <Route path="/admin" element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                        <AdminLayout />
                    </ProtectedRoute>
                }>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="servicios" element={<AdminServicios />} />
                    <Route path="crear-barbero" element={<AdminCreateBarber />} />
                    {/* <Route path="metricas" element={<AdminMetricas />} /> */}
                </Route>


                {/* =========================================
                    5. RUTAS "CATCH-ALL" (404)
                   ========================================= */}
                <Route path="*" element={
                    !isAuth 
                        ? <Navigate to="/login" /> 
                        : <Navigate to={getHomeRoute(user?.role)} />
                } />

            </Routes>
        </BrowserRouter>
    );
}