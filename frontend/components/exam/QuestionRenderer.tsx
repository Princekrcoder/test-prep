'use client';

import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

export interface OptionItem {
  id: string;
  order: number;
  bodyMd: string;
  isCorrect?: boolean;
}

interface Props {
  questionId: string;
  questionNumber?: number;
  stemMd: string;
  options: OptionItem[];
  questionType?: string;
  selectedOptionIds: string[];
  onSelect: (optionId: string) => void;
  showAnswer?: boolean;
  correctOptionIds?: string[];
  hintMd?: string;
  marksCorrect?: number;
  marksIncorrect?: number;
  conceptTag?: string;
}

const LABELS = ['A', 'B', 'C', 'D', 'E', 'F'];

export function QuestionRenderer({
  questionId,
  questionNumber,
  stemMd,
  options,
  questionType = 'MCQ_SINGLE',
  selectedOptionIds,
  onSelect,
  showAnswer = false,
  correctOptionIds = [],
  hintMd,
  marksCorrect = 1.0,
  marksIncorrect = 0.25,
  conceptTag,
}: Props) {
  const isMulti = questionType === 'MCQ_MULTI';

  return (
    <div className="flex flex-col gap-space-lg">
      {/* Question Formulation Area */}
      <div className="space-y-space-md">
        <div className="text-body-lg text-on-surface leading-relaxed font-normal prose prose-sm max-w-none text-slate-900">
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
              strong: ({ children }) => <strong className="font-semibold text-primary">{children}</strong>,
            }}
          >
            {stemMd}
          </ReactMarkdown>
        </div>

        {/* Technical Concept Note / Formula Hint Box */}
        {hintMd && (
          <div className="bg-surface-container-low/80 border border-outline-variant/40 p-space-md rounded-xl flex items-start gap-space-sm text-on-surface-variant text-body-sm shadow-xs">
            <span className="material-symbols-outlined text-primary text-[20px] flex-shrink-0 mt-0.5">
              tips_and_updates
            </span>
            <div className="leading-relaxed">
              <span className="font-bold text-on-surface mr-1.5">Standard CBT Concept Note:</span>
              <ReactMarkdown components={{ p: ({ children }) => <span>{children}</span> }}>
                {hintMd}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {conceptTag && (
          <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-[15px] text-primary">label</span>
            <span className="font-medium">Topic:</span>
            <span className="px-2 py-0.5 rounded-md bg-surface-container font-semibold text-primary">
              {conceptTag}
            </span>
          </div>
        )}
      </div>

      {/* Multiple Choice Options Group */}
      <fieldset className="flex flex-col gap-space-sm" id={`mcq-group-${questionId}`}>
        <legend className="sr-only">Choose the correct answer for question {questionNumber ?? ''}</legend>

        {[...options].sort((a, b) => a.order - b.order).map((opt, i) => {
          const isSelected = selectedOptionIds.includes(opt.id);
          const isCorrect = showAnswer && correctOptionIds.includes(opt.id);
          const isWrong = showAnswer && isSelected && !correctOptionIds.includes(opt.id);
          const letter = LABELS[i] || String.fromCharCode(65 + i);

          return (
            <label
              key={opt.id}
              onClick={(e) => {
                if (!showAnswer) {
                  onSelect(opt.id);
                }
              }}
              className={cn(
                'group relative flex items-center gap-space-md p-space-md rounded-xl border-2 transition-all cursor-pointer select-none shadow-xs',
                showAnswer
                  ? isCorrect
                    ? 'border-tertiary bg-tertiary-fixed/30 text-on-surface font-medium'
                    : isWrong
                    ? 'border-error bg-error-container/40 text-on-surface'
                    : 'border-outline-variant/40 bg-surface-container-lowest opacity-80'
                  : isSelected
                  ? 'border-primary bg-primary/5 shadow-md shadow-primary/10'
                  : 'border-outline-variant/40 bg-surface-container-lowest hover:border-primary/50 hover:bg-surface-container-low'
              )}
            >
              <input
                type={isMulti ? 'checkbox' : 'radio'}
                name={`opt-${questionId}`}
                value={opt.id}
                checked={isSelected}
                onChange={() => {
                  if (!showAnswer) onSelect(opt.id);
                }}
                className="peer sr-only"
                aria-label={`Option ${letter}`}
              />

              {/* Alphabetical Index Circle */}
              <div
                className={cn(
                  'w-9 h-9 rounded-full flex items-center justify-center font-headline-md text-headline-md font-bold transition-all flex-shrink-0 shadow-xs',
                  showAnswer
                    ? isCorrect
                      ? 'bg-tertiary text-on-tertiary'
                      : isWrong
                      ? 'bg-error text-on-error'
                      : 'bg-surface-container text-on-surface-variant'
                    : isSelected
                    ? 'bg-primary text-on-primary ring-2 ring-primary/30'
                    : 'bg-surface-container text-on-surface-variant group-hover:bg-primary-fixed group-hover:text-on-primary-fixed'
                )}
              >
                {letter}
              </div>

              {/* Option Body */}
              <div
                className={cn(
                  'flex-1 text-body-lg text-on-surface leading-snug transition-colors',
                  isSelected && !showAnswer && 'font-medium text-primary'
                )}
              >
                <ReactMarkdown components={{ p: ({ children }) => <span>{children}</span> }}>
                  {opt.bodyMd}
                </ReactMarkdown>
              </div>

              {/* Selection Check Indicator */}
              <div
                className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all',
                  showAnswer
                    ? isCorrect
                      ? 'bg-tertiary text-on-tertiary opacity-100'
                      : isWrong
                      ? 'bg-error text-on-error opacity-100'
                      : 'opacity-0'
                    : isSelected
                    ? 'bg-primary text-on-primary opacity-100 scale-100'
                    : 'bg-surface-container text-transparent opacity-0 scale-75 group-hover:opacity-40'
                )}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {showAnswer && isWrong ? 'close' : 'check'}
                </span>
              </div>
            </label>
          );
        })}
      </fieldset>
    </div>
  );
}
