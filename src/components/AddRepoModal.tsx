import React, { useState } from 'react';
import { X, Plus, FolderGit2, Check } from 'lucide-react';
import { Repository } from '../types';

interface AddRepoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRepo: (repo: Partial<Repository>) => void;
}

export const AddRepoModal: React.FC<AddRepoModalProps> = ({ isOpen, onClose, onAddRepo }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<'Private' | 'Public'>('Private');
  const [techStackInput, setTechStackInput] = useState('Python 3.10, FastAPI, Docker');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddRepo({
      name: name.trim().toLowerCase().replace(/\s+/g, '-'),
      description: description.trim() || 'Tracked production repository in RepoHub Terminal HUD.',
      visibility,
      techStack: techStackInput.split(',').map(s => s.trim()).filter(Boolean),
      primaryBranch: 'main',
      commitsCount: 1,
      openPRs: 0,
      icon: 'cloud'
    });

    setName('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-xl border border-[#233550] bg-[#0d1422] shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#1b273c] bg-[#090e18] px-5 py-4">
          <div className="flex items-center gap-2">
            <FolderGit2 className="h-5 w-5 text-cyan-400" />
            <h3 className="text-sm font-semibold text-white">Track New Repository</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">
              Repository Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. order-dispatcher-service"
              className="w-full rounded-md border border-[#1e2a3c] bg-[#070b12] px-3 py-2 font-mono text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the service..."
              className="w-full rounded-md border border-[#1e2a3c] bg-[#070b12] px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">
              Visibility
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="radio"
                  name="vis"
                  checked={visibility === 'Private'}
                  onChange={() => setVisibility('Private')}
                  className="text-cyan-500 focus:ring-0"
                />
                <span>Private</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="radio"
                  name="vis"
                  checked={visibility === 'Public'}
                  onChange={() => setVisibility('Public')}
                  className="text-cyan-500 focus:ring-0"
                />
                <span>Public</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">
              Tech Stack (comma-separated)
            </label>
            <input
              type="text"
              value={techStackInput}
              onChange={(e) => setTechStackInput(e.target.value)}
              placeholder="Python 3.10, FastAPI, Redis"
              className="w-full rounded-md border border-[#1e2a3c] bg-[#070b12] px-3 py-2 font-mono text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="pt-3 border-t border-[#1b273c] flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-[#192437] px-3 py-1.5 text-xs text-slate-300 hover:bg-[#23324d]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-cyan-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-cyan-500"
            >
              Save Repository
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
