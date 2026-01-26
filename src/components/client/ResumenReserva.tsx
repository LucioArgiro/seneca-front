import { User, Receipt, CheckCircle2, Loader2, Wallet, Banknote, Store, CreditCard } from 'lucide-react';

interface ResumenProps {
	serviceInfo: any;
	barberInfo: any;
	fechaResumen: string;
	hora: string;
	precios: {
		totalServicio: number;
		valorSenia: number;
		aPagarHoy: number;
		saldoPendiente: number;
		requierePago: boolean;
	};
	opcionPago: 'TOTAL' | 'SENIA' | 'LOCAL';
	setOpcionPago: (opt: 'TOTAL' | 'SENIA' | 'LOCAL') => void;
	isSubmitting: boolean;
	isReprogramming: boolean;
}

export const ResumenReserva = ({
	serviceInfo, barberInfo, fechaResumen, hora,
	precios, opcionPago, setOpcionPago, isSubmitting, isReprogramming
}: ResumenProps) => {

	return (
		<div className="sticky top-24 space-y-4">
			<div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">

				{/* ENCABEZADO NEGRO */}
				<div className="p-6 bg-slate-900 text-white">
					<h3 className="text-lg font-bold flex items-center gap-2"><Receipt size={18} className="text-slate-400" /> Resumen</h3>
					<p className="text-slate-400 text-xs mt-1">Revisa los detalles antes de confirmar.</p>
				</div>

				<div className="p-6 space-y-6">

					{/* INFO BARBERO */}
					<div className="flex items-center gap-4 pb-6 border-b border-slate-100">
						<div className="w-16 h-16 rounded-full border-2 border-white shadow-md overflow-hidden shrink-0 bg-slate-100 relative">
							{barberInfo?.fotoUrl ?
								<img src={barberInfo.fotoUrl} alt="Barbero" className="w-full h-full object-cover" /> :
								<div className="w-full h-full flex items-center justify-center text-slate-300"><User size={28} /></div>
							}
						</div>
						<div>
							<p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Profesional</p>
							<p className="font-bold text-slate-900 text-lg leading-tight">{barberInfo?.usuario.nombre || 'Seleccionar...'}</p>
						</div>
					</div>

					{/* DETALLES DE FECHA Y SERVICIO */}
					<div className="space-y-3">
						<div className="flex justify-between items-start">
							<span className="text-slate-400 text-xs font-bold uppercase mt-1">Servicio</span>
							<span className="text-right text-sm font-bold text-slate-800 w-2/3 leading-tight">{serviceInfo?.nombre || '--'}</span>
						</div>
						<div className="flex justify-between items-start">
							<span className="text-slate-400 text-xs font-bold uppercase mt-1">Fecha</span>
							<div className="text-right">
								<span className="block text-sm font-bold text-slate-800 capitalize">{fechaResumen}</span>
								{hora && <span className="inline-block mt-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-bold border border-blue-100">{hora} hs</span>}
							</div>
						</div>
					</div>

					{/* SECCIÓN DE PAGO (Lógica Modificada) */}
					<div>
						<span className="text-slate-400 text-xs font-bold uppercase block mb-3">¿Cómo prefieres pagar?</span>
						<div className="grid grid-cols-1 gap-3">

							{/* OPCIÓN 1: PAGO EN LOCAL (Siempre disponible si no hay seña obligatoria) */}
							{!precios.requierePago && (
								<button type="button" onClick={() => setOpcionPago('LOCAL')}
									className={`p-4 rounded-xl border-2 flex items-center justify-between transition-all group ${opcionPago === 'LOCAL' ? 'border-slate-800 bg-slate-50 ring-1 ring-slate-800' : 'border-slate-200 bg-white hover:border-slate-300'}`}
								>
									<div className="flex items-center gap-3">
										<div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${opcionPago === 'LOCAL' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-400'}`}>
											<Store size={20} />
										</div>
										<div className="text-left">
											<p className="font-bold text-slate-800 text-sm">Pago en el Local</p>
											<p className="text-xs text-slate-500">Pagas al terminar.</p>
										</div>
									</div>
									<span className="font-bold text-slate-400 text-xs uppercase tracking-wider">Gratis hoy</span>
								</button>
							)}

							{/* OPCIÓN 2: PAGAR TOTAL ONLINE (Siempre disponible) */}
							<button type="button" onClick={() => setOpcionPago('TOTAL')}
								className={`p-4 rounded-xl border-2 flex items-center justify-between transition-all group ${opcionPago === 'TOTAL' ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500' : 'border-slate-200 bg-white hover:border-blue-300'}`}
							>
								<div className="flex items-center gap-3">
									<div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${opcionPago === 'TOTAL' ? 'bg-blue-500 text-white' : 'bg-blue-50 text-blue-400'}`}>
										<CreditCard size={20} />
									</div>
									<div className="text-left">
										<p className="font-bold text-slate-800 text-sm">Pagar Total Online</p>
										<p className="text-xs text-slate-500">Adelantas el pago 100%.</p>
									</div>
								</div>
								<span className="font-black text-slate-900">${precios.totalServicio}</span>
							</button>

							{/* OPCIÓN 3: SOLO SEÑA (Solo si el barbero lo requiere Opcional) */}
							{/* Si REQUIERE pago, mostramos SEÑA como alternativa al total */}
							{precios.requierePago && (
								<button type="button" onClick={() => setOpcionPago('SENIA')}
									className={`p-4 rounded-xl border-2 flex items-center justify-between transition-all group ${opcionPago === 'SENIA' ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500' : 'border-slate-200 bg-white hover:border-blue-300'}`}
								>
									<div className="flex items-center gap-3">
										<div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${opcionPago === 'SENIA' ? 'bg-blue-500 text-white' : 'bg-blue-50 text-blue-400'}`}>
											<Wallet size={20} />
										</div>
										<div className="text-left">
											<p className="font-bold text-slate-800 text-sm">Solo Seña</p>
											<p className="text-xs text-slate-500">Congelas precio.</p>
										</div>
									</div>
									<span className="font-black text-slate-900">${precios.valorSenia}</span>
								</button>
							)}

						</div>
					</div>

					{/* TOTALES Y BOTÓN FINAL */}
					<div className="border-t border-slate-100 pt-4 space-y-2">

						{/* Aviso de Saldo Pendiente */}
						{(opcionPago === 'SENIA' || opcionPago === 'LOCAL') && precios.saldoPendiente > 0 && (
							<div className="bg-orange-50 text-orange-800 p-3 rounded-xl text-xs font-bold flex items-start gap-2 border border-orange-100 mb-2">
								<Banknote size={16} className="shrink-0 mt-0.5" />
								<span>Abonarás el resto (<span className="underline">${precios.saldoPendiente}</span>) en la barbería.</span>
							</div>
						)}

						<div className="flex justify-between items-end">
							<span className="text-slate-500 font-bold text-sm">
								{opcionPago === 'LOCAL' ? 'A pagar hoy' : 'A pagar con MP'}
							</span>
							<span className="text-3xl font-black text-blue-600 tracking-tight">
								${precios.aPagarHoy}
							</span>
						</div>
					</div>

					<button
						type="submit"
						disabled={isSubmitting || !hora}
						className={`w-full py-4 px-6 rounded-2xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-3 hover:translate-y-[-2px] disabled:opacity-50 disabled:cursor-not-allowed 
                        ${isReprogramming ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/20'
								: (opcionPago === 'LOCAL' ? 'bg-slate-900 hover:bg-slate-800 shadow-slate-900/20' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20')}`}
					>
						{isSubmitting ? <Loader2 className="animate-spin" /> : (opcionPago === 'LOCAL' ? <CheckCircle2 size={20} /> : <Wallet size={20} />)}

						{isReprogramming
							? 'Confirmar Cambio'
							: (opcionPago === 'LOCAL' ? 'Confirmar Reserva' : 'Ir a Pagar')
						}
					</button>

					<div className="text-center">
						<p className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
							{opcionPago === 'LOCAL'
								? 'Reserva inmediata sin pagos online.'
								: <><CheckCircle2 size={10} /> Redirección segura a Mercado Pago.</>
							}
						</p>
					</div>

				</div>
			</div>
		</div>
	);
};