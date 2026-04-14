'use client';

import { useEffect, useRef, useState } from 'react';
import Modal from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { useConfirm } from '@/components/ui/ConfirmDialog';
import { api } from '@/lib/api';

type FolderItem = { name: string; path: string };
type FileItem = { filename: string; path: string; url: string; size?: number; mtime?: number };

type BuiltinItem = { filename: string; url: string; path: string; builtin: true };

const BUILTIN: BuiltinItem[] = [
  { filename: 'main.png', url: '/main.png', path: 'main.png', builtin: true },
  { filename: 'banner.jpg', url: '/banner.jpg', path: 'banner.jpg', builtin: true },
  { filename: 'logo.png', url: '/logo.png', path: 'logo.png', builtin: true },
];

function resolveSrc(url?: string) {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('/')) return url;
  if (url.includes('.')) return `/${url}`;
  return `/uploads/${url}`;
}

export default function ImagePicker({
  value,
  onChange,
  aspect = 'landscape',
  label,
}: {
  value?: string;
  onChange: (url: string) => void;
  aspect?: 'square' | 'landscape' | 'portrait';
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const aspectCls = { square: 'aspect-square', landscape: 'aspect-[16/10]', portrait: 'aspect-[3/4]' }[aspect];

  return (
    <div>
      {label && <div className="text-xs uppercase tracking-wider text-nv-text mb-1.5 font-semibold">{label}</div>}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`group relative block w-full ${aspectCls} rounded-xl border-2 border-dashed border-nv-cream hover:border-nv-dark bg-nv-cream/10 overflow-hidden transition`}
      >
        {value ? (
          <>
            <img src={resolveSrc(value)} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-nv-dark/0 group-hover:bg-nv-dark/50 transition flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 bg-white text-nv-dark font-semibold rounded-full px-4 py-2 text-sm transition">
                Змінити
              </span>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-nv-text">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
            <span className="mt-2 text-sm font-medium">Обрати зображення</span>
          </div>
        )}
      </button>

      <ImagePickerModal
        open={open}
        onClose={() => setOpen(false)}
        value={value}
        onPick={(url) => {
          onChange(url);
          setOpen(false);
        }}
      />
    </div>
  );
}

function ImagePickerModal({
  open,
  onClose,
  value,
  onPick,
}: {
  open: boolean;
  onClose: () => void;
  value?: string;
  onPick: (url: string) => void;
}) {
  const toast = useToast();
  const confirm = useConfirm();

  const [tab, setTab] = useState<'library' | 'upload' | 'url'>('library');
  const [currentPath, setCurrentPath] = useState('');
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [manualUrl, setManualUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [drag, setDrag] = useState(false);
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);

  const load = async (p: string = currentPath) => {
    setLoading(true);
    try {
      const r = await api.get('/uploads-api', { params: { path: p } });
      setFolders(r.data?.folders || []);
      setFiles(r.data?.items || []);
    } catch {
      setFolders([]);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      setCurrentPath('');
      setSearch('');
      setManualUrl(value || '');
      setTab('library');
      load('');
    }
  }, [open]);

  useEffect(() => {
    if (open) load(currentPath);
  }, [currentPath]);

  const cd = (p: string) => {
    setCurrentPath(p);
    setSearch('');
  };

  const upload = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const r = await api.post('/uploads-api', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        params: currentPath ? { path: currentPath } : {},
      });
      if (r.data?.url) {
        toast.success('Завантажено');
        await load();
        onPick(r.data.url);
      } else {
        toast.error('Помилка завантаження');
      }
    } catch {
      toast.error('Помилка завантаження');
    } finally {
      setUploading(false);
    }
  };

  const createFolder = async () => {
    const name = newFolderName.trim();
    if (!name) return;
    if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
      toast.error('Тільки латиниця, цифри, - та _');
      return;
    }
    try {
      await api.post('/uploads-api/folders', { path: currentPath, name });
      toast.success('Папку створено');
      setNewFolderOpen(false);
      setNewFolderName('');
      load();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Помилка');
    }
  };

  const delFolder = async (e: React.MouseEvent, folder: FolderItem) => {
    e.stopPropagation();
    if (!(await confirm({ title: `Видалити папку «${folder.name}»?`, message: 'Усі файли всередині теж будуть видалені.', danger: true, confirmLabel: 'Видалити' }))) return;
    try {
      await api.delete('/uploads-api/folders', { params: { path: folder.path } });
      toast.success('Видалено');
      load();
    } catch {
      toast.error('Не вдалось');
    }
  };

  const delFile = async (e: React.MouseEvent, file: FileItem) => {
    e.stopPropagation();
    if (!(await confirm({ title: 'Видалити зображення?', message: file.filename, danger: true, confirmLabel: 'Видалити' }))) return;
    try {
      await api.delete('/uploads-api', { params: { path: file.path } });
      toast.success('Видалено');
      load();
    } catch {
      toast.error('Не вдалось');
    }
  };

  // Build breadcrumbs
  const segments = currentPath ? currentPath.split('/') : [];
  const crumbs: Array<{ label: string; path: string }> = [{ label: '◧ Бібліотека', path: '' }];
  for (let i = 0; i < segments.length; i++) {
    crumbs.push({ label: segments[i], path: segments.slice(0, i + 1).join('/') });
  }

  // Only show builtins at root
  const allFiles: Array<FileItem | BuiltinItem> =
    currentPath === '' ? [...files, ...BUILTIN] : files;

  const filteredFolders = search
    ? folders.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()))
    : folders;
  const filteredFiles = search
    ? allFiles.filter((f) => f.filename.toLowerCase().includes(search.toLowerCase()))
    : allFiles;

  return (
    <Modal open={open} onClose={onClose} title="Бібліотека зображень" size="xl">
      <div className="flex gap-1 mb-5 p-1 bg-nv-cream/20 rounded-full w-fit">
        {(
          [
            { k: 'library', label: '◧ Бібліотека' },
            { k: 'upload', label: '↑ Завантажити' },
            { k: 'url', label: '🔗 URL' },
          ] as const
        ).map((t) => (
          <button
            key={t.k}
            onClick={() => setTab(t.k)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${
              tab === t.k ? 'bg-nv-dark text-nv-cream' : 'text-nv-dark hover:bg-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'library' && (
        <div>
          {/* Breadcrumbs + actions */}
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <nav className="flex items-center gap-1 text-sm flex-wrap">
              {crumbs.map((c, i) => (
                <span key={i} className="flex items-center gap-1">
                  {i > 0 && <span className="text-nv-text/50">/</span>}
                  <button
                    onClick={() => cd(c.path)}
                    className={`px-2 py-1 rounded-lg transition ${
                      i === crumbs.length - 1
                        ? 'bg-nv-dark text-nv-cream font-semibold'
                        : 'text-nv-dark hover:bg-nv-cream/30 font-medium'
                    }`}
                  >
                    {c.label}
                  </button>
                </span>
              ))}
            </nav>
            <button
              onClick={() => setNewFolderOpen(true)}
              className="text-sm rounded-full border border-nv-dark/20 px-4 py-1.5 hover:bg-nv-cream/30 font-medium"
            >
              + Нова папка
            </button>
          </div>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Пошук у цій папці..."
            className="w-full px-4 py-2.5 rounded-full border border-nv-cream focus:outline-none focus:border-nv-dark mb-4"
          />

          {loading ? (
            <div className="py-12 text-center text-nv-text">Завантаження...</div>
          ) : filteredFolders.length === 0 && filteredFiles.length === 0 ? (
            <div className="py-12 text-center text-nv-text">
              Пусто. Створи папку або завантаж файл.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[55vh]">
              {/* Folders first */}
              {filteredFolders.map((f) => (
                <button
                  key={f.path}
                  onDoubleClick={() => cd(f.path)}
                  onClick={() => cd(f.path)}
                  className="group relative aspect-square rounded-xl border-2 border-nv-cream hover:border-nv-dark bg-nv-cream/10 hover:bg-nv-cream/30 transition flex flex-col items-center justify-center gap-2"
                >
                  <svg width="44" height="44" viewBox="0 0 24 24" fill="#f7dba7" stroke="#00172d" strokeWidth="1.3">
                    <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
                  </svg>
                  <span className="text-sm font-semibold text-nv-dark truncate max-w-[90%] px-2">{f.name}</span>
                  <span
                    onClick={(e) => delFolder(e, f)}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/90 text-rose-500 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 hover:bg-rose-500 hover:text-white transition cursor-pointer"
                  >
                    ×
                  </span>
                </button>
              ))}

              {/* Files */}
              {filteredFiles.map((it) => {
                const isBuiltin = 'builtin' in it && it.builtin;
                const isSelected = value === it.url;
                return (
                  <button
                    key={it.url}
                    onClick={() => onPick(it.url)}
                    className={`group relative aspect-square rounded-xl overflow-hidden border-2 transition ${
                      isSelected ? 'border-nv-dark shadow-lg' : 'border-nv-cream hover:border-nv-dark'
                    }`}
                  >
                    <img src={it.url} alt={it.filename} className="w-full h-full object-cover" />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-nv-dark/80 to-transparent p-2 flex items-end justify-between">
                      <span className="text-[10px] text-white/90 truncate">{it.filename}</span>
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-nv-dark text-nv-cream flex items-center justify-center text-xs font-bold">
                        ✓
                      </div>
                    )}
                    {!isBuiltin && (
                      <span
                        onClick={(e) => delFile(e, it as FileItem)}
                        className="absolute top-2 left-2 w-6 h-6 rounded-full bg-white/90 text-rose-500 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 hover:bg-rose-500 hover:text-white transition cursor-pointer"
                      >
                        ×
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* New folder modal */}
          {newFolderOpen && (
            <div
              className="fixed inset-0 z-[150] bg-nv-dark/60 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setNewFolderOpen(false)}
            >
              <div
                className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="font-display font-semibold text-nv-dark text-lg tracking-tight">Нова папка</h3>
                <p className="text-xs text-nv-text mt-1 mb-4">
                  У: <span className="font-mono">{currentPath || '/'}</span>
                </p>
                <input
                  autoFocus
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && createFolder()}
                  placeholder="dogs, hero, blog..."
                  className="w-full px-4 py-2.5 rounded-xl border border-nv-cream focus:outline-none focus:border-nv-dark mb-2"
                />
                <div className="text-[11px] text-nv-text/70 mb-4">Тільки латиниця, цифри, - та _</div>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setNewFolderOpen(false)}
                    className="rounded-full border border-nv-dark/20 px-5 py-2 font-semibold hover:bg-nv-cream/30"
                  >
                    Скасувати
                  </button>
                  <button
                    onClick={createFolder}
                    disabled={!newFolderName.trim()}
                    className="rounded-full bg-nv-dark text-nv-cream px-5 py-2 font-semibold disabled:opacity-50"
                  >
                    Створити
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'upload' && (
        <div>
          {currentPath && (
            <div className="mb-4 text-sm text-nv-text">
              Завантаження в папку: <span className="font-mono bg-nv-cream/30 px-2 py-1 rounded">/{currentPath}</span>
            </div>
          )}
          <div
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDrag(false);
              const f = e.dataTransfer.files?.[0];
              if (f) upload(f);
            }}
            onClick={() => fileInput.current?.click()}
            className={`rounded-3xl border-2 border-dashed p-12 text-center cursor-pointer transition ${
              drag ? 'border-nv-dark bg-nv-cream/30' : 'border-nv-cream hover:border-nv-dark bg-nv-cream/10'
            }`}
          >
            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) upload(f);
              }}
            />
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#00172d" strokeWidth="1.5" className="mx-auto opacity-70">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <div className="mt-4 font-semibold text-nv-dark text-lg">
              {uploading ? 'Завантаження...' : 'Перетягни файл або натисни'}
            </div>
            <div className="text-sm text-nv-text mt-1">PNG, JPG, WebP, GIF · до 10 MB</div>
          </div>
        </div>
      )}

      {tab === 'url' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-nv-text mb-2 font-semibold">URL зображення</label>
            <input
              value={manualUrl}
              onChange={(e) => setManualUrl(e.target.value)}
              placeholder="https://example.com/image.jpg або /main.png"
              className="w-full px-4 py-3 rounded-xl border border-nv-cream focus:outline-none focus:border-nv-dark"
            />
          </div>
          {manualUrl && (
            <div className="rounded-xl border border-nv-cream overflow-hidden">
              <img src={resolveSrc(manualUrl)} alt="preview" className="w-full max-h-[40vh] object-contain" />
            </div>
          )}
          <button
            onClick={() => manualUrl && onPick(manualUrl)}
            disabled={!manualUrl}
            className="rounded-full bg-nv-dark text-nv-cream font-semibold px-6 py-2.5 disabled:opacity-50"
          >
            Використати URL
          </button>
        </div>
      )}
    </Modal>
  );
}
