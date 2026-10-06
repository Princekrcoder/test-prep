import { PrismaClient, Difficulty, QuestionStatus, QuestionType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ─── Topic Tree ────────────────────────────────────────────────────────
  const aptitude = await prisma.topic.upsert({
    where: { slug: 'aptitude' },
    update: {},
    create: { slug: 'aptitude', name: 'Quantitative Aptitude' },
  });

  const verbal = await prisma.topic.upsert({
    where: { slug: 'verbal' },
    update: {},
    create: { slug: 'verbal', name: 'Verbal Ability' },
  });

  const logical = await prisma.topic.upsert({
    where: { slug: 'logical' },
    update: {},
    create: { slug: 'logical', name: 'Logical Reasoning' },
  });

  const programming = await prisma.topic.upsert({
    where: { slug: 'programming' },
    update: {},
    create: { slug: 'programming', name: 'Programming Concepts' },
  });

  // Sub-topics
  const arithmetic = await prisma.topic.upsert({
    where: { slug: 'arithmetic' },
    update: {},
    create: { slug: 'arithmetic', name: 'Arithmetic', parentId: aptitude.id },
  });

  const timeWork = await prisma.topic.upsert({
    where: { slug: 'time-and-work' },
    update: {},
    create: { slug: 'time-and-work', name: 'Time and Work', parentId: arithmetic.id },
  });

  const algebra = await prisma.topic.upsert({
    where: { slug: 'algebra' },
    update: {},
    create: { slug: 'algebra', name: 'Algebra', parentId: aptitude.id },
  });

  console.log('✅ Topics created');

  // ─── Exam ──────────────────────────────────────────────────────────────
  const tcsNqt = await prisma.exam.upsert({
    where: { slug: 'tcs-nqt' },
    update: {},
    create: {
      slug: 'tcs-nqt',
      name: 'TCS NQT Pattern',
      family: 'SERVICE_COMPANY',
      summary: 'Comprehensive mock tests modelled on the TCS National Qualifier Test pattern.',
      iconKey: 'tcs',
      sortOrder: 1,
      isActive: true,
    },
  });

  const infosys = await prisma.exam.upsert({
    where: { slug: 'infosys-sp' },
    update: {},
    create: {
      slug: 'infosys-sp',
      name: 'Infosys SP Pattern',
      family: 'SERVICE_COMPANY',
      summary: 'Mock tests modelled on the Infosys System Engineer / SP selection pattern.',
      iconKey: 'infosys',
      sortOrder: 2,
      isActive: true,
    },
  });

  console.log('✅ Exams created');

  // ─── Test Paper ────────────────────────────────────────────────────────
  const paper = await prisma.testPaper.upsert({
    where: { examId_slug: { examId: tcsNqt.id, slug: 'mock-01' } },
    update: {},
    create: {
      examId: tcsNqt.id,
      slug: 'mock-01',
      title: 'TCS NQT Pattern — Mock Test 01',
      description: 'Full-length mock test with Numerical Ability, Verbal Ability, and Reasoning sections.',
      timingMode: 'WHOLE_PAPER',
      durationSeconds: 60 * 60, // 60 minutes
      difficulty: 'MEDIUM',
      isFree: true,
      isPyp: false,
      availableLocales: ['EN'],
      publishedAt: new Date(),
      scoringVersion: 1,
    },
  });

  // ─── Sections ──────────────────────────────────────────────────────────
  const section1 = await prisma.testSection.upsert({
    where: { paperId_order: { paperId: paper.id, order: 1 } },
    update: {},
    create: {
      paperId: paper.id,
      name: 'Quantitative Aptitude',
      order: 1,
      durationSeconds: null,
      marksCorrect: 1,
      marksIncorrect: 0.25,
      lockOnExit: false,
    },
  });

  const section2 = await prisma.testSection.upsert({
    where: { paperId_order: { paperId: paper.id, order: 2 } },
    update: {},
    create: {
      paperId: paper.id,
      name: 'Verbal Ability',
      order: 2,
      durationSeconds: null,
      marksCorrect: 1,
      marksIncorrect: 0.25,
      lockOnExit: false,
    },
  });

  console.log('✅ Paper and sections created');

  // ─── Questions ────────────────────────────────────────────────────────

  const questionsData = [
    // Quantitative Aptitude questions
    {
      topicId: timeWork.id,
      stemMd: 'A can complete a work in 12 days and B can complete the same work in 18 days. In how many days can they complete the work together?',
      explanationMd: 'A\'s one day work = 1/12, B\'s one day work = 1/18. Together = 1/12 + 1/18 = 3/36 + 2/36 = 5/36. Days = 36/5 = **7.2 days**.',
      difficulty: 'MEDIUM' as Difficulty,
      options: [
        { order: 0, bodyMd: '6 days', isCorrect: false },
        { order: 1, bodyMd: '7.2 days', isCorrect: true },
        { order: 2, bodyMd: '8 days', isCorrect: false },
        { order: 3, bodyMd: '9 days', isCorrect: false },
      ],
      section: section1,
      sectionOrder: 1,
    },
    {
      topicId: algebra.id,
      stemMd: 'If 3x + 7 = 22, what is the value of x?',
      explanationMd: '3x = 22 - 7 = 15. Therefore x = 15/3 = **5**.',
      difficulty: 'EASY' as Difficulty,
      options: [
        { order: 0, bodyMd: '3', isCorrect: false },
        { order: 1, bodyMd: '4', isCorrect: false },
        { order: 2, bodyMd: '5', isCorrect: true },
        { order: 3, bodyMd: '6', isCorrect: false },
      ],
      section: section1,
      sectionOrder: 2,
    },
    {
      topicId: arithmetic.id,
      stemMd: 'A train travels 360 km in 4 hours. What is its speed in km/h?',
      explanationMd: 'Speed = Distance / Time = 360 / 4 = **90 km/h**.',
      difficulty: 'EASY' as Difficulty,
      options: [
        { order: 0, bodyMd: '80 km/h', isCorrect: false },
        { order: 1, bodyMd: '90 km/h', isCorrect: true },
        { order: 2, bodyMd: '100 km/h', isCorrect: false },
        { order: 3, bodyMd: '120 km/h', isCorrect: false },
      ],
      section: section1,
      sectionOrder: 3,
    },
    {
      topicId: arithmetic.id,
      stemMd: 'What is 15% of 240?',
      explanationMd: '15% of 240 = (15/100) × 240 = 0.15 × 240 = **36**.',
      difficulty: 'EASY' as Difficulty,
      options: [
        { order: 0, bodyMd: '32', isCorrect: false },
        { order: 1, bodyMd: '34', isCorrect: false },
        { order: 2, bodyMd: '36', isCorrect: true },
        { order: 3, bodyMd: '38', isCorrect: false },
      ],
      section: section1,
      sectionOrder: 4,
    },
    {
      topicId: algebra.id,
      stemMd: 'The ratio of two numbers is 3:5. If their sum is 96, what is the larger number?',
      explanationMd: 'Let numbers be 3x and 5x. Sum = 8x = 96, so x = 12. Larger number = 5x = **60**.',
      difficulty: 'MEDIUM' as Difficulty,
      options: [
        { order: 0, bodyMd: '36', isCorrect: false },
        { order: 1, bodyMd: '48', isCorrect: false },
        { order: 2, bodyMd: '60', isCorrect: true },
        { order: 3, bodyMd: '72', isCorrect: false },
      ],
      section: section1,
      sectionOrder: 5,
    },
    // Verbal Ability questions
    {
      topicId: verbal.id,
      stemMd: 'Choose the word most similar in meaning to **BENEVOLENT**.',
      explanationMd: 'Benevolent means well-meaning and kindly. **Generous** is the closest synonym.',
      difficulty: 'EASY' as Difficulty,
      options: [
        { order: 0, bodyMd: 'Cruel', isCorrect: false },
        { order: 1, bodyMd: 'Generous', isCorrect: true },
        { order: 2, bodyMd: 'Selfish', isCorrect: false },
        { order: 3, bodyMd: 'Hostile', isCorrect: false },
      ],
      section: section2,
      sectionOrder: 1,
    },
    {
      topicId: verbal.id,
      stemMd: 'Choose the word most **opposite** in meaning to **ABUNDANT**.',
      explanationMd: 'Abundant means present in great quantity. Its antonym is **Scarce** (insufficient in quantity).',
      difficulty: 'EASY' as Difficulty,
      options: [
        { order: 0, bodyMd: 'Plentiful', isCorrect: false },
        { order: 1, bodyMd: 'Scarce', isCorrect: true },
        { order: 2, bodyMd: 'Ample', isCorrect: false },
        { order: 3, bodyMd: 'Sufficient', isCorrect: false },
      ],
      section: section2,
      sectionOrder: 2,
    },
    {
      topicId: verbal.id,
      stemMd: 'Select the grammatically correct sentence.',
      explanationMd: 'Subject-verb agreement: "Each of the students **has**" (singular subject "each" takes singular verb).',
      difficulty: 'MEDIUM' as Difficulty,
      options: [
        { order: 0, bodyMd: 'Each of the students have submitted their assignment.', isCorrect: false },
        { order: 1, bodyMd: 'Each of the students has submitted their assignment.', isCorrect: true },
        { order: 2, bodyMd: 'Each of the students have submitted his assignment.', isCorrect: false },
        { order: 3, bodyMd: 'Each of the student has submitted their assignment.', isCorrect: false },
      ],
      section: section2,
      sectionOrder: 3,
    },
    {
      topicId: logical.id,
      stemMd: 'In a row of students, Rahul is 7th from the left and 13th from the right. How many students are there in the row?',
      explanationMd: 'Total = Position from left + Position from right - 1 = 7 + 13 - 1 = **19**.',
      difficulty: 'EASY' as Difficulty,
      options: [
        { order: 0, bodyMd: '18', isCorrect: false },
        { order: 1, bodyMd: '19', isCorrect: true },
        { order: 2, bodyMd: '20', isCorrect: false },
        { order: 3, bodyMd: '21', isCorrect: false },
      ],
      section: section2,
      sectionOrder: 4,
    },
    {
      topicId: logical.id,
      stemMd: 'What comes next in the series: 2, 6, 12, 20, 30, ?',
      explanationMd: 'Pattern: 1×2, 2×3, 3×4, 4×5, 5×6, **6×7 = 42**. Differences: +4, +6, +8, +10, +12.',
      difficulty: 'MEDIUM' as Difficulty,
      options: [
        { order: 0, bodyMd: '38', isCorrect: false },
        { order: 1, bodyMd: '40', isCorrect: false },
        { order: 2, bodyMd: '42', isCorrect: true },
        { order: 3, bodyMd: '44', isCorrect: false },
      ],
      section: section2,
      sectionOrder: 5,
    },
  ];

  // Create questions and link to sections
  for (const qData of questionsData) {
    const question = await prisma.question.create({
      data: {
        type: 'MCQ_SINGLE' as QuestionType,
        status: 'PUBLISHED' as QuestionStatus,
        topicId: qData.topicId,
        difficulty: qData.difficulty,
        stemMd: qData.stemMd,
        explanationMd: qData.explanationMd,
        publishedAt: new Date(),
        options: {
          create: qData.options,
        },
      },
    });

    await prisma.testSectionQuestion.create({
      data: {
        sectionId: qData.section.id,
        questionId: question.id,
        order: qData.sectionOrder,
      },
    });
  }

  console.log('✅ 10 questions created and linked to sections');
  console.log('');
  console.log('🎉 Database seeded successfully!');
  console.log(`   Exam: ${tcsNqt.name}`);
  console.log(`   Paper: ${paper.title}`);
  console.log(`   Sections: 2 (Quantitative Aptitude + Verbal Ability)`);
  console.log(`   Questions: 10 (5 per section)`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
