import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, FileText, CreditCard, Clock, AlertTriangle, ShieldCheck, Trash2, Download, X, UploadCloud, Plane } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LiquidGlassCard } from '../components/LiquidGlassCard';
import { PremiumButton } from '../components/PremiumButton';
import { ProUpgradeModal } from '../components/ProUpgradeModal';
import { useStore } from '../../store/useStore';
import { fetchUserDocuments, uploadDocument, deleteDocument, UserDocument } from '../../lib/vaultApi';

export function VaultScreen() {
  const navigate = useNavigate();
  const user = useStore(state => state.user);
  const isPro = user?.accountTier === 'pro' || user?.accountTier === 'premium';

  const [documents, setDocuments] = useState<UserDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpgrade, setShowUpgrade] = useState(false);
  
  // Add Document State
  const [showAddForm, setShowAddForm] = useState(false);
  const [docType, setDocType] = useState('passport');
  const [country, setCountry] = useState('');
  const [docNumber, setDocNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadDocs();
  }, []);

  const loadDocs = async () => {
    setLoading(true);
    const docs = await fetchUserDocuments();
    setDocuments(docs);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const success = await deleteDocument(id);
    if (success) {
      setDocuments(docs => docs.filter(d => d.id !== id));
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPro && documents.length >= 1) {
      setShowUpgrade(true);
      return;
    }
    setIsUploading(true);
    const doc = await uploadDocument(file, docType, country, docNumber, expiryDate);
    if (doc) {
      setDocuments([doc, ...documents]);
      setShowAddForm(false);
      // Reset form
      setDocType('passport');
      setCountry('');
      setDocNumber('');
      setExpiryDate('');
      setFile(null);
    }
    setIsUploading(false);
  };

  const getExpiryStatus = (expiryStr?: string) => {
    if (!expiryStr) return null;
    const expiry = new Date(expiryStr);
    const now = new Date();
    const diffMonths = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30);
    
    if (diffMonths <= 0) return { label: 'Expired', color: '#FF6B6B', icon: AlertTriangle };
    if (diffMonths <= 6) return { label: 'Expires Soon (< 6m)', color: '#F39C12', icon: Clock };
    return { label: 'Valid', color: '#00A854', icon: ShieldCheck };
  };

  const getDocIcon = (type: string) => {
    switch (type) {
      case 'passport': return <Plane size={20} className="text-[#0047AB]" />;
      case 'visa': return <FileText size={20} className="text-[#8E44AD]" />;
      default: return <CreditCard size={20} className="text-[#00A854]" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-28">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#001F3F] to-[#0047AB] pt-14 pb-8 px-5 rounded-b-[40px] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-[#00F5FF]/10 rounded-full blur-3xl mix-blend-screen" />
          <div className="absolute bottom-[-10%] left-[-10%] w-48 h-48 bg-[#00A854]/20 rounded-full blur-3xl mix-blend-screen" />
        </div>
        
        <div className="relative z-10">
          <button 
            onClick={() => navigate(-1)} 
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white mb-6 backdrop-blur-md"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck size={16} className="text-[#00F5FF]" />
                <span className="text-[#00F5FF] text-xs font-bold uppercase tracking-widest">Encrypted</span>
              </div>
              <h1 className="text-3xl font-black text-white">Smart Vault</h1>
              <p className="text-white/70 text-sm mt-1 font-medium">Auto-sync & expiry alerts for your travel docs.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 -mt-6 relative z-20 space-y-4">
        {/* Alerts Section (if passports expiring) */}
        {!loading && documents.some(d => d.document_type === 'passport' && getExpiryStatus(d.expiry_date)?.label !== 'Valid') && (
          <LiquidGlassCard className="border-[#FF6B6B]/40 bg-gradient-to-r from-[#FF6B6B]/10 to-transparent">
            <div className="flex gap-3 items-start">
              <AlertTriangle size={20} className="text-[#FF6B6B] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-black text-[#001F3F] text-sm">Passport Expiring Soon!</h3>
                <p className="text-xs text-[#001F3F]/60 font-medium mt-1 leading-relaxed">
                  Most countries require at least 6 months of passport validity. Renew your passport to avoid denied boarding.
                </p>
              </div>
            </div>
          </LiquidGlassCard>
        )}

        {/* Add Document CTA */}
        {!showAddForm && (
          <button 
            onClick={() => {
              if (!isPro && documents.length >= 1) {
                setShowUpgrade(true);
              } else {
                setShowAddForm(true);
              }
            }}
            className="w-full py-4 rounded-2xl border-2 border-dashed border-[#0047AB]/20 bg-white/50 flex flex-col items-center justify-center gap-2 hover:bg-white/80 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-[#0047AB]/10 flex items-center justify-center">
              <Plus size={20} className="text-[#0047AB]" />
            </div>
            <span className="text-sm font-black text-[#0047AB]">Add New Document</span>
            {!isPro && <span className="text-[10px] font-bold text-[#001F3F]/40 uppercase">Free: 1 doc limit</span>}
          </button>
        )}

        {/* Add Form */}
        {showAddForm && (
          <LiquidGlassCard className="border-[#0047AB]/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-[#001F3F] text-base">New Document</h3>
              <button onClick={() => setShowAddForm(false)} className="text-[#001F3F]/40 hover:text-[#001F3F]"><X size={18} /></button>
            </div>
            
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-[#001F3F] uppercase mb-1">Document Type</label>
                <select 
                  value={docType} 
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full bg-[#F5F7FA] border-none rounded-xl px-4 py-3 text-sm font-bold text-[#001F3F] focus:ring-2 focus:ring-[#0047AB]/20 outline-none"
                >
                  <option value="passport">Passport</option>
                  <option value="visa">Visa</option>
                  <option value="id_card">ID Card / Driver's License</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-[#001F3F] uppercase mb-1">Issuing Country</label>
                  <input 
                    type="text" 
                    placeholder="e.g. India"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                    className="w-full bg-[#F5F7FA] border-none rounded-xl px-4 py-3 text-sm font-bold text-[#001F3F] focus:ring-2 focus:ring-[#0047AB]/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-[#001F3F] uppercase mb-1">Doc Number</label>
                  <input 
                    type="text" 
                    placeholder="e.g. T1234567"
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                    className="w-full bg-[#F5F7FA] border-none rounded-xl px-4 py-3 text-sm font-bold text-[#001F3F] focus:ring-2 focus:ring-[#0047AB]/20 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-[#001F3F] uppercase mb-1">Expiry Date</label>
                <input 
                  type="date" 
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  required
                  className="w-full bg-[#F5F7FA] border-none rounded-xl px-4 py-3 text-sm font-bold text-[#001F3F] focus:ring-2 focus:ring-[#0047AB]/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#001F3F] uppercase mb-1">Upload File (Optional)</label>
                <div className="relative w-full h-14 bg-[#F5F7FA] rounded-xl flex items-center justify-center border-2 border-dashed border-[#001F3F]/10 hover:border-[#0047AB]/30 transition-colors">
                  <input 
                    type="file" 
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex items-center gap-2 text-[#001F3F]/50">
                    <UploadCloud size={18} />
                    <span className="text-sm font-bold">{file ? file.name : 'Tap to select file'}</span>
                  </div>
                </div>
              </div>

              <PremiumButton variant="primary" type="submit" className="w-full" disabled={isUploading}>
                {isUploading ? 'Encrypting & Saving...' : 'Save Document'}
              </PremiumButton>
            </form>
          </LiquidGlassCard>
        )}

        {/* Document List */}
        <div className="space-y-3">
          <h2 className="text-sm font-black text-[#001F3F] uppercase tracking-widest pl-1 mt-6">Your Documents</h2>
          
          {loading ? (
            <div className="h-24 rounded-2xl bg-white/50 animate-pulse" />
          ) : documents.length === 0 ? (
            <div className="w-full p-6 rounded-2xl bg-white/30 border border-dashed border-[#001F3F]/20 text-center">
              <span className="text-xs font-bold text-[#001F3F]/50">Your vault is empty.</span>
            </div>
          ) : (
            documents.map(doc => {
              const status = getExpiryStatus(doc.expiry_date);
              return (
                <LiquidGlassCard key={doc.id} hoverable>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm flex-shrink-0 border border-[#001F3F]/5">
                      {getDocIcon(doc.document_type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <div className="font-black text-[#001F3F] text-base capitalize">{doc.country} {doc.document_type}</div>
                        {status && (
                          <div className="flex items-center gap-1">
                            <status.icon size={12} style={{ color: status.color }} />
                            <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: status.color }}>
                              {status.label}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="text-sm font-mono font-medium text-[#0047AB] tracking-wider mb-1">
                        {doc.document_number ? doc.document_number.replace(/(.{4})/g, '$1 ').trim() : 'No Number'}
                      </div>
                      
                      <div className="text-xs text-[#001F3F]/50 font-bold">
                        Exp: {doc.expiry_date ? new Date(doc.expiry_date).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-[#001F3F]/5 flex justify-end gap-3">
                    {doc.file_url && (
                      <button onClick={() => window.open(doc.file_url, '_blank')} className="flex items-center gap-1.5 text-xs font-black text-[#0047AB] hover:underline">
                        <Download size={14} /> View File
                      </button>
                    )}
                    <button onClick={() => handleDelete(doc.id)} className="flex items-center gap-1.5 text-xs font-black text-[#FF6B6B] hover:underline">
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </LiquidGlassCard>
              );
            })
          )}
        </div>
      </div>
      {showUpgrade && <ProUpgradeModal onClose={() => setShowUpgrade(false)} trigger="Vault" />}
    </div>
  );
}
