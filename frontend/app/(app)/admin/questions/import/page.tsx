'use client';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';

export default function ImportQuestionsPage() {
  const [jsonText, setJsonText] = useState('');
  const [result, setResult] = useState<any>(null);

  const importMutation = useMutation({
    mutationFn: (questions: any[]) => api.post<any>('/admin/questions/import', { questions }),
    onSuccess: (data) => setResult(data),
    onError: (err: any) => setResult({ error: err.message }),
  });

  const handleImport = () => {
    try {
      const parsed = JSON.parse(jsonText);
      const questions = Array.isArray(parsed) ? parsed : [parsed];
      importMutation.mutate(questions);
    } catch {
      setResult({ error: 'Invalid JSON. Please check your input.' });
    }
  };

  const exampleJson = JSON.stringify([
    {
      topicSlug: "time-and-work",
      type: "MCQ_SINGLE",
      difficulty: "MEDIUM",
      stemMd: "A can complete a work in 12 days and B in 18 days. Together they finish in?",
      explanationMd: "A's 1 day = 1/12, B's 1 day = 1/18. Together = 5/36. Days = 36/5 = 7.2",
      options: [
        { order: 0, bodyMd: "6 days", isCorrect: false },
        { order: 1, bodyMd: "7.2 days", isCorrect: true },
        { order: 2, bodyMd: "8 days", isCorrect: false },
        { order: 3, bodyMd: "9 days", isCorrect: false }
      ]
    }
  ], null, 2);

  return (
    <div className="max-w-3xl flex flex-col gap-space-lg">
      <div>
        <h1 className="font-display text-headline-xl text-on-surface">Import Questions</h1>
        <p className="text-body-md text-on-surface-variant mt-space-xs">
          Paste a JSON array of questions. All rows are validated before any are imported.
        </p>
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-space-lg">
        <div className="flex items-center justify-between mb-space-sm">
          <label className="text-label-lg text-on-surface font-semibold">JSON Input</label>
          <button onClick={() => setJsonText(exampleJson)} className="text-label-sm text-primary hover:underline">
            Load example
          </button>
        </div>
        <textarea
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          placeholder="Paste JSON array here..."
          className="w-full h-64 p-space-md bg-surface-container-low rounded-xl border border-outline-variant text-body-sm font-mono text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y"
        />
      </div>

      <Button onClick={handleImport} disabled={importMutation.isPending || !jsonText.trim()}>
        {importMutation.isPending ? 'Importing...' : 'Import Questions'}
      </Button>

      {result && (
        <div className={`p-space-lg rounded-xl border ${result.error ? 'border-error bg-error-container' : result.errors?.length ? 'border-yellow-400 bg-yellow-50' : 'border-tertiary bg-tertiary/10'}`}>
          {result.error ? (
            <p className="text-error font-semibold">{result.error}</p>
          ) : (
            <>
              <p className={`font-semibold ${result.errors?.length ? 'text-yellow-800' : 'text-tertiary'}`}>
                {result.imported > 0 ? `✓ Imported ${result.imported} question(s) successfully` : 'Import failed — no questions were imported'}
              </p>
              {result.errors?.map((e: any) => (
                <p key={e.row} className="text-body-sm text-error mt-space-xs">Row {e.row}: {e.reason}</p>
              ))}
            </>
          )}
        </div>
      )}

      <div className="bg-surface-container rounded-xl p-space-lg">
        <h3 className="text-label-lg text-on-surface font-semibold mb-space-sm">Required Format</h3>
        <pre className="text-body-sm text-on-surface-variant overflow-x-auto">{exampleJson}</pre>
      </div>
    </div>
  );
}