import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { barberosApi } from '../../api/barberos';
import { User, Mail, Lock } from 'lucide-react';

export const AdminCreateBarber = () => {
  const [form, setForm] = useState({ fullname: '', email: '', password: '' });

  const mutation = useMutation({
    mutationFn: barberosApi.create,
    onSuccess: () => {
      alert('¡Barbero contratado exitosamente!');
      setForm({ fullname: '', email: '', password: '' }); // Limpiar form
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Error al crear barbero');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100 max-w-lg mx-auto">
      <h2 className="text-xl font-bold text-slate-900 mb-4">Contratar Nuevo Barbero</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
           <label className="text-sm font-bold text-slate-700">Nombre Completo</label>
           <div className="flex items-center gap-2 border rounded-lg p-3 bg-slate-50 mt-1">
             <User size={18} className="text-slate-400"/>
             <input 
               type="text" 
               className="bg-transparent outline-none w-full"
               value={form.fullname}
               onChange={e => setForm({...form, fullname: e.target.value})}
               required
             />
           </div>
        </div>

        <div>
           <label className="text-sm font-bold text-slate-700">Email Corporativo</label>
           <div className="flex items-center gap-2 border rounded-lg p-3 bg-slate-50 mt-1">
             <Mail size={18} className="text-slate-400"/>
             <input 
               type="email" 
               className="bg-transparent outline-none w-full"
               value={form.email}
               onChange={e => setForm({...form, email: e.target.value})}
               required
             />
           </div>
        </div>

        <div>
           <label className="text-sm font-bold text-slate-700">Contraseña Inicial</label>
           <div className="flex items-center gap-2 border rounded-lg p-3 bg-slate-50 mt-1">
             <Lock size={18} className="text-slate-400"/>
             <input 
               type="password" 
               className="bg-transparent outline-none w-full"
               value={form.password}
               onChange={e => setForm({...form, password: e.target.value})}
               required
             />
           </div>
        </div>

        <button 
          type="submit" 
          disabled={mutation.isPending}
          className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition"
        >
          {mutation.isPending ? 'Creando...' : 'Dar de Alta Barbero'}
        </button>
      </form>
    </div>
  );
};