import { openDB } from 'idb';

interface IdbAnswer {
  questionId: string;
  selectedOptionIds: string[];
  numericValue: string | null;
  state: string;
  revision: number;
  timeSpentMs: number;
  savedAt: number;
}

function getDb(attemptId: string) {
  return openDB(`testprep-${attemptId}`, 1, {
    upgrade(db) {
      db.createObjectStore('answers', { keyPath: 'questionId' });
    },
  });
}

export async function idbSaveAnswer(attemptId: string, answer: Omit<IdbAnswer, 'savedAt'>) {
  const db = await getDb(attemptId);
  await db.put('answers', { ...answer, savedAt: Date.now() });
}

export async function idbGetAllAnswers(attemptId: string): Promise<IdbAnswer[]> {
  try {
    const db = await getDb(attemptId);
    return db.getAll('answers');
  } catch {
    return [];
  }
}

export async function idbClearAttempt(attemptId: string) {
  const db = await getDb(attemptId);
  await db.clear('answers');
}