import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, X, Briefcase, BookOpen, Building2, FolderGit2, ArrowRight } from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, internships, courses, projects, navigateTo } = useApp();
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'internship' | 'course' | 'project'>('all');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      } else if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const q = query.toLowerCase().trim();

  const matchedInternships = (!q ? internships.slice(0, 3) : internships.filter(
    (i) =>
      i.title.toLowerCase().includes(q) ||
      i.company.toLowerCase().includes(q) ||
      i.skills.some((s) => s.toLowerCase().includes(q))
  ));

  const matchedCourses = (!q ? courses.slice(0, 3) : courses.filter(
    (c) =>
      c.title.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.skills.some((s) => s.toLowerCase().includes(q))
  ));

  const matchedProjects = (!q ? projects.slice(0, 2) : projects.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      (p.technologies || p.techStack || []).some((t) => t.toLowerCase().includes(q))
  ));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search internships, courses, skills, companies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-base text-slate-900 placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="px-2 py-1 text-xs font-semibold bg-slate-100 text-slate-600 rounded-md hover:bg-slate-200 transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border-b border-slate-100 text-xs overflow-x-auto">
          {(['all', 'internship', 'course', 'project'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 rounded-lg font-medium capitalize transition-colors cursor-pointer ${
                filterType === type
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              {type === 'all' ? 'All Results' : `${type}s`}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {/* Internships section */}
          {(filterType === 'all' || filterType === 'internship') && matchedInternships.length > 0 && (
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Internships ({matchedInternships.length})</span>
              </p>
              <div className="space-y-1.5">
                {matchedInternships.map((i) => (
                  <div
                    key={i.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      navigateTo('all-programs', { searchQuery: i.title });
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-blue-50/60 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <img src={i.companyLogo} alt={i.company} className="w-9 h-9 rounded-lg object-cover" />
                      <div>
                        <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {i.title}
                        </p>
                        <p className="text-xs text-slate-500">
                          {i.company} • {i.location} • <span className="text-blue-600 font-medium">{i.stipendText}</span>
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Courses section */}
          {(filterType === 'all' || filterType === 'course') && matchedCourses.length > 0 && (
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Courses ({matchedCourses.length})</span>
              </p>
              <div className="space-y-1.5">
                {matchedCourses.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      navigateTo('all-programs', { searchQuery: c.title });
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-blue-50/60 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <img src={c.image} alt={c.title} className="w-9 h-9 rounded-lg object-cover" />
                      <div>
                        <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {c.title}
                        </p>
                        <p className="text-xs text-slate-500">
                          {c.category} • ★ {c.rating} • ₹{c.price.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects section */}
          {(filterType === 'all' || filterType === 'project') && matchedProjects.length > 0 && (
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FolderGit2 className="w-3.5 h-3.5" />
                <span>Projects ({matchedProjects.length})</span>
              </p>
              <div className="space-y-1.5">
                {matchedProjects.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      navigateTo('all-programs');
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-blue-50/60 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.title} className="w-9 h-9 rounded-lg object-cover" />
                      <div>
                        <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {p.title}
                        </p>
                        <p className="text-xs text-slate-500">
                          {(p.technologies || p.techStack || []).join(', ')} • {p.progress}% completed
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {matchedInternships.length === 0 && matchedCourses.length === 0 && matchedProjects.length === 0 && (
            <div className="text-center py-10">
              <p className="text-slate-500 font-medium text-sm">No results found for "{query}"</p>
              <p className="text-xs text-slate-400 mt-1">Try searching for "React", "Python", "TechCorp", or "UI/UX"</p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Navigate with mouse or keyboard</span>
          <span className="font-semibold text-blue-600">A2Z Global Search</span>
        </div>

      </div>
    </div>
  );
};
