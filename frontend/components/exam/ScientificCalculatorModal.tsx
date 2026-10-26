'use client';

import { useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function ScientificCalculatorModal({ isOpen, onClose }: Props) {
  const [expression, setExpression] = useState('72 * (5/18)');
  const [result, setResult] = useState('20');

  if (!isOpen) return null;

  const handleInput = (val: string) => {
    setExpression((prev) => (prev === '0' ? val : prev + val));
  };

  const handleClear = () => {
    setExpression('');
    setResult('');
  };

  const handleBackspace = () => {
    setExpression((prev) => prev.slice(0, -1));
  };

  const handleSqrt = () => {
    try {
      // Evaluate current expression then take sqrt
      // eslint-disable-next-line no-eval
      const evaluated = Function(`'use strict'; return (${expression.replace(/×/g, '*').replace(/÷/g, '/')})`)();
      const sqrtVal = Math.sqrt(Number(evaluated));
      setResult(String(Math.round(sqrtVal * 10000) / 10000));
      setExpression(`√(${evaluated})`);
    } catch {
      setResult('Error');
    }
  };

  const handleCalculate = () => {
    try {
      const sanitized = expression.replace(/×/g, '*').replace(/÷/g, '/');
      // eslint-disable-next-line no-eval
      const evalResult = Function(`'use strict'; return (${sanitized})`)();
      setResult(String(Math.round(Number(evalResult) * 10000) / 10000));
    } catch {
      setResult('Error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-sm flex items-center justify-center p-space-md animate-fade-in">
      <div className="bg-surface-container-lowest w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-outline-variant/40">
        {/* Header */}
        <div className="bg-surface-container px-space-md py-space-sm flex items-center justify-between border-b border-outline-variant/30">
          <div className="flex items-center gap-space-xs text-on-surface font-headline-md text-headline-md font-bold">
            <span className="material-symbols-outlined text-primary text-[20px]">calculate</span>
            <span>Virtual Scientific Calculator</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container-high hover:bg-surface-variant text-on-surface flex items-center justify-center transition-colors"
            type="button"
            aria-label="Close Calculator"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Display */}
        <div className="p-space-md flex flex-col gap-space-sm">
          <div className="bg-surface-container-high p-space-md rounded-xl text-right font-mono shadow-inner min-h-[72px] flex flex-col justify-end">
            <span className="text-xs text-on-surface-variant/70 tracking-wider truncate">
              {expression || '0'}
            </span>
            <span className="text-2xl font-bold text-on-surface truncate">
              {result ? `= ${result}` : expression || '0'}
            </span>
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={handleClear}
              className="p-3 rounded-lg bg-surface-container text-error font-bold hover:bg-surface-container-high transition-colors"
              type="button"
            >
              C
            </button>
            <button
              onClick={() => handleInput('(')}
              className="p-3 rounded-lg bg-surface-container text-on-surface font-semibold hover:bg-surface-container-high transition-colors"
              type="button"
            >
              (
            </button>
            <button
              onClick={() => handleInput(')')}
              className="p-3 rounded-lg bg-surface-container text-on-surface font-semibold hover:bg-surface-container-high transition-colors"
              type="button"
            >
              )
            </button>
            <button
              onClick={() => handleInput('÷')}
              className="p-3 rounded-lg bg-primary-fixed text-on-primary-fixed font-bold hover:bg-primary hover:text-on-primary transition-colors"
              type="button"
            >
              ÷
            </button>

            <button
              onClick={() => handleInput('7')}
              className="p-3 rounded-lg bg-surface-container-low text-on-surface font-semibold hover:bg-surface-container transition-colors"
              type="button"
            >
              7
            </button>
            <button
              onClick={() => handleInput('8')}
              className="p-3 rounded-lg bg-surface-container-low text-on-surface font-semibold hover:bg-surface-container transition-colors"
              type="button"
            >
              8
            </button>
            <button
              onClick={() => handleInput('9')}
              className="p-3 rounded-lg bg-surface-container-low text-on-surface font-semibold hover:bg-surface-container transition-colors"
              type="button"
            >
              9
            </button>
            <button
              onClick={() => handleInput('×')}
              className="p-3 rounded-lg bg-primary-fixed text-on-primary-fixed font-bold hover:bg-primary hover:text-on-primary transition-colors"
              type="button"
            >
              ×
            </button>

            <button
              onClick={() => handleInput('4')}
              className="p-3 rounded-lg bg-surface-container-low text-on-surface font-semibold hover:bg-surface-container transition-colors"
              type="button"
            >
              4
            </button>
            <button
              onClick={() => handleInput('5')}
              className="p-3 rounded-lg bg-surface-container-low text-on-surface font-semibold hover:bg-surface-container transition-colors"
              type="button"
            >
              5
            </button>
            <button
              onClick={() => handleInput('6')}
              className="p-3 rounded-lg bg-surface-container-low text-on-surface font-semibold hover:bg-surface-container transition-colors"
              type="button"
            >
              6
            </button>
            <button
              onClick={() => handleInput('-')}
              className="p-3 rounded-lg bg-primary-fixed text-on-primary-fixed font-bold hover:bg-primary hover:text-on-primary transition-colors"
              type="button"
            >
              -
            </button>

            <button
              onClick={() => handleInput('1')}
              className="p-3 rounded-lg bg-surface-container-low text-on-surface font-semibold hover:bg-surface-container transition-colors"
              type="button"
            >
              1
            </button>
            <button
              onClick={() => handleInput('2')}
              className="p-3 rounded-lg bg-surface-container-low text-on-surface font-semibold hover:bg-surface-container transition-colors"
              type="button"
            >
              2
            </button>
            <button
              onClick={() => handleInput('3')}
              className="p-3 rounded-lg bg-surface-container-low text-on-surface font-semibold hover:bg-surface-container transition-colors"
              type="button"
            >
              3
            </button>
            <button
              onClick={() => handleInput('+')}
              className="p-3 rounded-lg bg-primary-fixed text-on-primary-fixed font-bold hover:bg-primary hover:text-on-primary transition-colors"
              type="button"
            >
              +
            </button>

            <button
              onClick={() => handleInput('0')}
              className="p-3 rounded-lg bg-surface-container-low text-on-surface font-semibold hover:bg-surface-container transition-colors"
              type="button"
            >
              0
            </button>
            <button
              onClick={() => handleInput('.')}
              className="p-3 rounded-lg bg-surface-container-low text-on-surface font-semibold hover:bg-surface-container transition-colors"
              type="button"
            >
              .
            </button>
            <button
              onClick={handleSqrt}
              className="p-3 rounded-lg bg-surface-container text-on-surface font-semibold hover:bg-surface-container-high transition-colors"
              type="button"
            >
              √
            </button>
            <button
              onClick={handleCalculate}
              className="p-3 rounded-lg bg-primary text-on-primary font-bold shadow-md hover:bg-primary-container transition-all"
              type="button"
            >
              =
            </button>
          </div>

          <div className="flex items-center justify-between pt-1 text-[11px] text-on-surface-variant">
            <span>Standard CBT Mode</span>
            <button
              onClick={handleBackspace}
              className="text-primary hover:underline flex items-center gap-0.5"
            >
              <span className="material-symbols-outlined text-[14px]">backspace</span> Backspace
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
