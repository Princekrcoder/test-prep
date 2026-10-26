import { useEffect } from 'react';
import { useExamStore } from '@/stores/examStore';

interface Options {
  currentQuestionId: string | null;
  optionIds: string[];
  questionType: string;
  onTogglePalette: () => void;
}

export function useExamKeyboard({ currentQuestionId, optionIds, questionType, onTogglePalette }: Options) {
  const { cursor, sections, currentSectionIndex, goTo, selectOption, toggleMark, clearAnswer } = useExamStore();
  const totalInSection = sections[currentSectionIndex]?.questionIds.length ?? 0;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      switch (e.key) {
        case 'ArrowRight': case 'n': case 'N':
          e.preventDefault();
          if (cursor < totalInSection - 1) goTo(cursor + 1);
          break;
        case 'ArrowLeft': case 'p': case 'P':
          e.preventDefault();
          if (cursor > 0) goTo(cursor - 1);
          break;
        case 'm': case 'M':
          e.preventDefault();
          if (currentQuestionId) toggleMark(currentQuestionId);
          break;
        case 'c': case 'C':
          e.preventDefault();
          if (currentQuestionId) clearAnswer(currentQuestionId);
          break;
        case 'Escape':
          e.preventDefault();
          onTogglePalette();
          break;
        default: {
          let idx = -1;
          if (e.key >= '1' && e.key <= '5') idx = parseInt(e.key) - 1;
          else if (e.key.toUpperCase() >= 'A' && e.key.toUpperCase() <= 'E') idx = e.key.toUpperCase().charCodeAt(0) - 65;
          if (idx >= 0 && idx < optionIds.length && currentQuestionId && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            selectOption(currentQuestionId, optionIds[idx], questionType as any);
          }
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [cursor, currentQuestionId, optionIds, questionType, totalInSection, goTo, selectOption, toggleMark, clearAnswer, onTogglePalette]);
}
