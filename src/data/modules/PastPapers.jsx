import { useState, useEffect } from 'react';
import { Section, P, Callout, BulletList } from '../../components/modules/ModuleComponents';
import ModuleFooter from '../../components/modules/ModuleFooter';
import { Upload, Trash2, FileText, AlertCircle, HardDrive, CheckCircle2, Eye, X, BookOpen, FileCode } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';

const BUCKET_NAME = 'past-papers';
const MAX_STORAGE_BYTES = 50 * 1024 * 1024; // 50MB

export default function PastPapers() {
  const [papers, setPapers] = useState([]);
  const [artifacts, setArtifacts] = useState([]);
  const [totalSize, setTotalSize] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  // New State for Artifacts
  const [uploadType, setUploadType] = useState('paper'); // 'paper' or 'artifact'
  const [artifactTitle, setArtifactTitle] = useState('');
  const [activeTab, setActiveTab] = useState('papers'); // 'papers' or 'artifacts'
  const [viewingArtifact, setViewingArtifact] = useState(null); // { url, title, blobUrl, loading }

  useEffect(() => {
    fetchFiles();
    // Cleanup blob URLs on unmount
    return () => {
      if (viewingArtifact?.blobUrl) {
        URL.revokeObjectURL(viewingArtifact.blobUrl);
      }
    };
  }, []);

  const fetchFiles = async () => {
    try {
      const { data, error } = await supabase.storage.from(BUCKET_NAME).list('', {
        sortBy: { column: 'created_at', order: 'desc' }
      });

      if (error) throw error;

      let sizeAccumulator = 0;
      const allFiles = data.map(file => {
        const size = file.metadata?.size || 0;
        sizeAccumulator += size;
        
        const { data: { publicUrl } } = supabase.storage.from(BUCKET_NAME).getPublicUrl(file.name);

        return {
          name: file.name,
          size: size,
          uploadedAt: file.created_at,
          url: publicUrl
        };
      });

      // Categorize files
      setPapers(allFiles.filter(f => f.name.startsWith('paper-')));
      setArtifacts(allFiles.filter(f => f.name.startsWith('artifact-')));
      setTotalSize(sizeAccumulator);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to fetch files from storage.');
    }
  };

  const openArtifact = async (file) => {
    const title = getArtifactDisplayTitle(file.name);
    setViewingArtifact({ title, loading: true });
    try {
      const response = await fetch(file.url);
      const text = await response.text();
      
      // Inject system variables and force dark mode styles
      const injectedStyles = `
        <style>
          :root {
            color-scheme: dark;
            --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
            --color-text-primary: #f1f5f9;
            --color-text-secondary: #cbd5e1;
            --color-border-tertiary: rgba(255, 255, 255, 0.1);
            --color-border-secondary: rgba(255, 255, 255, 0.2);
            --color-background-secondary: #12121a;
            --color-background-primary: #0a0a0f;
            background-color: #000 !important;
          }
          body { 
            background-color: #000 !important; 
            margin: 0;
            padding: 20px;
            color: #f1f5fslate;
          }
          /* Ensure buttons match system theme */
          .nav button {
            background: rgba(255,255,255,0.05) !important;
            border: 1px solid rgba(255,255,255,0.2) !important;
            color: white !important;
            border-radius: 8px !important;
            transition: all 0.2s !important;
          }
          .nav button:hover:not(:disabled) {
            background: rgba(255,255,255,0.1) !important;
            border-color: rgba(255,255,255,0.4) !important;
          }
          /* Force dark mode colors for algorithm cells */
          .cell {
            background: #1a1a26 !important;
            border-color: #2e2e42 !important;
            color: #f1f5f9 !important;
          }
          .cell.pivot { background: #633806 !important; border-color: #BA7517 !important; color: #FAC775 !important; }
          .cell.small { background: #04342C !important; border-color: #1D9E75 !important; color: #9FE1CB !important; }
          .cell.large { background: #501313 !important; border-color: #A32D2D !important; color: #F7C1C1 !important; }
          .cell.sorted { background: #26215C !important; border-color: #7F77DD !important; color: #CECBF6 !important; }
        </style>
      `;
      
      const content = text.includes('<style>') 
        ? text.replace('<style>', injectedStyles + '<style>')
        : injectedStyles + text;

      const blob = new Blob([content], { type: 'text/html' });
      const blobUrl = URL.createObjectURL(blob);
      setViewingArtifact({ 
        url: file.url, 
        title: title, 
        blobUrl: blobUrl,
        loading: false 
      });
    } catch (err) {
      console.error('Failed to load artifact:', err);
      setError('Could not render walkthrough. Try downloading it instead.');
      setViewingArtifact(null);
    }
  };

  const closeArtifact = () => {
    if (viewingArtifact?.blobUrl) {
      URL.revokeObjectURL(viewingArtifact.blobUrl);
    }
    setViewingArtifact(null);
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (uploadType === 'artifact' && !artifactTitle.trim()) {
      setError('Please provide a title for the walkthrough.');
      return;
    }

    if (uploadType === 'artifact' && !file.name.toLowerCase().endsWith('.html')) {
      setError('Exam artifacts must be .html files.');
      return;
    }

    if (totalSize + file.size > MAX_STORAGE_BYTES) {
      setError('Cannot upload: 50MB storage limit reached.');
      return;
    }

    setUploading(true);
    setError('');
    setMessage('');

    try {
      let fileName;
      let contentType = file.type;
      
      if (uploadType === 'artifact') {
        const sanitizedTitle = artifactTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        fileName = `artifact-${sanitizedTitle}-${Date.now()}.html`;
        contentType = 'text/html';
      } else {
        fileName = `paper-${Date.now()}-${file.name}`;
      }
      
      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, file, {
          contentType: contentType,
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      setMessage(`${uploadType === 'paper' ? 'Paper' : 'Artifact'} uploaded successfully!`);
      setArtifactTitle('');
      fetchFiles();
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (filename) => {
    try {
      const { error } = await supabase.storage.from(BUCKET_NAME).remove([filename]);
      if (error) throw error;
      fetchFiles();
    } catch (err) {
      setError('Failed to delete file');
    }
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getArtifactDisplayTitle = (fileName) => {
    const parts = fileName.split('-');
    if (parts.length < 3) return fileName;
    return parts[1].replace(/_/g, ' ').toUpperCase();
  };

  const usagePercent = (totalSize / MAX_STORAGE_BYTES) * 100;

  return (
    <>
      <Section id="archive" title="Archive & Walkthroughs">
        <P>
          Manage your exam papers and interactive artifacts. Artifacts allow you to view step-by-step walkthroughs of complex algorithm solutions directly in your browser.
        </P>

        {/* Upload Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-8">
          <div className="lg:col-span-2 bg-bg-elevated/40 border border-border-color rounded-2xl p-6 shadow-xl relative overflow-hidden group">
            <div className="flex flex-col md:flex-row gap-6 h-full items-center">
              <div className="flex-1 w-full">
                <div className="flex items-center gap-2 mb-6 p-1 bg-bg-base/50 rounded-lg w-fit border border-border-color/20">
                  <button 
                    onClick={() => setUploadType('paper')}
                    className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${uploadType === 'paper' ? 'bg-accent-primary text-white shadow-lg' : 'text-text-muted hover:text-text-primary'}`}
                  >
                    Past Paper
                  </button>
                  <button 
                    onClick={() => setUploadType('artifact')}
                    className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${uploadType === 'artifact' ? 'bg-accent-primary text-white shadow-lg' : 'text-text-muted hover:text-text-primary'}`}
                  >
                    Exam Artifact
                  </button>
                </div>

                {uploadType === 'artifact' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mb-6"
                  >
                    <label className="text-[10px] font-bold text-accent-primary uppercase tracking-[0.2em] mb-2 block px-1">
                      Walkthrough Title
                    </label>
                    <div className="relative group/input">
                      <input 
                        type="text"
                        placeholder="e.g. 2021 BIT Part 1 - Q6"
                        className="w-full bg-bg-base/20 border border-border-color/30 rounded-2xl px-5 py-4 text-sm text-text-primary focus:border-accent-primary/60 focus:bg-bg-base/40 outline-none transition-all placeholder:text-text-muted/20 shadow-inner group-hover/input:border-border-color/60"
                        value={artifactTitle}
                        onChange={(e) => setArtifactTitle(e.target.value)}
                      />
                      <div className="absolute inset-0 rounded-2xl bg-accent-primary/5 opacity-0 group-focus-within/input:opacity-100 pointer-events-none transition-opacity" />
                    </div>
                  </motion.div>
                )}

                <div className="flex flex-col items-center justify-center border-2 border-dashed border-border-color/40 rounded-2xl p-6 hover:border-accent-primary/40 transition-colors bg-bg-base/10">
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={handleUpload}
                    disabled={uploading}
                    accept={uploadType === 'artifact' ? '.html' : '*'}
                  />
                  <label htmlFor="file-upload" className={`flex flex-col items-center cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                    <div className="w-12 h-12 rounded-full bg-accent-primary/10 flex items-center justify-center mb-3">
                      {uploading ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent-primary" /> : <Upload className="text-accent-primary" size={24} />}
                    </div>
                    <span className="text-sm font-bold text-text-primary">{uploading ? 'Uploading...' : 'Click to Upload'}</span>
                    <span className="text-[10px] text-text-muted mt-1">
                      {uploadType === 'artifact' ? 'HTML walkthroughs only' : 'PDF, Images, or Text'}
                    </span>
                  </label>
                </div>
                
                <AnimatePresence>
                  {error && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 flex items-center gap-2 text-accent-red text-xs bg-accent-red/10 px-3 py-2 rounded-lg">
                      <AlertCircle size={14} /> <span>{error}</span>
                    </motion.div>
                  )}
                  {message && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 flex items-center gap-2 text-accent-green text-xs bg-accent-green/10 px-3 py-2 rounded-lg">
                      <CheckCircle2 size={14} /> <span>{message}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="bg-bg-elevated/40 border border-border-color rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 font-bold text-text-primary">
                <HardDrive size={18} className="text-accent-primary" />
                <span className="text-sm">Cloud Storage</span>
              </div>
              <span className="text-[10px] font-code text-text-muted">
                {formatSize(totalSize)} / {formatSize(MAX_STORAGE_BYTES)}
              </span>
            </div>
            
            <div className="w-full h-3 bg-bg-base/50 rounded-full overflow-hidden border border-border-color/20">
              <div 
                className={`h-full transition-all duration-700 ${usagePercent > 90 ? 'bg-accent-red' : usagePercent > 70 ? 'bg-accent-amber' : 'bg-accent-primary'}`}
                style={{ width: `${Math.min(usagePercent, 100)}%` }}
              />
            </div>
            
            <div className="mt-6">
              {usagePercent >= 100 ? (
                <Callout type="warning" title="Storage Full">
                  Delete files to continue.
                </Callout>
              ) : (
                <div className="p-3 bg-bg-base/20 rounded-xl border border-border-color/20">
                  <div className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Available Space</div>
                  <div className="text-lg font-bold text-text-primary tabular-nums">
                    {formatSize(MAX_STORAGE_BYTES - totalSize)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabbed Archive List */}
        <div className="bg-bg-surface border border-border-color rounded-2xl overflow-hidden shadow-2xl">
          <div className="px-6 border-b border-border-color bg-bg-elevated/20 flex items-center justify-between">
            <div className="flex">
              <button 
                onClick={() => setActiveTab('papers')}
                className={`px-6 py-4 text-xs font-bold uppercase tracking-widest transition-all relative ${activeTab === 'papers' ? 'text-accent-primary' : 'text-text-muted'}`}
              >
                Past Papers ({papers.length})
                {activeTab === 'papers' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-primary" />}
              </button>
              <button 
                onClick={() => setActiveTab('artifacts')}
                className={`px-6 py-4 text-xs font-bold uppercase tracking-widest transition-all relative ${activeTab === 'artifacts' ? 'text-accent-primary' : 'text-text-muted'}`}
              >
                Artifacts ({artifacts.length})
                {activeTab === 'artifacts' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-primary" />}
              </button>
            </div>
          </div>
          
          <div className="divide-y divide-border-color/50 max-h-[500px] overflow-y-auto custom-scrollbar">
            {(activeTab === 'papers' ? papers : artifacts).length === 0 ? (
              <div className="p-16 flex flex-col items-center opacity-20">
                <FileText size={64} className="mb-4" />
                <span className="text-sm italic tracking-widest uppercase">Archive Empty</span>
              </div>
            ) : (
              (activeTab === 'papers' ? papers : artifacts).map((file) => (
                <div key={file.name} className="px-6 py-4 flex items-center justify-between hover:bg-bg-elevated/10 transition-colors group">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-bg-elevated border border-border-color/40 flex items-center justify-center shrink-0 group-hover:bg-accent-primary/10 transition-colors">
                      {activeTab === 'papers' ? <FileText size={20} className="text-accent-primary" /> : <FileCode size={20} className="text-accent-primary" />}
                    </div>
                    <div className="truncate">
                      <div className="text-sm font-bold text-text-primary truncate" title={file.name}>
                        {activeTab === 'papers' ? file.name.split('-').slice(2).join('-') : getArtifactDisplayTitle(file.name)}
                      </div>
                      <div className="text-[10px] text-text-muted mt-0.5 font-code">
                        {formatSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {activeTab === 'artifacts' && (
                      <button 
                        onClick={() => openArtifact(file)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold bg-accent-primary/10 text-accent-primary hover:bg-accent-primary hover:text-white transition-all disabled:opacity-50`}
                        disabled={viewingArtifact?.loading}
                      >
                        {viewingArtifact?.loading && viewingArtifact.title === getArtifactDisplayTitle(file.name) ? (
                          <div className="animate-spin h-3 w-3 border-b-2 border-current rounded-full" />
                        ) : (
                          <Eye size={14} />
                        )}
                        VIEW
                      </button>
                    )}
                    <a href={file.url} target="_blank" rel="noopener noreferrer" className="p-2 text-text-muted hover:text-accent-primary transition-colors">
                      <Upload className="rotate-180" size={16} />
                    </a>
                    <button onClick={() => handleDelete(file.name)} className="p-2 text-text-muted hover:text-accent-red transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Section>

      {/* Artifact Viewer Modal */}
      <AnimatePresence>
        {viewingArtifact && !viewingArtifact.loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-bg-base/90 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full h-full max-w-7xl bg-bg-surface border border-border-color rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-border-color bg-bg-elevated/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent-primary/20 flex items-center justify-center">
                    <BookOpen size={18} className="text-accent-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">{viewingArtifact.title}</h3>
                    <p className="text-[10px] text-text-muted">Interactive Exam Artifact</p>
                  </div>
                </div>
                <button 
                  onClick={closeArtifact}
                  className="p-2 rounded-full bg-bg-base/40 text-text-muted hover:text-accent-red hover:bg-accent-red/10 transition-all focus:outline-none focus:ring-2 focus:ring-accent-red/20"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 bg-black relative">
                <iframe 
                  src={viewingArtifact.blobUrl} 
                  className="w-full h-full border-none"
                  title={viewingArtifact.title}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ModuleFooter moduleId="past-papers" />
    </>
  );
}
