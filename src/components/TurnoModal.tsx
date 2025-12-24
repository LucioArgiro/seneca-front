// src/components/TurnoModal.tsx
import { useEffect, useState } from "react";
import Modal from "./Modal";
import { useAuthStore } from "../store/auth";
import { createTurno } from "../api/turnos";
import {getClientes, getBarberos, getServicios, type Cliente, type Barbero, type Servicio,
} from "../api/catalogos";

interface TurnoModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function TurnoModal({ open, onClose, onCreated }: TurnoModalProps) {
  const token = useAuthStore((s) => s.token)!;

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [barberos, setBarberos] = useState<Barbero[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);

  const hoyLocal = new Date();
  hoyLocal.setMinutes(hoyLocal.getMinutes() - hoyLocal.getTimezoneOffset());
  const hoy = hoyLocal.toISOString().split("T")[0];

  const [form, setForm] = useState({
    fecha: hoy,
    horaInicio: "",
    horaFin: "",
    clienteId: "",
    barberoId: "",
    servicioId: "",
  });

  const [loading, setLoading] = useState(false);
  const [loadingCatalogos, setLoadingCatalogos] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar catálogos cuando se abre el modal
  useEffect(() => {
    if (!open) return;

    setLoadingCatalogos(true);
    setError(null);

    Promise.all([getClientes(token), getBarberos(token), getServicios(token)])
      .then(([c, b, s]) => {
        setClientes(c);
        setBarberos(b);
        setServicios(s);
      })
      .catch(() => setError("Error al cargar datos"))
      .finally(() => setLoadingCatalogos(false));
  }, [open, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { fecha, horaInicio, horaFin, clienteId, barberoId, servicioId } = form;

    if (!fecha || !horaInicio || !horaFin || !clienteId || !barberoId || !servicioId) {
      setError("Completa todos los campos.");
      return;
    }

    const payload = {
      fecha,
      horaInicio,
      horaFin,
      cliente: { id: clienteId },
      barbero: { id: barberoId },
      servicio: { id: servicioId },
    };

    setLoading(true);

    try {
      await createTurno(payload, token);

      onCreated();
      onClose();

      // Reset horario
      setForm((prev) => ({
        ...prev,
        horaInicio: "",
        horaFin: "",
      }));
    } catch (err: any) {
      setError(err.message || "Error al crear turno");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Nuevo turno">
      {loadingCatalogos ? (
        <p>Cargando datos...</p>
      ) : (
        <form className="space-y-3" onSubmit={handleSubmit}>
          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="grid grid-cols-2 gap-3">
            {/* Fecha */}
            <div>
              <label className="block text-sm mb-1">Fecha</label>
              <input
                type="date"
                name="fecha"
                value={form.fecha}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
              />
            </div>

            {/* Inicio */}
            <div>
              <label className="block text-sm mb-1">Hora inicio</label>
              <input
                type="time"
                name="horaInicio"
                value={form.horaInicio}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
              />
            </div>

            {/* Fin */}
            <div>
              <label className="block text-sm mb-1">Hora fin</label>
              <input
                type="time"
                name="horaFin"
                value={form.horaFin}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
              />
            </div>
          </div>

          {/* Cliente */}
          <div>
            <label className="block text-sm mb-1">Cliente</label>
            <select
              name="clienteId"
              value={form.clienteId}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
            >
              <option value="">Selecciona un cliente</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre} {c.apellido}
                </option>
              ))}
            </select>
          </div>

          {/* Barbero */}
          <div>
            <label className="block text-sm mb-1">Barbero</label>
            <select
              name="barberoId"
              value={form.barberoId}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
            >
              <option value="">Selecciona un barbero</option>
              {barberos.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Servicio */}
          <div>
            <label className="block text-sm mb-1">Servicio</label>
            <select
              name="servicioId"
              value={form.servicioId}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
            >
              <option value="">Selecciona un servicio</option>
              {servicios.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3 py-1 border rounded">
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-3 py-1 rounded bg-black text-white disabled:opacity-50"
            >
              {loading ? "Guardando..." : "Guardar turno"}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
