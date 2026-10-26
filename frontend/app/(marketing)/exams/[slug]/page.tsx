import Link from 'next/link';
import { notFound } from 'next/navigation';

async function getExam(slug: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const res = await fetch(`${apiUrl}/exams/${slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch { return null; }
}

export default async function ExamDetailPage({ params }: { params: { slug: string } }) {
  const exam = await getExam(params.slug);
  if (!exam) notFound();

  const freePapers = exam.papers?.filter((p: any) => p.isFree) ?? [];
  const allPapers = exam.papers ?? [];

  return (
    <main className="min-h-screen bg-background">
      <nav className="h-16 flex items-center justify-between px-margin border-b border-outline-variant">
        <Link href="/" className="flex items-center gap-space-xs">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-on-primary font-display font-bold text-sm">T</span>
          </div>
          <span className="font-display font-bold text-headline-md text-on-surface">TestPrep</span>
        </Link>
        <div className="flex items-center gap-space-md">
          <Link href="/exams" className="text-label-lg text-on-surface-variant hover:text-on-surface transition-colors">&#8592; All Exams</Link>
          <Link href="/login" className="px-space-md py-space-xs bg-primary text-on-primary rounded-xl text-label-lg hover:opacity-90 transition-opacity">Sign In</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-margin py-space-xl">
        <div className="mb-space-xl">
          <span className="text-label-sm text-on-surface-variant uppercase tracking-wider">{exam.family === 'SERVICE_COMPANY' ? 'Placement Prep' : 'Government Exam'}</span>
          <h1 className="font-display text-headline-xl text-on-surface mt-space-xs mb-space-sm">{exam.name}</h1>
          {exam.summary && <p className="text-body-lg text-on-surface-variant">{exam.summary}</p>}
        </div>

        {freePapers.length > 0 && (
          <div className="bg-primary rounded-xl p-space-lg mb-space-xl text-on-primary">
            <h2 className="font-display text-headline-md mb-space-xs">Start with a free mock test</h2>
            <p className="text-body-md opacity-90 mb-space-md">No signup required for first attempt.</p>
            <Link href={`/login?next=/test/${freePapers[0].id}/instructions`} className="inline-flex items-center gap-space-xs px-space-lg py-space-sm bg-white text-primary rounded-xl text-label-lg font-semibold hover:opacity-90 transition-opacity">
              Take Free Mock &#8594; {freePapers[0].title}
            </Link>
          </div>
        )}

        <h2 className="font-display text-headline-lg text-on-surface mb-space-md">All Papers ({allPapers.length})</h2>
        <div className="flex flex-col gap-space-sm">
          {allPapers.map((paper: any) => (
            <Link key={paper.id} href={`/login?next=/test/${paper.id}/instructions`} className="flex items-center justify-between p-space-md bg-surface-container-lowest rounded-xl border border-outline-variant hover:border-primary hover:shadow-sm transition-all">
              <div>
                <div className="flex items-center gap-space-xs mb-space-2xs">
                  <span className="text-label-md text-on-surface font-semibold">{paper.title}</span>
                  {paper.isFree && <span className="px-space-xs py-0.5 rounded-full bg-tertiary-container text-on-tertiary-container text-label-sm">Free</span>}
                </div>
                <span className="text-body-sm text-on-surface-variant capitalize">{paper.difficulty?.toLowerCase()} &#8226; {Math.round(paper.durationSeconds / 60)} min</span>
              </div>
              <span className="text-primary text-label-lg font-semibold">Start &#8594;</span>
            </Link>
          ))}
        </div>
      </div>

      <footer className="border-t border-outline-variant mt-space-2xl py-space-lg px-margin text-center">
        <p className="text-body-sm text-on-surface-variant">TestPrep is not affiliated with, endorsed by, or sponsored by any company or examining body.</p>
      </footer>
    </main>
  );
}