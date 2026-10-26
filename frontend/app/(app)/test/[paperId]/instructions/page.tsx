'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getMockPaper } from '@/lib/mockTestData';
import { StartTestButton } from './StartTestButton';

export default function InstructionsPage() {
  const params = useParams<{ paperId: string }>();
  const paperId = params?.paperId || 'tcs-nqt-05';
  const paper = getMockPaper(paperId);

  const [declarationChecked, setDeclarationChecked] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi'>('en');
  const [diagnosticOpen, setDiagnosticOpen] = useState(false);

  const durationMin = Math.round(paper.durationSeconds / 60);
  const totalQuestions = paper.questions.length;

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-space-lg">
      {/* Back Link */}
      <div className="flex items-center justify-between">
        <Link
          href="/tests"
          className="inline-flex items-center gap-1.5 text-label-md text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Back to Mock Test Library</span>
        </Link>

        <span className="text-xs bg-surface-container px-2.5 py-1 rounded-full text-on-surface-variant font-medium">
          CBT Assessment Standard v3.4
        </span>
      </div>

      {/* Top Context & Quick Controls Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-space-md bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-outline-variant/40">
        <div className="flex items-start sm:items-center gap-space-md">
          <div className="w-14 h-14 rounded-2xl bg-secondary-container flex items-center justify-center text-primary flex-shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-[32px]">assignment_turned_in</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-space-xs flex-wrap">
              <span className="bg-primary-container text-on-primary-container px-2.5 py-0.5 rounded-full font-label-sm text-label-sm uppercase tracking-wider font-semibold">
                National CBT Stage-1
              </span>
              <span className="bg-surface-container text-on-surface-variant px-2.5 py-0.5 rounded-full font-label-sm text-label-sm flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
                Live Proctored
              </span>
              <span className="font-label-sm text-label-sm text-outline-variant">•</span>
              <span className="font-label-sm text-label-sm text-secondary font-mono font-semibold">
                Code: {paper.examCode}
              </span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface mt-1 font-bold">
              {paper.title}
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
              {paper.description}
            </p>
          </div>
        </div>

        {/* Language Switcher & Diagnostic Action */}
        <div className="flex items-center gap-space-sm self-start lg:self-center flex-wrap">
          <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-xl border border-outline-variant/30">
            <span className="material-symbols-outlined text-secondary text-[20px]">translate</span>
            <label className="font-label-md text-label-md text-secondary" htmlFor="lang-selector">
              Medium:
            </label>
            <select
              id="lang-selector"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value as 'en' | 'hi')}
              className="bg-transparent font-headline-md text-headline-md text-on-surface focus:outline-none cursor-pointer pr-1 font-bold text-xs"
            >
              <option value="en">English (UK/IN)</option>
              <option value="hi">हिंदी (Hindi)</option>
            </select>
          </div>

          <button
            onClick={() => setDiagnosticOpen(true)}
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface rounded-xl font-label-md text-label-md border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[18px] text-tertiary">check_circle</span>
            <span>System Verified</span>
          </button>
        </div>
      </div>

      {/* Exam Parameters Snapshot Matrix */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md">
        <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-outline-variant/40 flex items-center gap-space-md">
          <div className="w-12 h-12 rounded-xl bg-surface-container-low text-primary flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[26px]">timer</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
              Exam Duration
            </span>
            <span className="font-headline-lg text-headline-lg text-on-surface font-bold">
              {durationMin} Minutes
            </span>
            <span className="font-body-sm text-body-sm text-secondary truncate">
              Continuous session clock
            </span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-outline-variant/40 flex items-center gap-space-md">
          <div className="w-12 h-12 rounded-xl bg-surface-container-low text-primary flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[26px]">help_center</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
              Total Questions
            </span>
            <span className="font-headline-lg text-headline-lg text-on-surface font-bold">
              {totalQuestions} Items
            </span>
            <span className="font-body-sm text-body-sm text-secondary truncate">
              {paper.sections.length} Standard Sections
            </span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-outline-variant/40 flex items-center gap-space-md">
          <div className="w-12 h-12 rounded-xl bg-surface-container-low text-tertiary flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[26px]">grade</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
              Maximum Marks
            </span>
            <span className="font-headline-lg text-headline-lg text-on-surface font-bold">
              {paper.totalMarks}.0 Marks
            </span>
            <span className="font-body-sm text-body-sm text-secondary truncate">
              Cutoff benchmark: {paper.cutoffMarks}.0
            </span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-outline-variant/40 flex items-center gap-space-md">
          <div className="w-12 h-12 rounded-xl bg-surface-container-low text-error flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[26px]">balance</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
              Marking Rule
            </span>
            <span className="font-headline-lg text-headline-lg text-on-surface font-bold">
              +1.0 / -0.25
            </span>
            <span className="font-body-sm text-body-sm text-error truncate font-medium">
              Negative marking enabled
            </span>
          </div>
        </div>
      </div>

      {/* Main Workspace Split (8 Cols / 4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        {/* Primary Instructions Column (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-space-lg">
          {/* Sectional Distribution Breakdown */}
          <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-outline-variant/40 flex flex-col gap-space-md">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">format_list_bulleted</span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                  Sectional Distribution & Timings
                </h2>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container px-2.5 py-1 rounded-full font-medium">
                {paper.sections.length} Sections • Flexible Navigation
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
              {paper.sections.map((section, idx) => (
                <div
                  key={section.id}
                  className="bg-surface p-space-md rounded-xl flex flex-col justify-between gap-space-md border border-outline-variant/30"
                >
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-label-sm text-label-sm uppercase font-bold text-primary">
                        Section {idx + 1}
                      </span>
                      <span className="text-[11px] text-tertiary font-bold bg-tertiary-fixed/30 px-2 py-0.5 rounded-full">
                        +{section.marksCorrect} / -{section.marksIncorrect}
                      </span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                      {section.name}
                    </h3>
                    <p className="text-body-sm text-on-surface-variant mt-1">
                      {section.questionIds.length} Multiple Choice Questions
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-outline-variant/20 font-medium">
                    <span className="text-on-surface-variant">Recommended Time:</span>
                    <span className="font-bold text-on-surface">
                      {Math.round(section.durationSeconds / 60)} Mins
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Question Palette Symbols Guide */}
          <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-outline-variant/40 flex flex-col gap-space-md">
            <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/30">
              <span className="material-symbols-outlined text-primary text-[22px]">palette</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                Question Palette Symbols & Status Guide
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm text-xs">
              <div className="flex items-center gap-3 p-space-sm rounded-xl bg-surface-container-low border border-outline-variant/30">
                <span className="w-8 h-8 rounded-lg bg-surface-container-lowest border border-outline-variant text-outline flex items-center justify-center font-bold text-sm shadow-xs">
                  01
                </span>
                <div>
                  <span className="font-bold text-on-surface block">Not Visited</span>
                  <span className="text-on-surface-variant">You have not visited the question yet.</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-space-sm rounded-xl bg-surface-container-low border border-outline-variant/30">
                <span className="w-8 h-8 rounded-lg bg-error-container text-on-error-container border border-error/40 flex items-center justify-center font-bold text-sm">
                  02
                </span>
                <div>
                  <span className="font-bold text-on-surface block">Not Answered</span>
                  <span className="text-on-surface-variant">Visited but no option was chosen.</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-space-sm rounded-xl bg-surface-container-low border border-outline-variant/30">
                <span className="w-8 h-8 rounded-lg bg-tertiary text-on-tertiary flex items-center justify-center font-bold text-sm shadow-xs">
                  03
                </span>
                <div>
                  <span className="font-bold text-on-surface block">Answered</span>
                  <span className="text-on-surface-variant">You have answered the question.</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-space-sm rounded-xl bg-surface-container-low border border-outline-variant/30">
                <span className="w-8 h-8 rounded-lg bg-secondary-container text-on-secondary-fixed flex items-center justify-center font-bold text-sm">
                  04
                </span>
                <div>
                  <span className="font-bold text-on-surface block">Marked for Review</span>
                  <span className="text-on-surface-variant">Flagged to review before final submission.</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-space-sm rounded-xl bg-surface-container-low border border-outline-variant/30 col-span-1 sm:col-span-2">
                <span className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold text-sm shadow-xs ring-2 ring-secondary/40">
                  05
                </span>
                <div>
                  <span className="font-bold text-on-surface block">Answered & Marked for Review</span>
                  <span className="text-on-surface-variant">
                    Option is selected and flagged. This response **WILL** be evaluated in your final score.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* General Rules & Security Protocols */}
          <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-outline-variant/40 flex flex-col gap-space-sm">
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">gavel</span>
              Examination Protocol & Technical Guidelines
            </h2>
            <ul className="list-disc pl-space-lg space-y-2 text-body-sm text-on-surface-variant leading-relaxed">
              <li>
                <strong>Clock Synchronization:</strong> The countdown clock is synchronized with the assessment engine. When the timer hits 00:00:00, the test will automatically seal and submit.
              </li>
              <li>
                <strong>Auto-Save Stream:</strong> Every option selection and state update is persistently saved on your local device and cloud stream every 3 seconds.
              </li>
              <li>
                <strong>Navigation Flexibility:</strong> You may navigate across sections and questions in any order using the question palette or Previous / Next buttons.
              </li>
              <li>
                <strong>Proctoring Notice:</strong> Full-screen integrity and window blur events are recorded in your session diagnostic log.
              </li>
            </ul>
          </div>
        </div>

        {/* Right Candidate Verification & Launch Rail (4 Cols) */}
        <aside className="lg:col-span-4 flex flex-col gap-space-lg sticky top-24">
          {/* Candidate Profile Snapshot Card */}
          <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-outline-variant/40 flex flex-col gap-space-md">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                Candidate Verification
              </span>
              <span className="text-xs text-tertiary font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">verified</span>
                Verified ID
              </span>
            </div>

            <div className="flex items-center gap-space-md">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl shadow-inner border border-primary/20">
                <span className="material-symbols-outlined text-[36px]">person</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-headline-md text-headline-md text-on-surface font-bold truncate">
                  Prince Kumar
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant font-mono font-medium">
                  Roll #TP-982143
                </span>
                <span className="text-xs text-primary font-semibold flex items-center gap-0.5 mt-0.5">
                  <span className="material-symbols-outlined text-[14px]">desktop_windows</span>
                  Station 14 • Hall B
                </span>
              </div>
            </div>

            <div className="p-space-sm rounded-xl bg-surface-container-low text-xs text-on-surface-variant space-y-1 border border-outline-variant/30">
              <div className="flex justify-between">
                <span>Registration Status:</span>
                <span className="font-bold text-tertiary">Biometrics Matched</span>
              </div>
              <div className="flex justify-between">
                <span>Assessment Mode:</span>
                <span className="font-bold text-on-surface">Proctored CBT Stage-1</span>
              </div>
            </div>
          </div>

          {/* Legal Undertaking Checkbox & CTA Card */}
          <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-outline-variant/40 flex flex-col gap-space-md">
            <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
              Declaration of Readiness
            </h3>

            <label className="flex items-start gap-space-sm cursor-pointer select-none">
              <input
                type="checkbox"
                checked={declarationChecked}
                onChange={(e) => setDeclarationChecked(e.target.checked)}
                className="w-5 h-5 rounded mt-0.5 text-primary border-outline focus:ring-primary cursor-pointer accent-primary"
              />
              <span className="text-body-sm text-on-surface leading-relaxed">
                I have read, understood and agree to all the examination rules. I confirm that all hardware, camera, and network diagnostic tests are clear.
              </span>
            </label>

            {/* Start Test CTA */}
            <StartTestButton
              paperId={paperId}
              hasConfirmedDeclaration={declarationChecked}
            />

            <span className="text-[11px] text-center text-on-surface-variant block">
              Clicking proceed will activate full-screen assessment mode.
            </span>
          </div>
        </aside>
      </div>

      {/* System Diagnostic Modal */}
      {diagnosticOpen && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-sm flex items-center justify-center p-space-md animate-fade-in">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-2xl p-space-xl flex flex-col gap-space-md border border-outline-variant/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary text-[26px]">check_circle</span>
                <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                  System Diagnostic Passed
                </h3>
              </div>
              <button
                onClick={() => setDiagnosticOpen(false)}
                type="button"
                className="text-on-surface-variant hover:text-on-surface"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-space-sm rounded-xl bg-surface-container-low flex justify-between items-center">
                <span>Webcam & Microphone Feed</span>
                <span className="text-tertiary font-bold">Operational ✓</span>
              </div>
              <div className="p-space-sm rounded-xl bg-surface-container-low flex justify-between items-center">
                <span>Browser Resolution & Canvas</span>
                <span className="text-tertiary font-bold">1920 x 1080 Optimal ✓</span>
              </div>
              <div className="p-space-sm rounded-xl bg-surface-container-low flex justify-between items-center">
                <span>Assessment Stream Latency</span>
                <span className="text-tertiary font-bold">18 ms (High Speed) ✓</span>
              </div>
              <div className="p-space-sm rounded-xl bg-surface-container-low flex justify-between items-center">
                <span>IndexedDB Offline Storage Cache</span>
                <span className="text-tertiary font-bold">Encrypted & Ready ✓</span>
              </div>
            </div>

            <button
              onClick={() => setDiagnosticOpen(false)}
              type="button"
              className="w-full py-2.5 bg-primary text-on-primary rounded-xl font-bold text-xs"
            >
              Close Diagnostic
            </button>
          </div>
        </div>
      )}
    </div>
  );
}