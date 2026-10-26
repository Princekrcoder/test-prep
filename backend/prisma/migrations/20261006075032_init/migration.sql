-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'EDITOR', 'REVIEWER', 'ADMIN');

-- CreateEnum
CREATE TYPE "PlanTier" AS ENUM ('FREE', 'PRO', 'PREMIUM');

-- CreateEnum
CREATE TYPE "Locale" AS ENUM ('EN', 'HI');

-- CreateEnum
CREATE TYPE "ExamFamily" AS ENUM ('SERVICE_COMPANY', 'GOVERNMENT');

-- CreateEnum
CREATE TYPE "TimingMode" AS ENUM ('WHOLE_PAPER', 'SECTIONAL');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('MCQ_SINGLE', 'MCQ_MULTI', 'NUMERIC', 'TRUE_FALSE');

-- CreateEnum
CREATE TYPE "QuestionStatus" AS ENUM ('DRAFT', 'IN_REVIEW', 'APPROVED', 'PUBLISHED', 'RETIRED');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "AttemptStatus" AS ENUM ('IN_PROGRESS', 'SUBMITTED', 'AUTO_SUBMITTED', 'ABANDONED', 'EVALUATED');

-- CreateEnum
CREATE TYPE "AnswerState" AS ENUM ('NOT_VISITED', 'NOT_ANSWERED', 'ANSWERED', 'MARKED', 'ANSWERED_AND_MARKED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "mobile" TEXT,
    "mobileVerified" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "googleId" TEXT,
    "planTier" "PlanTier" NOT NULL DEFAULT 'FREE',
    "planExpiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "college" TEXT,
    "course" TEXT,
    "branch" TEXT,
    "currentYear" INTEGER,
    "graduationYear" INTEGER,
    "goal" "ExamFamily",
    "preferredLocale" "Locale" NOT NULL DEFAULT 'EN',
    "dailyGoalMinutes" INTEGER NOT NULL DEFAULT 60,
    "onboardedAt" TIMESTAMP(3),

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "refreshHash" TEXT NOT NULL,
    "userAgent" TEXT,
    "ip" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exams" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "family" "ExamFamily" NOT NULL,
    "summary" TEXT,
    "syllabusMd" TEXT,
    "iconKey" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "exams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_papers" (
    "id" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "timingMode" "TimingMode" NOT NULL DEFAULT 'WHOLE_PAPER',
    "durationSeconds" INTEGER NOT NULL,
    "difficulty" "Difficulty" NOT NULL DEFAULT 'MEDIUM',
    "isFree" BOOLEAN NOT NULL DEFAULT false,
    "isPyp" BOOLEAN NOT NULL DEFAULT false,
    "pypYear" INTEGER,
    "availableLocales" "Locale"[] DEFAULT ARRAY['EN']::"Locale"[],
    "publishedAt" TIMESTAMP(3),
    "scoringVersion" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "test_papers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_sections" (
    "id" TEXT NOT NULL,
    "paperId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "durationSeconds" INTEGER,
    "marksCorrect" DECIMAL(5,2) NOT NULL DEFAULT 1,
    "marksIncorrect" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "lockOnExit" BOOLEAN NOT NULL DEFAULT false,
    "instructionsMd" TEXT,

    CONSTRAINT "test_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "topics" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parentId" TEXT,

    CONSTRAINT "topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" TEXT NOT NULL,
    "type" "QuestionType" NOT NULL DEFAULT 'MCQ_SINGLE',
    "status" "QuestionStatus" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "topicId" TEXT NOT NULL,
    "difficulty" "Difficulty" NOT NULL DEFAULT 'MEDIUM',
    "stemMd" TEXT NOT NULL,
    "explanationMd" TEXT,
    "imageUrl" TEXT,
    "numericAnswer" DECIMAL(14,4),
    "numericTolerance" DECIMAL(10,4),
    "pValue" DOUBLE PRECISION,
    "discrimination" DOUBLE PRECISION,
    "avgTimeMs" INTEGER,
    "timesServed" INTEGER NOT NULL DEFAULT 0,
    "authorId" TEXT,
    "reviewedById" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_options" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "bodyMd" TEXT NOT NULL,
    "imageUrl" TEXT,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "question_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_translations" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "stemMd" TEXT NOT NULL,
    "explanationMd" TEXT,

    CONSTRAINT "question_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "option_translations" (
    "id" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "bodyMd" TEXT NOT NULL,

    CONSTRAINT "option_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_section_questions" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "marksCorrectOverride" DECIMAL(5,2),
    "marksIncorrectOverride" DECIMAL(5,2),

    CONSTRAINT "test_section_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attempts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "paperId" TEXT NOT NULL,
    "status" "AttemptStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "locale" "Locale" NOT NULL DEFAULT 'EN',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "submittedAt" TIMESTAMP(3),
    "evaluatedAt" TIMESTAMP(3),
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shuffleSeed" TEXT NOT NULL,
    "blueprint" JSONB NOT NULL,
    "scoringVersion" INTEGER NOT NULL DEFAULT 1,
    "score" DECIMAL(7,2),
    "maxScore" DECIMAL(7,2),
    "correct" INTEGER,
    "incorrect" INTEGER,
    "unattempted" INTEGER,
    "accuracy" DOUBLE PRECISION,
    "timeTakenSec" INTEGER,
    "percentile" DOUBLE PRECISION,
    "rank" INTEGER,

    CONSTRAINT "attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attempt_section_states" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "enteredAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "timeSpentMs" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "attempt_section_states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attempt_answers" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "selectedOptionIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "numericValue" DECIMAL(14,4),
    "state" "AnswerState" NOT NULL DEFAULT 'NOT_VISITED',
    "revision" INTEGER NOT NULL DEFAULT 0,
    "timeSpentMs" INTEGER NOT NULL DEFAULT 0,
    "visitCount" INTEGER NOT NULL DEFAULT 0,
    "isCorrect" BOOLEAN,
    "marksAwarded" DECIMAL(5,2),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attempt_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "topic_mastery" (
    "userId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "attempted" INTEGER NOT NULL DEFAULT 0,
    "correct" INTEGER NOT NULL DEFAULT 0,
    "avgTimeMs" INTEGER NOT NULL DEFAULT 0,
    "mastery" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "topic_mastery_pkey" PRIMARY KEY ("userId","topicId")
);

-- CreateTable
CREATE TABLE "daily_activity" (
    "userId" TEXT NOT NULL,
    "day" DATE NOT NULL,
    "minutesActive" INTEGER NOT NULL DEFAULT 0,
    "questionsDone" INTEGER NOT NULL DEFAULT 0,
    "attemptsDone" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "daily_activity_pkey" PRIMARY KEY ("userId","day")
);

-- CreateTable
CREATE TABLE "score_distributions" (
    "paperId" TEXT NOT NULL,
    "sampleSize" INTEGER NOT NULL,
    "buckets" JSONB NOT NULL,
    "mean" DOUBLE PRECISION NOT NULL,
    "stdDev" DOUBLE PRECISION NOT NULL,
    "computedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "score_distributions_pkey" PRIMARY KEY ("paperId")
);

-- CreateTable
CREATE TABLE "bookmarks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bookmarks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "actorId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "before" JSONB,
    "after" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_mobile_key" ON "users"("mobile");

-- CreateIndex
CREATE UNIQUE INDEX "users_googleId_key" ON "users"("googleId");

-- CreateIndex
CREATE INDEX "users_planTier_planExpiresAt_idx" ON "users"("planTier", "planExpiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_userId_key" ON "profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_refreshHash_key" ON "sessions"("refreshHash");

-- CreateIndex
CREATE INDEX "sessions_userId_revokedAt_idx" ON "sessions"("userId", "revokedAt");

-- CreateIndex
CREATE UNIQUE INDEX "exams_slug_key" ON "exams"("slug");

-- CreateIndex
CREATE INDEX "exams_family_isActive_sortOrder_idx" ON "exams"("family", "isActive", "sortOrder");

-- CreateIndex
CREATE INDEX "test_papers_examId_publishedAt_idx" ON "test_papers"("examId", "publishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "test_papers_examId_slug_key" ON "test_papers"("examId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "test_sections_paperId_order_key" ON "test_sections"("paperId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "topics_slug_key" ON "topics"("slug");

-- CreateIndex
CREATE INDEX "questions_topicId_status_difficulty_idx" ON "questions"("topicId", "status", "difficulty");

-- CreateIndex
CREATE INDEX "questions_status_publishedAt_idx" ON "questions"("status", "publishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "question_options_questionId_order_key" ON "question_options"("questionId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "question_translations_questionId_locale_key" ON "question_translations"("questionId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "option_translations_optionId_locale_key" ON "option_translations"("optionId", "locale");

-- CreateIndex
CREATE INDEX "test_section_questions_questionId_idx" ON "test_section_questions"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "test_section_questions_sectionId_order_key" ON "test_section_questions"("sectionId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "test_section_questions_sectionId_questionId_key" ON "test_section_questions"("sectionId", "questionId");

-- CreateIndex
CREATE INDEX "attempts_userId_status_startedAt_idx" ON "attempts"("userId", "status", "startedAt");

-- CreateIndex
CREATE INDEX "attempts_paperId_status_score_idx" ON "attempts"("paperId", "status", "score");

-- CreateIndex
CREATE INDEX "attempts_status_expiresAt_idx" ON "attempts"("status", "expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "attempt_section_states_attemptId_sectionId_key" ON "attempt_section_states"("attemptId", "sectionId");

-- CreateIndex
CREATE INDEX "attempt_answers_questionId_isCorrect_idx" ON "attempt_answers"("questionId", "isCorrect");

-- CreateIndex
CREATE UNIQUE INDEX "attempt_answers_attemptId_questionId_key" ON "attempt_answers"("attemptId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "bookmarks_userId_questionId_key" ON "bookmarks"("userId", "questionId");

-- CreateIndex
CREATE INDEX "audit_logs_entityType_entityId_createdAt_idx" ON "audit_logs"("entityType", "entityId", "createdAt");

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_papers" ADD CONSTRAINT "test_papers_examId_fkey" FOREIGN KEY ("examId") REFERENCES "exams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_sections" ADD CONSTRAINT "test_sections_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "test_papers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topics" ADD CONSTRAINT "topics_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "topics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_options" ADD CONSTRAINT "question_options_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_translations" ADD CONSTRAINT "question_translations_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "option_translations" ADD CONSTRAINT "option_translations_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "question_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_section_questions" ADD CONSTRAINT "test_section_questions_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "test_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_section_questions" ADD CONSTRAINT "test_section_questions_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempts" ADD CONSTRAINT "attempts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempts" ADD CONSTRAINT "attempts_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "test_papers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempt_section_states" ADD CONSTRAINT "attempt_section_states_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "attempts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempt_section_states" ADD CONSTRAINT "attempt_section_states_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "test_sections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempt_answers" ADD CONSTRAINT "attempt_answers_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "attempts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempt_answers" ADD CONSTRAINT "attempt_answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topic_mastery" ADD CONSTRAINT "topic_mastery_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topic_mastery" ADD CONSTRAINT "topic_mastery_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_activity" ADD CONSTRAINT "daily_activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "score_distributions" ADD CONSTRAINT "score_distributions_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "test_papers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
