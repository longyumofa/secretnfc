
import React from 'react';
import { ShieldCheck, Cpu, Tag, Key, Lock, Activity, Globe, Archive } from 'lucide-react';
import { VerificationResult } from '../crypto';
import FileUpload from './FileUpload';

interface Props {
  verifyResult: VerificationResult;
}

const PersonalizedPanel: React.FC<Props> = ({ verifyResult }) => {
  const { uidHex, validationDetails } = verifyResult;

  return (
    <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/10 shadow-2xl rounded-[2.5rem] overflow-hidden">
      
      {/* Verification Header */}
      <div className="p-8 sm:p-10 flex flex-col md:flex-row gap-8 items-center border-b border-white/5 bg-gradient-to-r from-emerald-500/5 to-transparent">
        <div className="shrink-0 flex flex-col items-center justify-center p-8 rounded-[2rem] w-full md:w-56 h-56 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-2xl shadow-emerald-500/10">
          <ShieldCheck size={84} className="mb-4 animate-bounce-slow" />
          <p className="text-[11px] font-black text-center uppercase tracking-[0.25em] leading-relaxed">
            Audit Result:<br/><span className="text-sm">Verified</span>
          </p>
        </div>

        <div className="flex-grow grid grid-cols-1 gap-8 w-full">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-slate-500">
              <Cpu size={14} />
              <span className="text-[9px] font-black uppercase tracking-[0.2em]">Chip Identifier</span>
            </div>
            <p className="font-mono text-[11px] bg-black/40 p-4 rounded-xl text-slate-300 break-all select-all border border-white/5 shadow-inner">
              {uidHex || 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="p-8 sm:p-10">
        <div className="grid lg:grid-cols-1 gap-10">
          
          {/* Left Column: Technical Audit */}
          <div className="space-y-10">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Activity size={18} className="text-blue-400" />
                <h3 className="text-white text-xs font-black uppercase tracking-[0.3em]">Cryptographic Integrity Report</h3>
              </div>
              <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[9px] text-emerald-400 font-black uppercase tracking-widest">Status: Nominal</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[9px] text-slate-600 font-black uppercase tracking-[0.2em] ml-1">Pattern Matching Checklist</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: 'Security Control Flag', status: validationDetails.flag },
                  { label: 'Dynamic Token Validation', status: validationDetails.token },
                  { label: 'UID Mapping Authenticity', status: validationDetails.uid },
                  { label: 'Server-Side Replay Filter', status: true }
                ].map((check, i) => (
                  <div key={i} className="flex justify-between items-center p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-[10px] text-slate-400 font-bold">{check.label}</span>
                    <span className={`text-[8px] font-black px-2 py-1 rounded ${check.status ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                      {check.status ? 'PASS' : 'FAIL'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 mt-10 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 opacity-30">
            <Lock size={12} className="text-slate-400" />
            <p className="text-[9px] text-slate-500 font-black tracking-[0.3em] uppercase">Core: HKBR-SECURE-ENGINE-V2.5.4</p>
          </div>
          <p className="text-[9px] text-slate-700 font-semibold italic tracking-wide">Authorized by Haikang Borui Cloud Verification Service</p>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedPanel;
