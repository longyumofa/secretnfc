
import React from 'react';
import { ShieldAlert, Cpu, Lock, AlertTriangle, History } from 'lucide-react';
import { VerificationResult } from '../crypto';

interface Props {
  verifyResult: VerificationResult | null;
}

const VerificationGuard: React.FC<Props> = ({ verifyResult }) => {
  const getErrorMessage = () => {
    if (!verifyResult) return "Protocol Violation: Null Data Stream";
    switch(verifyResult.errorCode) {
      case 'SIG_MISMATCH': return "Signature Conflict: Local Decryption Mismatch";
      case 'TOKEN_EXPIRED': return "Anti-Replay Fault: Token Previously Consumed for this UID";
      case 'SERVER_ERROR': return "Handshake Fault: Verification Server Unreachable";
      default: return "Validation Sequence Failed";
    }
  };

  const isReplay = verifyResult?.errorCode === 'TOKEN_EXPIRED';

  return (
    <div className="max-w-4xl w-full mx-auto animate-in zoom-in fade-in duration-500">
      <div className="bg-slate-900/60 backdrop-blur-3xl border border-red-500/20 shadow-2xl shadow-red-500/10 rounded-[2.5rem] p-10 text-center relative overflow-hidden">
        
        {/* Warning Glow */}
        <div className={`absolute top-0 left-0 w-full h-1 ${isReplay ? 'bg-orange-500' : 'bg-red-500'} animate-pulse`}></div>

        <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl border ${isReplay ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
          {isReplay ? <History size={56} className="animate-pulse" /> : <ShieldAlert size={56} />}
        </div>
        
        <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">Security Diagnostic Exception</h2>
        <p className={`text-lg font-bold mb-10 ${isReplay ? 'text-orange-400' : 'text-red-400'}`}>
            {getErrorMessage()}
        </p>

        <div className="bg-black/40 rounded-[2rem] p-8 text-left space-y-6 border border-white/5 shadow-inner">
           <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <Lock size={16} className="text-red-400/60" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cryptographic Audit Ledger</span>
              </div>
              <span className="text-[10px] font-mono text-red-500/80 uppercase tracking-widest font-black">REF: ERR-REPLAY-409</span>
           </div>

           {verifyResult && (
             <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-600 font-black uppercase tracking-[0.2em]">UID Reference</span>
                    <div className="bg-black/60 p-4 rounded-xl border border-white/5 font-mono text-[11px] text-slate-400 break-all truncate">
                      {verifyResult.uidHex}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-600 font-black uppercase tracking-[0.2em]">Reason for Rejection</span>
                    <p className="text-[11px] text-slate-500 leading-relaxed italic">
                      {isReplay 
                        ? "Server logs indicate this specific token has already been validated against this hardware UID. Access revoked to prevent replay attacks."
                        : "The provided signature does not correspond with the expected decryption output for this hardware identifier."
                      }
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <span className="text-[9px] text-slate-600 font-black uppercase tracking-[0.2em]">Integrity Checklist</span>
                  <div className="space-y-2">
                    {[
                      { label: 'Control Flag Alignment', status: verifyResult.validationDetails.flag },
                      { label: 'Token Symmetry Check', status: verifyResult.validationDetails.token },
                      { label: 'UID Mapping Precision', status: verifyResult.validationDetails.uid },
                      { label: 'Server-Side Sequence Sync', status: verifyResult.validationDetails.serverSync && !isReplay }
                    ].map((check, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] text-[11px]">
                        <span className="text-slate-500 font-bold">{check.label}</span>
                        <span className={`font-black tracking-widest text-[9px] px-2 py-0.5 rounded ${check.status ? 'text-emerald-500 bg-emerald-500/5' : 'text-red-500 bg-red-500/5'}`}>
                          {check.status ? 'PASS' : 'FAIL'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
             </div>
           )}

           <div className="pt-6 border-t border-white/5 flex flex-col items-center gap-3 opacity-40">
              <div className="flex items-center gap-2">
                 <Cpu size={14} className="text-slate-500" />
                 <p className="text-[9px] text-slate-600 font-black tracking-widest uppercase">Encryption Standard: ISO/IEC 29167-10</p>
              </div>
              <p className="text-[8px] text-slate-700 font-medium italic">Diagnostic audit finalized via remote security enclave.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationGuard;
