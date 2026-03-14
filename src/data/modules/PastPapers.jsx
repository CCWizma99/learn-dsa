import { useState, useEffect } from 'react';
import { Section, P, Callout, BulletList } from '../../components/modules/ModuleComponents';
import ModuleFooter from '../../components/modules/ModuleFooter';
import { Upload, Trash2, FileText, AlertCircle, HardDrive, CheckCircle2 } from 'lucide-react';

const API_BASE = 'http://localhost:5001/api';

export default function PastPapers() {
  const [papers, setPapers] = useState([]);
  const [totalSize, setTotalSize] = useState(0);
  const [maxSize, setMaxSize] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPapers();
  }, []);

  const fetchPapers = async () => {
    try {
      const res = await fetch(`${API_BASE}/papers`);
      const data = await res.json();
      setPapers(data.papers || []);
      setTotalSize(data.totalSize || 0);
      setMaxSize(data.maxSize || 0);
    } catch (err) {
      setError('Failed to connect to the paper server');
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError('');
    setMessage('');

    const formData = new FormData();
    formData.append('paper', file);

    try {
      const res = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setMessage('Paper uploaded successfully!');
      fetchPapers();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = ''; // Reset input
    }
  };

  const handleDelete = async (filename) => {
    try {
      const res = await fetch(`${API_BASE}/papers/${filename}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchPapers();
      }
    } catch (err) {
      setError('Failed to delete paper');
    }
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const usagePercent = maxSize ? (totalSize / maxSize) * 100 : 0;

  return (
    <>
      <Section id="archive" title="Past Paper Archive">
        <P>
          Welcome to the archive. Use this section to manage your study materials and previous exam papers.
          Note that we have a **50MB limit** for total storage to ensure optimal platform performance.
        </P>

        {/* Upload Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          <div className="bg-bg-elevated/40 border border-border-color rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center min-h-[200px] group transition-all hover:bg-bg-elevated/60">
            <input
              type="file"
              id="paper-upload"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
            <label
              htmlFor="paper-upload"
              className={`flex flex-col items-center cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <div className="w-16 h-16 rounded-full bg-accent-primary/10 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                {uploading ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary" />
                ) : (
                  <Upload className="text-accent-primary" size={32} />
                )}
              </div>
              <span className="font-bold text-text-primary capitalize tracking-wide">
                {uploading ? 'Uploading...' : 'Click to Upload Paper'}
              </span>
              <span className="text-xs text-text-muted mt-2">PDF, Images or Text files supported</span>
            </label>
            
            {error && (
              <div className="mt-4 flex items-center gap-2 text-accent-red text-xs bg-accent-red/10 px-3 py-2 rounded-lg animate-pulse">
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}
            {message && (
              <div className="mt-4 flex items-center gap-2 text-accent-green text-xs bg-accent-green/10 px-3 py-2 rounded-lg">
                <CheckCircle2 size={14} />
                <span>{message}</span>
              </div>
            )}
          </div>

          <div className="bg-bg-elevated/40 border border-border-color rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 font-bold text-text-primary">
                <HardDrive size={20} className="text-accent-primary" />
                <span>Storage Status</span>
              </div>
              <span className="text-xs font-code text-text-muted">
                {formatSize(totalSize)} / {formatSize(maxSize)}
              </span>
            </div>
            
            <div className="w-full h-4 bg-bg-base/50 rounded-full overflow-hidden border border-border-color/20">
              <div 
                className={`h-full transition-all duration-500 rounded-full ${
                  usagePercent > 90 ? 'bg-accent-red' : usagePercent > 70 ? 'bg-accent-amber' : 'bg-accent-primary'
                }`}
                style={{ width: `${Math.min(usagePercent, 100)}%` }}
              />
            </div>
            
            <div className="mt-4">
              {usagePercent >= 100 ? (
                <Callout type="warning" title="Storage Full">
                  You cannot upload more, delete first to free up space.
                </Callout>
              ) : (
                <P className="text-xs text-text-muted">
                  You can still upload approximately **{formatSize(maxSize - totalSize)}** of content.
                </P>
              )}
            </div>
          </div>
        </div>

        {/* Paper List */}
        <div className="bg-bg-surface border border-border-color rounded-2xl overflow-hidden shadow-2xl">
          <div className="px-6 py-4 border-b border-border-color flex items-center justify-between bg-bg-elevated/20">
            <h4 className="font-bold text-text-primary uppercase tracking-widest text-xs opacity-70">Uploaded Papers</h4>
            <span className="text-[10px] font-code text-text-muted">{papers.length} Files Total</span>
          </div>
          
          <div className="divide-y divide-border-color/50 max-h-[400px] overflow-y-auto custom-scrollbar">
            {papers.length === 0 ? (
              <div className="p-12 flex flex-col items-center opacity-30">
                <FileText size={48} className="mb-4" />
                <span className="text-sm italic">No papers uploaded yet</span>
              </div>
            ) : (
              papers.map((paper) => (
                <div key={paper.name} className="px-6 py-4 flex items-center justify-between hover:bg-bg-elevated/10 transition-colors">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-bg-elevated flex items-center justify-center shrink-0">
                      <FileText size={20} className="text-accent-primary" />
                    </div>
                    <div className="truncate">
                      <div className="text-sm font-bold text-text-primary truncate" title={paper.name}>
                        {paper.name.split('-').slice(1).join('-')}
                      </div>
                      <div className="text-[10px] text-text-muted mt-0.5">
                        {formatSize(paper.size)} • {new Date(paper.uploadedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <a 
                      href={paper.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 text-text-muted hover:text-accent-primary transition-colors"
                    >
                      <Upload className="rotate-180" size={18} />
                    </a>
                    <button 
                      onClick={() => handleDelete(paper.name)}
                      className="p-2 text-text-muted hover:text-accent-red transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Section>
      <ModuleFooter moduleId="past-papers" />
    </>
  );
}
