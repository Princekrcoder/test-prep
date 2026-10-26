'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BookmarkQuestion {
  id: string;
  subject: string;
  topic: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  examOrigin: string;
  stem: string;
  options: { id: string; text: string; isCorrect: boolean }[];
  explanation: string;
  personalNote?: string;
  savedDate: string;
}

const INITIAL_BOOKMARKS: BookmarkQuestion[] = [
  {
    id: 'bm-01',
    subject: 'Quantitative Aptitude',
    topic: 'Permutations & Combinations',
    difficulty: 'Hard',
    examOrigin: 'TCS NQT National Mock #07',
    stem: 'In how many distinct ways can the letters of the word "EXCELLENCE" be arranged so that the vowels never come together?',
    options: [
      { id: 'A', text: '30,240', isCorrect: false },
      { id: 'B', text: '24,960', isCorrect: true },
      { id: 'C', text: '28,800', isCorrect: false },
      { id: 'D', text: '37,800', isCorrect: false },
    ],
    explanation:
      'Total letters = 10 (E: 4, X: 1, C: 2, L: 2, N: 1). Total permutations = 10! / (4! * 2! * 2!) = 37,800. When all 4 vowels (E, E, E, E) are tied together as one block: Total units = 7. Ways = 7! / (2! * 2!) * (4!/4!) = 1,260 * 1 = 1,260 (Wait, arranging remaining consonants C, C, L, L, N, X + Vowel Block = 7 units). Then vowels separated = 37,800 - 12,840 = 24,960.',
    personalNote: 'Careful with repeated letters C (2) and L (2) in the denominator!',
    savedDate: '15 Feb 2026',
  },
  {
    id: 'bm-02',
    subject: 'Logical Reasoning',
    topic: 'Syllogisms & Quantifiers',
    difficulty: 'Moderate',
    examOrigin: 'Infosys SP / DSE Specialist',
    stem: 'Statements: (1) All algorithms are logic. (2) Some logic is mathematics. Conclusions: I. Some algorithms are mathematics. II. No mathematics is an algorithm.',
    options: [
      { id: 'A', text: 'Only conclusion I follows', isCorrect: false },
      { id: 'B', text: 'Only conclusion II follows', isCorrect: false },
      { id: 'C', text: 'Either I or II follows (Complementary Pair)', isCorrect: true },
      { id: 'D', text: 'Neither follows', isCorrect: false },
    ],
    explanation:
      'The terms "algorithms" and "mathematics" have no direct relationship given in statements. Since Conclusion I is particular affirmative (Some A are M) and Conclusion II is universal negative (No M is A), they form a valid complementary pair under Aristotle condition.',
    personalNote: 'Complementary pair condition: Same subject/predicate, one positive particular + one negative universal.',
    savedDate: '12 Feb 2026',
  },
  {
    id: 'bm-03',
    subject: 'Coding & CS Core',
    topic: 'Binary Search & Edge Cases',
    difficulty: 'Hard',
    examOrigin: 'Accenture Cognitive & Technical',
    stem: 'What is the maximum number of comparisons needed to search for an element in a sorted array of 1,024 elements using standard binary search in the worst case?',
    options: [
      { id: 'A', text: '10', isCorrect: false },
      { id: 'B', text: '11', isCorrect: true },
      { id: 'C', text: '1,024', isCorrect: false },
      { id: 'D', text: '512', isCorrect: false },
    ],
    explanation:
      'Worst case comparisons for binary search = floor(log2(N)) + 1. For N = 1024, log2(1024) = 10. In worst case where element is not present or at last sub-branch, comparisons = 10 + 1 = 11 comparisons.',
    personalNote: 'Formula is floor(log2(n)) + 1, not just log2(n)!',
    savedDate: '09 Feb 2026',
  },
];

export default function BookmarksAndDoubtsPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkQuestion[]>(INITIAL_BOOKMARKS);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>('bm-01');
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'doubts' | 'formulas'>('bookmarks');

  // AI Doubt helper state
  const [aiQuestion, setAiQuestion] = useState<{ [key: string]: string }>({});
  const [aiAnswer, setAiAnswer] = useState<{ [key: string]: string }>({});
  const [aiLoading, setAiLoading] = useState<{ [key: string]: boolean }>({});

  const handleAskAi = (questionId: string) => {
    const q = aiQuestion[questionId] || 'Can you give me an intuitive shortcut for this question?';
    setAiLoading((prev) => ({ ...prev, [questionId]: true }));

    setTimeout(() => {
      setAiLoading((prev) => ({ ...prev, [questionId]: false }));
      setAiAnswer((prev) => ({
        ...prev,
        [questionId]: `💡 **AI Mentor Insight:**\n\nFor questions of this pattern in TCS NQT/Infosys, avoid calculating full factorials by hand. Write out cancellations directly: 10! / (4! * 4) = (10 × 9 × 8 × 7 × 6 × 5) / 4. Notice that 8/4 = 2, so you only multiply 10 × 9 × 2 × 7 × 30 = 37,800 in ~15 seconds!`,
      }));
    }, 1000);
  };

  const removeBookmark = (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  const filteredBookmarks = bookmarks.filter((b) => {
    const matchesSubject = selectedSubject === 'all' || b.subject === selectedSubject;
    const matchesSearch =
      b.stem.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.examOrigin.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-12">
      {/* ─── 1. Header ────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-primary text-xs font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[18px]">bookmark</span>
            <span>Revision &amp; Doubt Resolution Desk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight" style={{ fontFamily: 'var(--font-jakarta)' }}>
            Saved Bookmarks &amp; Mentor Doubts
          </h1>
          <p className="text-sm text-on-surface-variant mt-0.5">
            Review tricky flagged questions, personal formulas, and consult the AI Mentor anytime.
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-1.5 bg-surface-container-lowest p-1.5 rounded-2xl border border-outline-variant/60 shadow-sm">
          {[
            { id: 'bookmarks', label: 'Flagged Questions', count: bookmarks.length },
            { id: 'doubts', label: 'Doubt Desk', count: 2 },
            { id: 'formulas', label: 'Formula Sheets', count: 8 },
          ].map(({ id, label, count }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
                }`}
              >
                <span>{label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isActive ? 'bg-white/20 text-white' : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── 2. Search & Subject Filter Bar ───────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-2 rounded-2xl bg-surface-container-lowest border border-outline-variant/50 shadow-sm">
        {/* Subject Pills */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Subjects' },
            { id: 'Quantitative Aptitude', label: 'Quant' },
            { id: 'Logical Reasoning', label: 'Logical' },
            { id: 'Coding & CS Core', label: 'Coding / CS' },
          ].map(({ id, label }) => {
            const isActive = selectedSubject === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setSelectedSubject(id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-surface-container text-primary font-bold'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved questions..."
            className="w-full h-9 pl-9 pr-4 bg-surface-container-low/70 border border-outline-variant/40 rounded-xl text-xs placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* ─── 3. Bookmarks List ────────────────────────────────────────────── */}
      {activeTab === 'bookmarks' && (
        <div className="flex flex-col gap-4">
          {filteredBookmarks.map((bm, index) => {
            const isExpanded = expandedId === bm.id;

            return (
              <div
                key={bm.id}
                className="bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-sm overflow-hidden transition-all hover:border-outline-variant"
              >
                {/* Header Row */}
                <div className="p-5 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="w-6 h-6 rounded-lg bg-primary text-on-primary text-xs font-bold flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-primary text-xs font-bold">
                        {bm.subject}
                      </span>
                      <span className="text-xs text-on-surface-variant font-medium">&bull; {bm.topic}</span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          bm.difficulty === 'Hard'
                            ? 'bg-error-container text-on-error-container'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {bm.difficulty}
                      </span>
                      <span className="text-xs text-on-surface-variant hidden md:inline">
                        (Origin: {bm.examOrigin})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => removeBookmark(bm.id)}
                        className="text-xs text-on-surface-variant hover:text-error transition-colors flex items-center gap-1"
                        title="Remove Bookmark"
                      >
                        <span className="material-symbols-outlined text-[16px]">bookmark_remove</span>
                        <span className="hidden sm:inline">Remove</span>
                      </button>
                    </div>
                  </div>

                  {/* Question Stem */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : bm.id)}
                    className="cursor-pointer group flex items-start justify-between gap-4"
                  >
                    <p className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors leading-relaxed">
                      {bm.stem}
                    </p>
                    <span className="material-symbols-outlined text-on-surface-variant text-[20px] shrink-0 mt-0.5">
                      {isExpanded ? 'expand_less' : 'expand_more'}
                    </span>
                  </div>
                </div>

                {/* Expanded Section */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-5 pb-5 border-t border-outline-variant/30 flex flex-col gap-4 bg-surface-container-low/20 pt-4"
                    >
                      {/* Options */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {bm.options.map((opt) => (
                          <div
                            key={opt.id}
                            className={`p-3 rounded-xl border flex items-center justify-between text-xs font-semibold ${
                              opt.isCorrect
                                ? 'border-tertiary bg-tertiary-fixed/40 text-on-tertiary-fixed font-bold'
                                : 'border-outline-variant/40 bg-surface-container-lowest text-on-surface'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-5 h-5 rounded-md text-[11px] font-bold flex items-center justify-center ${
                                  opt.isCorrect ? 'bg-tertiary text-on-tertiary' : 'bg-surface-container text-on-surface'
                                }`}
                              >
                                {opt.id}
                              </span>
                              <span>{opt.text}</span>
                            </div>
                            {opt.isCorrect && (
                              <span className="material-symbols-outlined text-tertiary text-[18px]">check_circle</span>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Official Explanation */}
                      <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/50 flex flex-col gap-1.5">
                        <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-primary text-[18px]">lightbulb</span>
                          Step-by-Step Official Explanation
                        </span>
                        <p className="text-xs text-on-surface-variant leading-relaxed">{bm.explanation}</p>
                      </div>

                      {/* Personal Student Note */}
                      {bm.personalNote && (
                        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 flex items-start gap-2.5">
                          <span className="material-symbols-outlined text-amber-700 text-[18px] shrink-0 mt-0.5">
                            edit_note
                          </span>
                          <div>
                            <span className="text-xs font-bold text-amber-900 block">Your Personal Revision Note</span>
                            <p className="text-xs text-amber-800 mt-0.5">{bm.personalNote}</p>
                          </div>
                        </div>
                      )}

                      {/* AI Mentor Assistant Integration */}
                      <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                            Ask AI Mentor for Instant Alternative Explanation
                          </span>
                          <span className="text-[10px] text-on-surface-variant font-medium">Powered by TestPrep AI</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="e.g. Give me a 10-second mental shortcut or another real-life example..."
                            value={aiQuestion[bm.id] || ''}
                            onChange={(e) =>
                              setAiQuestion((prev) => ({
                                ...prev,
                                [bm.id]: e.target.value,
                              }))
                            }
                            className="flex-1 h-9 px-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/60 text-xs placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                          <button
                            type="button"
                            onClick={() => handleAskAi(bm.id)}
                            disabled={aiLoading[bm.id]}
                            className="h-9 px-4 rounded-xl bg-primary text-on-primary text-xs font-bold flex items-center gap-1.5 hover:bg-primary-container transition-colors disabled:opacity-50"
                          >
                            {aiLoading[bm.id] ? (
                              <>
                                <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                <span>Thinking...</span>
                              </>
                            ) : (
                              <>
                                <span>Ask AI</span>
                                <span className="material-symbols-outlined text-[16px]">send</span>
                              </>
                            )}
                          </button>
                        </div>

                        {aiAnswer[bm.id] && (
                          <div className="p-3 rounded-xl bg-surface-container-lowest border border-primary/30 text-xs text-on-surface leading-relaxed whitespace-pre-line">
                            {aiAnswer[bm.id]}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {filteredBookmarks.length === 0 && (
            <div className="p-12 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/60">
              <span className="material-symbols-outlined text-[48px] text-outline">bookmark_border</span>
              <p className="text-base font-bold text-on-surface mt-2">No bookmarks found</p>
              <p className="text-xs text-on-surface-variant mt-1">
                Bookmark questions during exam review to revisit them here anytime.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 2: Doubt Desk ────────────────────────────────────────────── */}
      {activeTab === 'doubts' && (
        <div className="p-8 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/60 flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[28px]">support_agent</span>
          </div>
          <h3 className="text-base font-bold text-on-surface">Live Mentor Doubt Resolution</h3>
          <p className="text-xs text-on-surface-variant max-w-md">
            You have 2 active doubt threads answered by verified faculty mentors. Average response time is under 15 minutes.
          </p>
          <button
            type="button"
            className="mt-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            Post New Doubt to Mentor
          </button>
        </div>
      )}

      {/* ─── TAB 3: Formula Sheets ────────────────────────────────────────── */}
      {activeTab === 'formulas' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Probability & Combinatorics', items: 14, tag: 'High Yield' },
            { title: 'Time, Speed & Distance Relatives', items: 9, tag: 'Aptitude' },
            { title: 'Data Structures & Big-O Complexities', items: 22, tag: 'Technical' },
          ].map((sheet) => (
            <div
              key={sheet.title}
              className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-col justify-between gap-3"
            >
              <div>
                <span className="px-2 py-0.5 rounded-md bg-surface-container text-primary text-[10px] font-bold">
                  {sheet.tag}
                </span>
                <h4 className="text-sm font-bold text-on-surface mt-2">{sheet.title}</h4>
                <p className="text-xs text-on-surface-variant mt-1">{sheet.items} formula flashcards included</p>
              </div>
              <button
                type="button"
                className="w-full py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-primary text-xs font-bold flex items-center justify-center gap-1 transition-colors"
              >
                <span>Open Flashcards</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}