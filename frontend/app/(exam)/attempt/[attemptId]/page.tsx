export default function AttemptPage({ params }: { params: { attemptId: string } }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-display text-headline-xl text-on-surface">Exam Engine</h1>
        <p className="text-body-md text-on-surface-variant mt-space-xs">
          Attempt ID: {params.attemptId} — implementation coming in Task 8.
        </p>
      </div>
    </div>
  );
}
