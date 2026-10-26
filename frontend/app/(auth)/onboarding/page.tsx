'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { educationSchema, goalSchema, preferencesSchema } from '@shared/schemas/onboarding';
import { useUpdateEducation, useUpdateGoal, useUpdatePreferences, useCompleteOnboarding } from '@/lib/query/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

const TOTAL_STEPS = 3;

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);

  const updateEducation = useUpdateEducation();
  const updateGoal = useUpdateGoal();
  const updatePreferences = useUpdatePreferences();
  const completeOnboarding = useCompleteOnboarding();

  const educationForm = useForm({ resolver: zodResolver(educationSchema) });
  const goalForm = useForm({ resolver: zodResolver(goalSchema) });
  const preferencesForm = useForm({ resolver: zodResolver(preferencesSchema) });

  const goNext = () => { setDirection(1); setStep((s) => Math.min(s + 1, TOTAL_STEPS)); };
  const goPrev = () => { setDirection(-1); setStep((s) => Math.max(s - 1, 1)); };

  const handleEducation = educationForm.handleSubmit(async (data) => {
    await updateEducation.mutateAsync(data);
    goNext();
  });

  const handleGoal = goalForm.handleSubmit(async (data) => {
    await updateGoal.mutateAsync(data);
    goNext();
  });

  const handlePreferences = preferencesForm.handleSubmit(async (data) => {
    await updatePreferences.mutateAsync(data);
    await completeOnboarding.mutateAsync();
    router.push('/dashboard');
  });

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-space-md">
      <div className="w-full max-w-lg">
        <div className="text-center mb-space-xl">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-space-sm">
            <span className="text-on-primary font-display font-bold text-xl">T</span>
          </div>
          <h1 className="font-display text-headline-xl text-on-surface">Set up your profile</h1>
          <p className="text-body-md text-on-surface-variant mt-space-xs">Step {step} of {TOTAL_STEPS}</p>
        </div>

        <Progress value={(step / TOTAL_STEPS) * 100} className="mb-space-xl" />

        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-space-xl shadow-sm overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            {step === 1 && (
              <motion.div key="step1" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
                <h2 className="font-display text-headline-lg text-on-surface mb-space-lg">Tell us about your education</h2>
                <form onSubmit={handleEducation} className="flex flex-col gap-space-md">
                  <div className="flex flex-col gap-space-xs">
                    <Label htmlFor="college">College / University *</Label>
                    <Input id="college" placeholder="e.g. LPU, VIT, BITS Pilani" {...educationForm.register('college')} />
                    {educationForm.formState.errors.college && (
                      <p className="text-body-sm text-error">{String(educationForm.formState.errors.college.message)}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-space-md">
                    <div className="flex flex-col gap-space-xs">
                      <Label htmlFor="course">Course *</Label>
                      <Input id="course" placeholder="B.Tech, MCA" {...educationForm.register('course')} />
                    </div>
                    <div className="flex flex-col gap-space-xs">
                      <Label htmlFor="branch">Branch</Label>
                      <Input id="branch" placeholder="CSE, IT" {...educationForm.register('branch')} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-space-md">
                    <div className="flex flex-col gap-space-xs">
                      <Label htmlFor="currentYear">Current Year *</Label>
                      <Input id="currentYear" type="number" min={1} max={6} placeholder="3" {...educationForm.register('currentYear')} />
                    </div>
                    <div className="flex flex-col gap-space-xs">
                      <Label htmlFor="graduationYear">Graduation Year *</Label>
                      <Input id="graduationYear" type="number" placeholder="2026" {...educationForm.register('graduationYear')} />
                    </div>
                  </div>
                  <Button type="submit" disabled={updateEducation.isPending}>
                    {updateEducation.isPending ? 'Saving...' : 'Continue →'}
                  </Button>
                </form>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
                <h2 className="font-display text-headline-lg text-on-surface mb-space-lg">What are you preparing for?</h2>
                <form onSubmit={handleGoal} className="flex flex-col gap-space-md">
                  <div className="flex flex-col gap-space-sm">
                    {[
                      { value: 'SERVICE_COMPANY', label: 'Service Companies', desc: 'TCS, Infosys, Wipro, Cognizant...' },
                      { value: 'GOVERNMENT', label: 'Government Exams', desc: 'SSC, Banking, Railways, UPSC...' },
                      { value: 'BOTH', label: 'Both', desc: 'Preparing for everything' },
                    ].map((opt) => {
                      const selected = goalForm.watch('goal') === opt.value;
                      return (
                        <label key={opt.value} className={`flex items-start gap-space-md p-space-md rounded-xl border-2 cursor-pointer transition-colors ${selected ? 'border-primary bg-primary/5' : 'border-outline-variant hover:border-outline'}`}>
                          <input type="radio" className="mt-1" value={opt.value} {...goalForm.register('goal')} />
                          <div>
                            <p className="text-label-lg text-on-surface">{opt.label}</p>
                            <p className="text-body-sm text-on-surface-variant">{opt.desc}</p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                  <div className="flex gap-space-sm">
                    <Button type="button" variant="secondary" onClick={goPrev}>← Back</Button>
                    <Button type="submit" disabled={updateGoal.isPending} className="flex-1">
                      {updateGoal.isPending ? 'Saving...' : 'Continue →'}
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
                <h2 className="font-display text-headline-lg text-on-surface mb-space-lg">Customize your experience</h2>
                <form onSubmit={handlePreferences} className="flex flex-col gap-space-md">
                  <div className="flex flex-col gap-space-xs">
                    <Label>Preferred Language</Label>
                    <div className="flex gap-space-sm">
                      {[{ value: 'EN', label: 'English' }, { value: 'HI', label: 'Hindi' }].map((lang) => {
                        const selected = (preferencesForm.watch('preferredLocale') ?? 'EN') === lang.value;
                        return (
                          <label key={lang.value} className={`flex-1 flex items-center justify-center p-space-sm rounded-xl border-2 cursor-pointer transition-colors ${selected ? 'border-primary bg-primary/5 text-primary font-semibold' : 'border-outline-variant hover:border-outline'}`}>
                            <input type="radio" className="sr-only" value={lang.value} {...preferencesForm.register('preferredLocale')} />
                            {lang.label}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex flex-col gap-space-xs">
                    <Label htmlFor="dailyGoal">Daily Study Goal (minutes)</Label>
                    <Input id="dailyGoal" type="number" min={15} max={480} placeholder="60" {...preferencesForm.register('dailyGoalMinutes')} />
                  </div>
                  <div className="flex gap-space-sm">
                    <Button type="button" variant="secondary" onClick={goPrev}>← Back</Button>
                    <Button type="submit" disabled={completeOnboarding.isPending || updatePreferences.isPending} className="flex-1">
                      {completeOnboarding.isPending ? 'Setting up...' : 'Start Preparing 🚀'}
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}