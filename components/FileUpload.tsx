
import React, { useState, useRef } from 'react';
import { Upload, File, CheckCircle2, AlertCircle, X, Loader2, Link as LinkIcon } from 'lucide-react';

const API_BASE_URL = 'http://localhost:3000';

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus('idle');
      setFileUrl(null);
    }
  };

  const onUpload = async () => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const result = await response.json();
      setFileUrl(result.data.url);
      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setStatus('idle');
    setFileUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Upload size={18} className="text-blue-400" />
          <h3 className="text-white text-xs font-black uppercase tracking-[0.3em]">Design Asset Repository</h3>
        </div>
      </div>

      <div 
        className={`relative border-2 border-dashed rounded-[2rem] p-10 transition-all duration-300 flex flex-col items-center justify-center group
          ${file ? 'border-blue-500/50 bg-blue-500/5' : 'border-white/10 hover:border-blue-500/30 bg-black/20'}
        `}
      >
        {!file ? (
          <div 
            className="text-center cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all">
              <Upload className="text-slate-500 group-hover:text-blue-400" />
            </div>
            <p className="text-slate-300 font-bold text-sm mb-1 uppercase tracking-tight">Drop technical asset here</p>
            <p className="text-slate-600 text-[10px] uppercase font-black tracking-widest">Supports PDF, PNG, JPG, CAD (Max 10MB)</p>
          </div>
        ) : (
          <div className="w-full flex items-center gap-4 bg-black/40 p-5 rounded-2xl border border-white/5">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
              <File className="text-blue-400" size={24} />
            </div>
            <div className="flex-grow min-w-0">
              <p className="text-white text-sm font-bold truncate">{file.name}</p>
              <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            {!uploading && status === 'idle' && (
              <button onClick={clearFile} className="p-2 hover:bg-white/5 rounded-full text-slate-500 transition-colors">
                <X size={18} />
              </button>
            )}
          </div>
        )}

        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
        />
      </div>

      {file && status === 'idle' && !uploading && (
        <button 
          onClick={onUpload}
          className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-blue-500/20 transform active:scale-95"
        >
          Initialize Server Upload
        </button>
      )}

      {uploading && (
        <div className="flex items-center justify-center gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
          <Loader2 className="text-blue-400 animate-spin" size={18} />
          <span className="text-blue-400 text-[10px] font-black uppercase tracking-widest">Encrypting and Transferring...</span>
        </div>
      )}

      {status === 'success' && fileUrl && (
        <div className="animate-in fade-in slide-in-from-top-2 space-y-4">
          <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
            <CheckCircle2 className="text-emerald-500" size={18} />
            <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">Transfer Complete • Asset Persistent</span>
          </div>
          <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
            <label className="text-[9px] text-slate-600 font-black uppercase tracking-[0.2em] block mb-2">Remote Access URL</label>
            <div className="flex items-center gap-2">
              <div className="bg-black/60 p-3 rounded-lg border border-white/5 flex-grow font-mono text-[10px] text-blue-400 break-all">
                {fileUrl}
              </div>
              <a 
                href={fileUrl} 
                target="_blank" 
                rel="noreferrer"
                className="p-3 bg-white/5 hover:bg-blue-500/20 rounded-lg text-slate-400 hover:text-blue-400 transition-all border border-white/5"
              >
                <LinkIcon size={16} />
              </a>
            </div>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl animate-shake">
          <AlertCircle className="text-red-500" size={18} />
          <span className="text-red-500 text-[10px] font-black uppercase tracking-widest">Encryption Handshake Failed • Retry</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
