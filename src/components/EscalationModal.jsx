import React from 'react';
import { 
  X, 
  Flame, 
  ArrowRight, 
  TrendingUp, 
  AlertTriangle, 
  ShieldAlert, 
  Truck, 
  Ambulance, 
  CheckCircle2, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

export function EscalationModal({
  isOpen,
  onClose,
  isEscalated,
  onResetSimulation
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-3xl rounded-2xl glass-modal p-5 sm:p-7 border border-red-500/40 text-slate-100 shadow-[0_0_50px_rgba(239,68,68,0.25)] my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-600 to-orange-600 flex items-center justify-center text-white shadow-xl shadow-red-600/40 animate-pulse">
            <Flame className="w-6 h-6 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">
                Disaster Escalation Analysis
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 text-[10px] font-black border border-red-500/50">
                CRITICAL THRESHOLD BREACHED
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Zone C (Indiranagar Basin) escalated — AI dynamically recalculates multi-factor priorities and reallocates fleet
            </p>
          </div>
        </div>

        {/* Compound Simulation Events Anomaly Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
          <div className="p-3 rounded-xl bg-slate-900/90 border border-red-500/30 text-center">
            <div className="text-xs text-slate-400">🌧️ Rainfall Rate</div>
            <div className="text-base font-black text-red-400 mt-0.5">+35% Surge</div>
            <div className="text-[10px] text-slate-500">Torrential Cloudburst</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/90 border border-red-500/30 text-center">
            <div className="text-xs text-slate-400">🌊 Water Level</div>
            <div className="text-base font-black text-red-400 mt-0.5">+20% Rise</div>
            <div className="text-[10px] text-slate-500">4.5ft on 100ft Arterial</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/90 border border-red-500/30 text-center">
            <div className="text-xs text-slate-400">🚧 Roads Ingress</div>
            <div className="text-base font-black text-red-400 mt-0.5">+1 Submerged</div>
            <div className="text-[10px] text-slate-500">5 of 6 Arterials Impassable</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/90 border border-red-500/30 text-center">
            <div className="text-xs text-slate-400">👥 Trapped Population</div>
            <div className="text-base font-black text-red-400 mt-0.5">9,700 People</div>
            <div className="text-[10px] text-slate-500">Hospital Cut Off</div>
          </div>
        </div>

        {/* BEFORE VS AFTER DYNAMIC COMPARISON */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          
          {/* BEFORE CARD */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-white/10 relative">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2 block">
              BEFORE ESCALATION (PRE-SURGE)
            </span>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base font-bold text-slate-200">Zone C — Indiranagar</h3>
                <span className="text-xs text-slate-400">High Risk Baseline</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-amber-400">82</span>
                <span className="text-xs text-amber-300/80 block font-semibold">HIGH</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-white/5 space-y-1 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Priority Rank:</span>
                <strong className="text-slate-200 font-mono">#2 Priority</strong>
              </div>
              <div className="flex justify-between">
                <span>Assigned Units:</span>
                <span className="text-slate-300">NDRF Squad #2</span>
              </div>
              <div className="flex justify-between">
                <span>Hospital Access:</span>
                <span className="text-amber-400">Partial Access</span>
              </div>
            </div>
          </div>

          {/* AFTER CARD */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-red-950/60 via-slate-900 to-rose-950/40 border border-red-500/50 relative shadow-lg shadow-red-950/50">
            <span className="text-[10px] font-black uppercase tracking-wider text-red-400 mb-2 block flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-red-400" />
              AFTER ESCALATION (RECALCULATED)
            </span>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base font-bold text-white">Zone C — Indiranagar</h3>
                <span className="text-xs text-red-400 font-bold">● Critical Lifeline Threat</span>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-red-500 animate-pulse">94</span>
                <span className="text-xs text-red-400 block font-black">CRITICAL</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-500/30 space-y-1 text-xs text-slate-300">
              <div className="flex justify-between font-bold">
                <span className="text-white">Priority Rank:</span>
                <span className="text-red-400 font-mono text-sm">#1 PRIORITY 🚨</span>
              </div>
              <div className="flex justify-between">
                <span>Automatic Fleet Surge:</span>
                <span className="text-cyan-300 font-semibold">Ambulance #1 + NDRF #2 + Earthmover #1</span>
              </div>
              <div className="flex justify-between">
                <span>Hospital Transit Ingress:</span>
                <span className="text-emerald-400">Rerouted via AI Clear Bypass (11m)</span>
              </div>
            </div>
          </div>

        </div>

        {/* Why this change happened? */}
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 mb-5 text-xs text-slate-300 space-y-1.5">
          <div className="font-bold text-cyan-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>AI Automated Reallocation Rationale</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Because City General Hospital is completely cut off and population exposure surged to 9,700, the ResQuick Multi-Factor Priority Engine automatically bumped Zone C from <strong>#2 to #1</strong>. 
            <strong> Ambulance #1</strong> and <strong>Earthmover #1</strong> were dynamically re-routed from standby to Zone C to clear debris and evacuate ICU patients.
          </p>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => {
              onResetSimulation();
              onClose();
            }}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-white/10 transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Simulation to Baseline</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition shadow-md shadow-cyan-600/30"
          >
            Acknowledge & Monitor Live Grid
          </button>
        </div>

      </div>
    </div>
  );
}
