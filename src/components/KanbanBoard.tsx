import React, { useState, useEffect } from 'react';
import { Columns, Plus, GitPullRequest, ArrowRight, Tag, User } from 'lucide-react';
import { KanbanCard } from '../types';

interface KanbanBoardProps {
  initialCards: KanbanCard[];
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ initialCards }) => {
  const [cards, setCards] = useState<KanbanCard[]>(initialCards);
  const [newTitle, setNewTitle] = useState('');
  const [selectedRepo, setSelectedRepo] = useState('dashboard');

  useEffect(() => {
    setCards(initialCards);
  }, [initialCards]);

  const columns: { id: KanbanCard['status']; label: string; count: number }[] = [
    { id: 'backlog', label: 'Backlog', count: cards.filter(c => c.status === 'backlog').length },
    { id: 'in_progress', label: 'In Progress', count: cards.filter(c => c.status === 'in_progress').length },
    { id: 'review', label: 'Code Review', count: cards.filter(c => c.status === 'review').length },
    { id: 'testing', label: 'Testing / CI', count: cards.filter(c => c.status === 'testing').length },
    { id: 'done', label: 'Done', count: cards.filter(c => c.status === 'done').length },
  ];

  const moveCard = (id: string, newStatus: KanbanCard['status']) => {
    setCards(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  const addCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newCard: KanbanCard = {
      id: `kan-${Date.now()}`,
      title: newTitle.trim(),
      repo: selectedRepo,
      assignee: 'Dnyanchand',
      priority: 'medium',
      tags: ['python', 'sprint-34'],
      status: 'backlog'
    };
    setCards([newCard, ...cards]);
    setNewTitle('');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#1b2537] bg-[#0d131f] p-4">
        <div className="flex items-center gap-2.5">
          <Columns className="h-5 w-5 text-cyan-400" />
          <div>
            <h2 className="text-sm font-semibold text-white">Unified Kanban Board</h2>
            <p className="text-xs text-slate-400">Cross-repository sprint tasks, PR triage, and backlog management</p>
          </div>
        </div>

        {/* Quick Add Form */}
        <form onSubmit={addCard} className="flex items-center gap-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Add task to backlog..."
            className="w-56 rounded-md border border-[#223147] bg-[#121927] px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
          <select
            value={selectedRepo}
            onChange={(e) => setSelectedRepo(e.target.value)}
            className="rounded-md border border-[#223147] bg-[#121927] px-2 py-1.5 text-xs font-mono text-slate-300 focus:outline-none"
          >
            <option value="musafir-cafe">musafir-cafe</option>
            <option value="email-automate">email-automate</option>
            <option value="ai-latency-probe">ai-latency-probe</option>
          </select>
          <button
            type="submit"
            className="flex items-center gap-1 rounded-md bg-cyan-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-cyan-500 transition-colors"
          >
            <Plus className="h-3 w-3" />
            <span>Add</span>
          </button>
        </form>
      </div>

      {/* Kanban Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {columns.map((col) => {
          const colCards = cards.filter(c => c.status === col.id);
          return (
            <div key={col.id} className="flex flex-col rounded-xl border border-[#1b2537] bg-[#0b0f17] p-3 min-h-[460px]">
              <div className="flex items-center justify-between pb-3 border-b border-[#182335] mb-3">
                <span className="text-xs font-semibold text-slate-200">{col.label}</span>
                <span className="rounded-full bg-[#182335] px-2 py-0.5 font-mono text-[10px] text-cyan-300 font-bold">
                  {col.count}
                </span>
              </div>

              <div className="flex-1 space-y-2.5 overflow-y-auto">
                {colCards.map((card) => (
                  <div
                    key={card.id}
                    className="rounded-lg border border-[#1d2a3d] bg-[#101725] p-3 text-xs shadow-sm hover:border-[#2b3e5a] transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-[10px] text-cyan-400 bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-800/40">
                        {card.repo}
                      </span>
                      <span className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded font-semibold ${
                        card.priority === 'high' ? 'text-rose-400 bg-rose-950/40' :
                        card.priority === 'medium' ? 'text-amber-400 bg-amber-950/40' :
                        'text-slate-400 bg-slate-800'
                      }`}>
                        {card.priority}
                      </span>
                    </div>

                    <p className="font-medium text-slate-200 line-clamp-3 mb-2.5 leading-snug">
                      {card.title}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-[#182335]">
                      <div className="flex items-center gap-1.5">
                        <User className="h-3 w-3 text-slate-500" />
                        <span>{card.assignee}</span>
                      </div>

                      {/* Move to next stage button */}
                      {col.id !== 'done' && (
                        <button
                          onClick={() => {
                            const nextOrder: KanbanCard['status'][] = ['backlog', 'in_progress', 'review', 'testing', 'done'];
                            const nextIdx = nextOrder.indexOf(col.id) + 1;
                            if (nextIdx < nextOrder.length) {
                              moveCard(card.id, nextOrder[nextIdx]);
                            }
                          }}
                          title="Move to next stage"
                          className="flex items-center gap-1 text-[10px] font-mono text-cyan-400 hover:text-cyan-300"
                        >
                          <span>Move</span>
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
