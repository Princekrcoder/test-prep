// Bare layout for exam — no sidebar, no topbar, no analytics scripts
// This layout keeps the exam route isolated and the bundle small
export default function ExamLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
