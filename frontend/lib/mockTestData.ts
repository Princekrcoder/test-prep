export interface MockOption {
  id: string;
  order: number;
  bodyMd: string;
  isCorrect?: boolean;
}

export interface MockQuestion {
  id: string;
  sectionId: string;
  order: number;
  type: 'MCQ_SINGLE' | 'MCQ_MULTI';
  marksCorrect: number;
  marksIncorrect: number;
  stemMd: string;
  hintMd?: string;
  conceptTag?: string;
  difficulty: 'Easy' | 'Moderate' | 'Advanced';
  options: MockOption[];
  explanationMd: string;
  timeSpentSec?: number;
}

export interface MockSection {
  id: string;
  name: string;
  order: number;
  durationSeconds: number;
  marksCorrect: number;
  marksIncorrect: number;
  lockOnExit: boolean;
  questionIds: string[];
}

export interface MockPaper {
  id: string;
  slug: string;
  title: string;
  examCode: string;
  series: string;
  category: string;
  timingMode: 'WHOLE_PAPER' | 'SECTIONAL';
  durationSeconds: number;
  totalMarks: number;
  cutoffMarks: number;
  markingRule: string;
  difficulty: 'Easy' | 'Moderate' | 'Advanced';
  description: string;
  sections: MockSection[];
  questions: MockQuestion[];
}

export const MOCK_PAPERS: Record<string, MockPaper> = {
  'tcs-nqt-05': {
    id: 'tcs-nqt-05',
    slug: 'tcs-nqt-05',
    title: 'TCS NQT 2025 — Full Length All-India Mock Test #05',
    examCode: 'TCS-NQT-2025-M05',
    series: 'TCS NQT 2026 Booster',
    category: 'live',
    timingMode: 'WHOLE_PAPER',
    durationSeconds: 90 * 60, // 90 mins
    totalMarks: 100,
    cutoffMarks: 62,
    markingRule: '+1.0 / -0.25 Negative Marking',
    difficulty: 'Moderate',
    description: 'Comprehensive benchmark simulation adhering to the revised TCS National Qualifier Test syllabus and cognitive matrix with Numerical, Reasoning, and Verbal sections.',
    sections: [
      {
        id: 'sec-quant',
        name: 'Numerical Ability',
        order: 1,
        durationSeconds: 35 * 60,
        marksCorrect: 1.0,
        marksIncorrect: 0.25,
        lockOnExit: false,
        questionIds: [
          'q-quant-1', 'q-quant-2', 'q-quant-3', 'q-quant-4', 'q-quant-5',
          'q-quant-6', 'q-quant-7', 'q-quant-8', 'q-quant-9', 'q-quant-10',
          'q-quant-11', 'q-quant-12', 'q-quant-13', 'q-quant-14', 'q-quant-15'
        ],
      },
      {
        id: 'sec-reasoning',
        name: 'Reasoning Ability',
        order: 2,
        durationSeconds: 30 * 60,
        marksCorrect: 1.0,
        marksIncorrect: 0.25,
        lockOnExit: false,
        questionIds: [
          'q-reas-1', 'q-reas-2', 'q-reas-3', 'q-reas-4', 'q-reas-5',
          'q-reas-6', 'q-reas-7', 'q-reas-8', 'q-reas-9', 'q-reas-10'
        ],
      },
      {
        id: 'sec-verbal',
        name: 'Verbal Ability',
        order: 3,
        durationSeconds: 25 * 60,
        marksCorrect: 1.0,
        marksIncorrect: 0.25,
        lockOnExit: false,
        questionIds: [
          'q-verb-1', 'q-verb-2', 'q-verb-3', 'q-verb-4', 'q-verb-5'
        ],
      },
    ],
    questions: [
      // ── Numerical Ability ──
      {
        id: 'q-quant-1',
        sectionId: 'sec-quant',
        order: 1,
        type: 'MCQ_SINGLE',
        marksCorrect: 1.0,
        marksIncorrect: 0.25,
        stemMd: 'A train traveling at a constant speed of **72 km/h** crosses a railway platform of length **280 meters** in exactly **26 seconds**. How much time will this train take to pass a stationary electric pole beside the track?',
        hintMd: 'Standard CBT Kinematics Note: Assume uniform velocity. Neglect the spatial thickness of the electric pole relative to the train\'s length. Convert speed to m/s before resolving relative distance.',
        conceptTag: 'Kinematics & Relative Speed',
        difficulty: 'Moderate',
        options: [
          { id: 'opt-q1-a', order: 0, bodyMd: '11 seconds', isCorrect: false },
          { id: 'opt-q1-b', order: 1, bodyMd: '12 seconds', isCorrect: true },
          { id: 'opt-q1-c', order: 2, bodyMd: '14 seconds', isCorrect: false },
          { id: 'opt-q1-d', order: 3, bodyMd: '16 seconds', isCorrect: false },
        ],
        explanationMd: '**Step 1:** Convert speed to m/s:\nSpeed = 72 × (5/18) = **20 m/s**.\n\n**Step 2:** Distance covered while crossing the platform:\nTotal Distance = Length of Train ($L_t$) + Length of Platform (280 m).\n$20 \\times 26 = 520\\text{ m} \\implies L_t + 280 = 520 \\implies L_t = 240\\text{ m}$.\n\n**Step 3:** Time to cross stationary pole:\n$\\text{Time} = \\frac{L_t}{\\text{Speed}} = \\frac{240}{20} = \\mathbf{12\\text{ seconds}}$.',
        timeSpentSec: 64,
      },
      {
        id: 'q-quant-2',
        sectionId: 'sec-quant',
        order: 2,
        type: 'MCQ_SINGLE',
        marksCorrect: 1.0,
        marksIncorrect: 0.25,
        stemMd: 'A can complete a piece of work in **12 days** and B can complete the same work in **18 days**. If they work together on alternate days starting with A, in how many days will the entire work be completed?',
        hintMd: 'Work & Time Unitary Method: Find total work as LCM(12, 18) = 36 units. Calculate combined work in 2-day cycles.',
        conceptTag: 'Time & Work',
        difficulty: 'Moderate',
        options: [
          { id: 'opt-q2-a', order: 0, bodyMd: '14 days', isCorrect: false },
          { id: 'opt-q2-b', order: 1, bodyMd: '14.33 days (14 1/3 days)', isCorrect: true },
          { id: 'opt-q2-c', order: 2, bodyMd: '15 days', isCorrect: false },
          { id: 'opt-q2-d', order: 3, bodyMd: '15.5 days', isCorrect: false },
        ],
        explanationMd: 'Total Work = $\\text{LCM}(12, 18) = 36$ units.\n- A\'s 1-day efficiency = $36/12 = 3$ units/day.\n- B\'s 1-day efficiency = $36/18 = 2$ units/day.\n\nIn 2 days (A + B): $3 + 2 = 5$ units.\nAfter 7 cycles (14 days): $7 \\times 5 = 35$ units completed.\nRemaining work = $36 - 35 = 1$ unit.\nOn day 15, A works: time taken = $1/3$ day.\nTotal time = $14 + 1/3 = \\mathbf{14.33\\text{ days}}$.',
        timeSpentSec: 78,
      },
      {
        id: 'q-quant-3',
        sectionId: 'sec-quant',
        order: 3,
        type: 'MCQ_SINGLE',
        marksCorrect: 1.0,
        marksIncorrect: 0.25,
        stemMd: 'A merchant marks his goods **30% above the cost price** and allows a discount of **15% on the marked price**. What is his actual profit percentage in the transaction?',
        hintMd: 'Profit & Loss Formula: Net Profit % = Marked % - Discount % - (Marked % × Discount %) / 100.',
        conceptTag: 'Commercial Mathematics',
        difficulty: 'Easy',
        options: [
          { id: 'opt-q3-a', order: 0, bodyMd: '10.5%', isCorrect: true },
          { id: 'opt-q3-b', order: 1, bodyMd: '12.0%', isCorrect: false },
          { id: 'opt-q3-c', order: 2, bodyMd: '15.0%', isCorrect: false },
          { id: 'opt-q3-d', order: 3, bodyMd: '8.5%', isCorrect: false },
        ],
        explanationMd: 'Let Cost Price $CP = 100$.\nMarked Price $MP = 100 \\times 1.30 = 130$.\nSelling Price $SP = 130 \\times (1 - 0.15) = 130 \\times 0.85 = 110.5$.\nProfit Percentage = $(110.5 - 100) = \\mathbf{10.5\\%}$.',
        timeSpentSec: 42,
      },
      {
        id: 'q-quant-4',
        sectionId: 'sec-quant',
        order: 4,
        type: 'MCQ_SINGLE',
        marksCorrect: 1.0,
        marksIncorrect: 0.25,
        stemMd: 'Two vessels A and B contain mixtures of milk and water in the ratio **5 : 2** and **8 : 5** respectively. In what ratio should the liquids from both vessels be mixed to obtain a new mixture in which milk and water are in the ratio **9 : 4**?',
        hintMd: 'Allegation Rule: Compare the concentration of milk in Vessel A (5/7) and Vessel B (8/13) with Mean (9/13).',
        conceptTag: 'Mixtures & Alligations',
        difficulty: 'Advanced',
        options: [
          { id: 'opt-q4-a', order: 0, bodyMd: '7 : 2', isCorrect: true },
          { id: 'opt-q4-b', order: 1, bodyMd: '5 : 3', isCorrect: false },
          { id: 'opt-q4-c', order: 2, bodyMd: '3 : 2', isCorrect: false },
          { id: 'opt-q4-d', order: 3, bodyMd: '4 : 1', isCorrect: false },
        ],
        explanationMd: 'Concentration of milk in A = 5/7.\nConcentration of milk in B = 8/13.\nMean concentration = 9/13.\n\nBy Rule of Alligation:\n$\\frac{\\text{Qty of A}}{\\text{Qty of B}} = \\frac{9/13 - 8/13}{5/7 - 9/13} = \\frac{1/13}{(65 - 63)/91} = \\frac{1/13}{2/91} = \\frac{91}{26} = \\mathbf{\\frac{7}{2}}$.',
        timeSpentSec: 92,
      },
      {
        id: 'q-quant-5',
        sectionId: 'sec-quant',
        order: 5,
        type: 'MCQ_SINGLE',
        marksCorrect: 1.0,
        marksIncorrect: 0.25,
        stemMd: 'The compound interest on a certain sum for 2 years at 10% per annum is **Rs. 525**. The simple interest on the same sum for double the time at half the rate percent per annum is:',
        hintMd: 'SI and CI Relationships: $CI = P[(1+r/100)^t - 1]$. Half rate = 5%, double time = 4 years.',
        conceptTag: 'Simple & Compound Interest',
        difficulty: 'Moderate',
        options: [
          { id: 'opt-q5-a', order: 0, bodyMd: 'Rs. 400', isCorrect: false },
          { id: 'opt-q5-b', order: 1, bodyMd: 'Rs. 500', isCorrect: true },
          { id: 'opt-q5-c', order: 2, bodyMd: 'Rs. 550', isCorrect: false },
          { id: 'opt-q5-d', order: 3, bodyMd: 'Rs. 600', isCorrect: false },
        ],
        explanationMd: 'Effective CI rate for 2 years at 10% = $10 + 10 + (10 \\times 10)/100 = 21\\%$.\nSum $P = \\frac{525}{0.21} = \\text{Rs. } 2500$.\nNew time = 4 years, new rate = 5%.\n$SI = \\frac{2500 \\times 5 \\times 4}{100} = \\mathbf{\\text{Rs. } 500}$.',
        timeSpentSec: 55,
      },
      {
        id: 'q-quant-6',
        sectionId: 'sec-quant',
        order: 6,
        type: 'MCQ_SINGLE',
        marksCorrect: 1.0,
        marksIncorrect: 0.25,
        stemMd: 'Find the greatest number of four digits which when divided by 12, 15, 20 and 54 leaves remainders 8, 11, 16 and 50 respectively.',
        hintMd: 'Number Systems & LCM: Note the constant difference $(12-8 = 15-11 = 20-16 = 54-50 = 4)$. Number is $k \\times \\text{LCM} - 4$.',
        conceptTag: 'Number Systems',
        difficulty: 'Advanced',
        options: [
          { id: 'opt-q6-a', order: 0, bodyMd: '9716', isCorrect: true },
          { id: 'opt-q6-b', order: 1, bodyMd: '9820', isCorrect: false },
          { id: 'opt-q6-c', order: 2, bodyMd: '9654', isCorrect: false },
          { id: 'opt-q6-d', order: 3, bodyMd: '9920', isCorrect: false },
        ],
        explanationMd: '$\\text{LCM}(12, 15, 20, 54) = 540$.\nLargest 4-digit number is 9999.\n$9999 \\div 540 = 18$ with remainder 279.\n$9999 - 279 = 9720$.\nRequired number = $9720 - 4 = \\mathbf{9716}$.',
        timeSpentSec: 105,
      },
      {
        id: 'q-quant-7',
        sectionId: 'sec-quant',
        order: 7,
        type: 'MCQ_SINGLE',
        marksCorrect: 1.0,
        marksIncorrect: 0.25,
        stemMd: 'In an examination, 70% of the candidates passed in English, 80% passed in Mathematics and 10% failed in both subjects. If 144 candidates passed in both subjects, what was the total number of candidates?',
        hintMd: 'Venn Diagram & Set Theory: Candidates passing in at least one subject = 100% - 10% = 90%.',
        conceptTag: 'Percentages & Sets',
        difficulty: 'Easy',
        options: [
          { id: 'opt-q7-a', order: 0, bodyMd: '200', isCorrect: false },
          { id: 'opt-q7-b', order: 1, bodyMd: '240', isCorrect: true },
          { id: 'opt-q7-c', order: 2, bodyMd: '300', isCorrect: false },
          { id: 'opt-q7-d', order: 3, bodyMd: '320', isCorrect: false },
        ],
        explanationMd: 'Let total candidates = $N$.\n$P(E \\cup M) = 100 - 10 = 90\\%$.\n$P(E \\cap M) = P(E) + P(M) - P(E \\cup M) = 70 + 80 - 90 = 60\\%$.\n$60\\% \\text{ of } N = 144 \\implies N = \\frac{144}{0.60} = \\mathbf{240}$.',
        timeSpentSec: 38,
      },
      {
        id: 'q-quant-8',
        sectionId: 'sec-quant',
        order: 8,
        type: 'MCQ_SINGLE',
        marksCorrect: 1.0,
        marksIncorrect: 0.25,
        stemMd: 'A bag contains 6 red, 4 blue, and 2 green balls. If two balls are drawn at random without replacement, what is the probability that both are of the same color?',
        hintMd: 'Probability combinations: $P(\\text{both same}) = P(\\text{both red}) + P(\\text{both blue}) + P(\\text{both green})$. Total balls = 12.',
        conceptTag: 'Probability & Combinatorics',
        difficulty: 'Moderate',
        options: [
          { id: 'opt-q8-a', order: 0, bodyMd: '11/33 (1/3)', isCorrect: true },
          { id: 'opt-q8-b', order: 1, bodyMd: '5/12', isCorrect: false },
          { id: 'opt-q8-c', order: 2, bodyMd: '7/22', isCorrect: false },
          { id: 'opt-q8-d', order: 3, bodyMd: '15/66', isCorrect: false },
        ],
        explanationMd: 'Total ways = $\\binom{12}{2} = \\frac{12 \\times 11}{2} = 66$.\n- Favorable Red = $\\binom{6}{2} = 15$\n- Favorable Blue = $\\binom{4}{2} = 6$\n- Favorable Green = $\\binom{2}{2} = 1$\nTotal favorable = $15 + 6 + 1 = 22$.\nProbability = $\\frac{22}{66} = \\mathbf{\\frac{1}{3}}$.',
        timeSpentSec: 62,
      },
      {
        id: 'q-quant-9',
        sectionId: 'sec-quant',
        order: 9,
        type: 'MCQ_SINGLE',
        marksCorrect: 1.0,
        marksIncorrect: 0.25,
        stemMd: 'If $x + \\frac{1}{x} = 4$, what is the exact numerical value of $x^4 + \\frac{1}{x^4}$?',
        hintMd: 'Algebraic Identities: Square both sides repeatedly. $(x + 1/x)^2 = x^2 + 1/x^2 + 2$.',
        conceptTag: 'Algebraic Equations',
        difficulty: 'Easy',
        options: [
          { id: 'opt-q9-a', order: 0, bodyMd: '194', isCorrect: true },
          { id: 'opt-q9-b', order: 1, bodyMd: '196', isCorrect: false },
          { id: 'opt-q9-c', order: 2, bodyMd: '192', isCorrect: false },
          { id: 'opt-q9-d', order: 3, bodyMd: '188', isCorrect: false },
        ],
        explanationMd: '$x^2 + \\frac{1}{x^2} = 4^2 - 2 = 14$.\n$x^4 + \\frac{1}{x^4} = 14^2 - 2 = 196 - 2 = \\mathbf{194}$.',
        timeSpentSec: 30,
      },
      {
        id: 'q-quant-10',
        sectionId: 'sec-quant',
        order: 10,
        type: 'MCQ_SINGLE',
        marksCorrect: 1.0,
        marksIncorrect: 0.25,
        stemMd: 'Two pipes A and B can fill a cistern in 20 minutes and 30 minutes respectively, while an outlet pipe C can empty it in 15 minutes. If all three pipes are opened together, the cistern will be filled in:',
        hintMd: 'Pipes & Cisterns: Net filling rate per minute = 1/20 + 1/30 - 1/15.',
        conceptTag: 'Pipes & Cisterns',
        difficulty: 'Moderate',
        options: [
          { id: 'opt-q10-a', order: 0, bodyMd: '50 minutes', isCorrect: false },
          { id: 'opt-q10-b', order: 1, bodyMd: '60 minutes', isCorrect: true },
          { id: 'opt-q10-c', order: 2, bodyMd: '45 minutes', isCorrect: false },
          { id: 'opt-q10-d', order: 3, bodyMd: '40 minutes', isCorrect: false },
        ],
        explanationMd: 'LCM of (20, 30, 15) = 60 units.\n- A rate = +3 units/min\n- B rate = +2 units/min\n- C rate = -4 units/min\nNet rate = $3 + 2 - 4 = +1$ unit/min.\nTime = $60 / 1 = \\mathbf{60\\text{ minutes}}$.',
        timeSpentSec: 48,
      },
      {
        id: 'q-quant-11',
        sectionId: 'sec-quant',
        order: 11,
        type: 'MCQ_SINGLE',
        marksCorrect: 1.0,
        marksIncorrect: 0.25,
        stemMd: 'The ratio of present ages of Rahul and Amit is 4 : 5. Six years hence, the ratio of their ages will be 6 : 7. What is Rahul\'s present age?',
        hintMd: 'Age Ratio Model: Let ages be 4x and 5x. Solve $(4x+6)/(5x+6) = 6/7$.',
        conceptTag: 'Ratios & Proportions',
        difficulty: 'Easy',
        options: [
          { id: 'opt-q11-a', order: 0, bodyMd: '12 years', isCorrect: true },
          { id: 'opt-q11-b', order: 1, bodyMd: '15 years', isCorrect: false },
          { id: 'opt-q11-c', order: 2, bodyMd: '18 years', isCorrect: false },
          { id: 'opt-q11-d', order: 3, bodyMd: '20 years', isCorrect: false },
        ],
        explanationMd: '$7(4x + 6) = 6(5x + 6) \\implies 28x + 42 = 30x + 36 \\implies 2x = 6 \\implies x = 3$.\nRahul\'s age = $4 \\times 3 = \\mathbf{12\\text{ years}}$.',
        timeSpentSec: 25,
      },
      {
        id: 'q-quant-12',
        sectionId: 'sec-quant',
        order: 12,
        type: 'MCQ_SINGLE',
        marksCorrect: 1.0,
        marksIncorrect: 0.25,
        stemMd: 'A boat travels 24 km upstream in 6 hours and 28 km downstream in 4 hours. What is the speed of the water current in km/h?',
        hintMd: 'Boats & Streams: Upstream speed $U = 24/6 = 4$, Downstream speed $D = 28/4 = 7$. Current speed = $(D - U)/2$.',
        conceptTag: 'Speed, Time & Distance',
        difficulty: 'Easy',
        options: [
          { id: 'opt-q12-a', order: 0, bodyMd: '1.5 km/h', isCorrect: true },
          { id: 'opt-q12-b', order: 1, bodyMd: '2.0 km/h', isCorrect: false },
          { id: 'opt-q12-c', order: 2, bodyMd: '3.0 km/h', isCorrect: false },
          { id: 'opt-q12-d', order: 3, bodyMd: '2.5 km/h', isCorrect: false },
        ],
        explanationMd: '$U = 4\\text{ km/h}$, $D = 7\\text{ km/h}$.\nSpeed of current = $\\frac{7 - 4}{2} = \\mathbf{1.5\\text{ km/h}}$.',
        timeSpentSec: 32,
      },
      {
        id: 'q-quant-13',
        sectionId: 'sec-quant',
        order: 13,
        type: 'MCQ_SINGLE',
        marksCorrect: 1.0,
        marksIncorrect: 0.25,
        stemMd: 'What is the unit digit in the product $(7^{95} - 3^{58})$?',
        hintMd: 'Cyclicity of Unit Digits: Powers of 7 have cyclicity 4 (7, 9, 3, 1). Powers of 3 have cyclicity 4 (3, 9, 7, 1).',
        conceptTag: 'Number Properties',
        difficulty: 'Moderate',
        options: [
          { id: 'opt-q13-a', order: 0, bodyMd: '0', isCorrect: false },
          { id: 'opt-q13-b', order: 1, bodyMd: '4', isCorrect: true },
          { id: 'opt-q13-c', order: 2, bodyMd: '6', isCorrect: false },
          { id: 'opt-q13-d', order: 3, bodyMd: '7', isCorrect: false },
        ],
        explanationMd: '$95 \\pmod 4 = 3 \\implies 7^3 = 343$ (unit digit 3).\n$58 \\pmod 4 = 2 \\implies 3^2 = 9$ (unit digit 9).\nUnit digit = $(13 - 9) = \\mathbf{4}$.',
        timeSpentSec: 54,
      },
      {
        id: 'q-quant-14',
        sectionId: 'sec-quant',
        order: 14,
        type: 'MCQ_SINGLE',
        marksCorrect: 1.0,
        marksIncorrect: 0.25,
        stemMd: 'A solid metallic sphere of radius 6 cm is melted and recast into small spheres of radius 2 cm each. How many such small spheres can be formed?',
        hintMd: 'Mensuration 3D: Volume of sphere = $\\frac{4}{3}\\pi r^3$. Ratio of volumes is $(R/r)^3$.',
        conceptTag: 'Mensuration 3D',
        difficulty: 'Easy',
        options: [
          { id: 'opt-q14-a', order: 0, bodyMd: '9', isCorrect: false },
          { id: 'opt-q14-b', order: 1, bodyMd: '18', isCorrect: false },
          { id: 'opt-q14-c', order: 2, bodyMd: '27', isCorrect: true },
          { id: 'opt-q14-d', order: 3, bodyMd: '36', isCorrect: false },
        ],
        explanationMd: '$\\text{Number of spheres} = \\left(\\frac{6}{2}\\right)^3 = 3^3 = \\mathbf{27}$.',
        timeSpentSec: 20,
      },
      {
        id: 'q-quant-15',
        sectionId: 'sec-quant',
        order: 15,
        type: 'MCQ_SINGLE',
        marksCorrect: 1.0,
        marksIncorrect: 0.25,
        stemMd: 'The average of 5 consecutive odd numbers is 61. What is the difference between the highest and lowest numbers?',
        hintMd: 'Averages Property: For $n$ consecutive odd numbers, difference between highest and lowest is always $2(n-1)$.',
        conceptTag: 'Averages',
        difficulty: 'Easy',
        options: [
          { id: 'opt-q15-a', order: 0, bodyMd: '8', isCorrect: true },
          { id: 'opt-q15-b', order: 1, bodyMd: '10', isCorrect: false },
          { id: 'opt-q15-c', order: 2, bodyMd: '12', isCorrect: false },
          { id: 'opt-q15-d', order: 3, bodyMd: '6', isCorrect: false },
        ],
        explanationMd: 'The 5 numbers centered at 61 are 57, 59, 61, 63, 65.\nDifference = $65 - 57 = \\mathbf{8}$.',
        timeSpentSec: 18,
      },

      // ── Reasoning Ability ──
      {
        id: 'q-reas-1',
        sectionId: 'sec-reasoning',
        order: 1,
        type: 'MCQ_SINGLE',
        marksCorrect: 1.0,
        marksIncorrect: 0.25,
        stemMd: 'Statements:\n- All laptops are electronics.\n- Some electronics are gadgets.\n- All gadgets are portable.\n\nConclusions:\nI. Some portable items are electronics.\nII. Some laptops are portable.\nIII. All gadgets are electronics.',
        hintMd: 'Syllogism Analysis: Draw Venn intersection between Electronics and Gadgets, and fully enclose Gadgets within Portable.',
        conceptTag: 'Syllogisms & Deductive Logic',
        difficulty: 'Moderate',
        options: [
          { id: 'opt-r1-a', order: 0, bodyMd: 'Only Conclusion I follows', isCorrect: true },
          { id: 'opt-r1-b', order: 1, bodyMd: 'Only Conclusion II follows', isCorrect: false },
          { id: 'opt-r1-c', order: 2, bodyMd: 'Conclusions I and II follow', isCorrect: false },
          { id: 'opt-r1-d', order: 3, bodyMd: 'All conclusions follow', isCorrect: false },
        ],
        explanationMd: 'Gadgets overlap with Electronics, and all Gadgets are Portable. Therefore, the common part of Gadgets and Electronics must also be Portable. Thus, Conclusion I definitely follows. Conclusion II does not necessarily follow because Laptops may not intersect Gadgets.',
        timeSpentSec: 50,
      },
      {
        id: 'q-reas-2',
        sectionId: 'sec-reasoning',
        order: 2,
        type: 'MCQ_SINGLE',
        marksCorrect: 1.0,
        marksIncorrect: 0.25,
        stemMd: 'In a certain code language, **"STREAM"** is coded as **"TUSFBN"**. In that same pattern, how will **"LAUNCH"** be coded?',
        hintMd: 'Coding-Decoding: Check shift per letter: S(+1)=T, T(+1)=U, R(+1)=S, E(+1)=F, A(+1)=B, M(+1)=N.',
        conceptTag: 'Coding & Decoding',
        difficulty: 'Easy',
        options: [
          { id: 'opt-r2-a', order: 0, bodyMd: 'MZXODI', isCorrect: false },
          { id: 'opt-r2-b', order: 1, bodyMd: 'MBVODI', isCorrect: true },
          { id: 'opt-r2-c', order: 2, bodyMd: 'MCVPEJ', isCorrect: false },
          { id: 'opt-r2-d', order: 3, bodyMd: 'LAVODI', isCorrect: false },
        ],
        explanationMd: 'L+1=M, A+1=B, U+1=V, N+1=O, C+1=D, H+1=I.\nHence code is **MBVODI**.',
        timeSpentSec: 22,
      },
      {
        id: 'q-reas-3',
        sectionId: 'sec-reasoning',
        order: 3,
        type: 'MCQ_SINGLE',
        marksCorrect: 1.0,
        marksIncorrect: 0.25,
        stemMd: 'Pointing to a photograph, a woman says: "His mother is the only daughter of my mother." How is the woman related to the person in the photograph?',
        hintMd: 'Blood Relations: "The only daughter of my mother" refers to the speaker herself (the woman).',
        conceptTag: 'Blood Relations',
        difficulty: 'Easy',
        options: [
          { id: 'opt-r3-a', order: 0, bodyMd: 'Mother', isCorrect: true },
          { id: 'opt-r3-b', order: 1, bodyMd: 'Sister', isCorrect: false },
          { id: 'opt-r3-c', order: 2, bodyMd: 'Aunt', isCorrect: false },
          { id: 'opt-r3-d', order: 3, bodyMd: 'Daughter', isCorrect: false },
        ],
        explanationMd: 'The only daughter of the woman\'s mother is the woman herself. So the person\'s mother is this woman. Thus, she is his **Mother**.',
        timeSpentSec: 28,
      },
      {
        id: 'q-reas-4',
        sectionId: 'sec-reasoning',
        order: 4,
        type: 'MCQ_SINGLE',
        marksCorrect: 1.0,
        marksIncorrect: 0.25,
        stemMd: 'Find the missing number in the sequence: **7, 14, 42, 210, ?**',
        hintMd: 'Number Series: Analyze progressive multiplier: $7 \\times 2 = 14$, $14 \\times 3 = 42$, $42 \\times 5 = 210$. Prime numbers or sequential integers?',
        conceptTag: 'Number Series',
        difficulty: 'Moderate',
        options: [
          { id: 'opt-r4-a', order: 0, bodyMd: '1050', isCorrect: false },
          { id: 'opt-r4-b', order: 1, bodyMd: '1260', isCorrect: false },
          { id: 'opt-r4-c', order: 2, bodyMd: '1470', isCorrect: true },
          { id: 'opt-r4-d', order: 3, bodyMd: '1680', isCorrect: false },
        ],
        explanationMd: 'Multipliers are consecutive prime numbers:\n- $7 \\times 2 = 14$\n- $14 \\times 3 = 42$\n- $42 \\times 5 = 210$\n- $210 \\times 7 = \\mathbf{1470}$.',
        timeSpentSec: 44,
      },
      {
        id: 'q-reas-5',
        sectionId: 'sec-reasoning',
        order: 5,
        type: 'MCQ_SINGLE',
        marksCorrect: 1.0,
        marksIncorrect: 0.25,
        stemMd: 'A person walks 10 meters North, turns right and walks 15 meters, then turns right again and walks 10 meters, and finally turns left and walks 5 meters. How far and in what direction is he from his starting point?',
        hintMd: 'Direction Sense: Net North-South = 10 - 10 = 0. Net East-West = 15 + 5 = 20 East.',
        conceptTag: 'Direction Sense',
        difficulty: 'Easy',
        options: [
          { id: 'opt-r5-a', order: 0, bodyMd: '20 meters East', isCorrect: true },
          { id: 'opt-r5-b', order: 1, bodyMd: '25 meters North', isCorrect: false },
          { id: 'opt-r5-c', order: 2, bodyMd: '15 meters East', isCorrect: false },
          { id: 'opt-r5-d', order: 3, bodyMd: '20 meters West', isCorrect: false },
        ],
        explanationMd: 'North 10m, East 15m, South 10m, East 5m. Total displacement = $15 + 5 = \\mathbf{20\\text{ meters East}}$.',
        timeSpentSec: 36,
      },
      {
        id: 'q-reas-6',
        sectionId: 'sec-reasoning',
        order: 6,
        type: 'MCQ_SINGLE',
        marksCorrect: 1.0,
        marksIncorrect: 0.25,
        stemMd: 'Five friends P, Q, R, S, and T are sitting around a circular table facing the center. P sits between Q and T. S is to the immediate right of Q. Who is sitting to the immediate left of R?',
        hintMd: 'Seating Arrangement: Circular placement clockwise or counterclockwise.',
        conceptTag: 'Seating Arrangements',
        difficulty: 'Moderate',
        options: [
          { id: 'opt-r6-a', order: 0, bodyMd: 'T', isCorrect: true },
          { id: 'opt-r6-b', order: 1, bodyMd: 'S', isCorrect: false },
          { id: 'opt-r6-c', order: 2, bodyMd: 'P', isCorrect: false },
          { id: 'opt-r6-d', order: 3, bodyMd: 'Q', isCorrect: false },
        ],
        explanationMd: 'Arranging positions:\nQ is left of P, P is left of T, S is right of Q. R must take the remaining slot between S and T. Immediate left of R is **T**.',
        timeSpentSec: 75,
      },
      {
        id: 'q-reas-7',
        sectionId: 'sec-reasoning',
        order: 7,
        type: 'MCQ_SINGLE',
        marksCorrect: 1.0,
        marksIncorrect: 0.25,
        stemMd: 'Which word does NOT belong with the others?\n**Inch, Centimeter, Yard, Ounce**',
        hintMd: 'Analogy & Classification: Check physical dimensions (Length vs Mass).',
        conceptTag: 'Classification',
        difficulty: 'Easy',
        options: [
          { id: 'opt-r7-a', order: 0, bodyMd: 'Inch', isCorrect: false },
          { id: 'opt-r7-b', order: 1, bodyMd: 'Centimeter', isCorrect: false },
          { id: 'opt-r7-c', order: 2, bodyMd: 'Yard', isCorrect: false },
          { id: 'opt-r7-d', order: 3, bodyMd: 'Ounce', isCorrect: true },
        ],
        explanationMd: 'Inch, Centimeter, and Yard are units of length/distance. **Ounce** is a unit of mass/weight.',
        timeSpentSec: 15,
      },
      {
        id: 'q-reas-8',
        sectionId: 'sec-reasoning',
        order: 8,
        type: 'MCQ_SINGLE',
        marksCorrect: 1.0,
        marksIncorrect: 0.25,
        stemMd: 'If "A + B" means A is the brother of B; "A - B" means A is the sister of B; and "A × B" means A is the father of B. Which of the following expressions means that C is the son of M?',
        hintMd: 'Coded Relations: C must be male (+ relation) and child of M.',
        conceptTag: 'Coded Relations',
        difficulty: 'Moderate',
        options: [
          { id: 'opt-r8-a', order: 0, bodyMd: 'M × C + N', isCorrect: true },
          { id: 'opt-r8-b', order: 1, bodyMd: 'M - C × N', isCorrect: false },
          { id: 'opt-r8-c', order: 2, bodyMd: 'M + C × N', isCorrect: false },
          { id: 'opt-r8-d', order: 3, bodyMd: 'C × M + N', isCorrect: false },
        ],
        explanationMd: '$M \\times C$ means M is father of C. $C + N$ means C is brother of N (confirming C is male). Therefore, C is the son of M.',
        timeSpentSec: 46,
      },
      {
        id: 'q-reas-9',
        sectionId: 'sec-reasoning',
        order: 9,
        type: 'MCQ_SINGLE',
        marksCorrect: 1.0,
        marksIncorrect: 0.25,
        stemMd: 'In a row of 40 students facing North, Amit is 14th from the left end and Deepak is 16th from the right end. How many students are there between Amit and Deepak?',
        hintMd: 'Ranking Order: Total = (Left + Right + Middle). Compare (14 + 16) with 40.',
        conceptTag: 'Order & Ranking',
        difficulty: 'Easy',
        options: [
          { id: 'opt-r9-a', order: 0, bodyMd: '10', isCorrect: true },
          { id: 'opt-r9-b', order: 1, bodyMd: '8', isCorrect: false },
          { id: 'opt-r9-c', order: 2, bodyMd: '12', isCorrect: false },
          { id: 'opt-r9-d', order: 3, bodyMd: '9', isCorrect: false },
        ],
        explanationMd: 'Students between = $40 - (14 + 16) = 40 - 30 = \\mathbf{10}$.',
        timeSpentSec: 20,
      },
      {
        id: 'q-reas-10',
        sectionId: 'sec-reasoning',
        order: 10,
        type: 'MCQ_SINGLE',
        marksCorrect: 1.0,
        marksIncorrect: 0.25,
        stemMd: 'Complete the letter series: **AZ, CX, EV, GT, ?**',
        hintMd: 'Alphanumeric Patterns: First letter increments by 2 (A, C, E, G, I). Second letter decreases from reverse alphabet (Z, X, V, T, R).',
        conceptTag: 'Letter Series',
        difficulty: 'Easy',
        options: [
          { id: 'opt-r10-a', order: 0, bodyMd: 'IR', isCorrect: true },
          { id: 'opt-r10-b', order: 1, bodyMd: 'IS', isCorrect: false },
          { id: 'opt-r10-c', order: 2, bodyMd: 'HS', isCorrect: false },
          { id: 'opt-r10-d', order: 3, bodyMd: 'JQ', isCorrect: false },
        ],
        explanationMd: 'G+2 = I; T-2 = R. Next pair is **IR**.',
        timeSpentSec: 18,
      },

      // ── Verbal Ability ──
      {
        id: 'q-verb-1',
        sectionId: 'sec-verbal',
        order: 1,
        type: 'MCQ_SINGLE',
        marksCorrect: 1.0,
        marksIncorrect: 0.25,
        stemMd: 'Select the option that rectifies the grammatical error in the underlined segment:\n\n"The committee *have submitted its* comprehensive recommendations to the university chancellor."',
        hintMd: 'Subject-Verb Agreement: Collective nouns acting as a single unit take singular verbs.',
        conceptTag: 'Grammar & Subject-Verb Agreement',
        difficulty: 'Moderate',
        options: [
          { id: 'opt-v1-a', order: 0, bodyMd: 'has submitted its', isCorrect: true },
          { id: 'opt-v1-b', order: 1, bodyMd: 'have submitted their', isCorrect: false },
          { id: 'opt-v1-c', order: 2, bodyMd: 'has submitted their', isCorrect: false },
          { id: 'opt-v1-d', order: 3, bodyMd: 'had submit its', isCorrect: false },
        ],
        explanationMd: 'The collective noun "committee" acts as a singular unit, so it requires the singular auxiliary "has" alongside the singular pronoun "its": **has submitted its**.',
        timeSpentSec: 35,
      },
      {
        id: 'q-verb-2',
        sectionId: 'sec-verbal',
        order: 2,
        type: 'MCQ_SINGLE',
        marksCorrect: 1.0,
        marksIncorrect: 0.25,
        stemMd: 'Choose the word most nearly **OPPOSITE** in meaning to the word:\n\n**"EPHEMERAL"**',
        hintMd: 'Vocabulary: Ephemeral means lasting for a very short time; fleeting.',
        conceptTag: 'Antonyms',
        difficulty: 'Moderate',
        options: [
          { id: 'opt-v2-a', order: 0, bodyMd: 'Transient', isCorrect: false },
          { id: 'opt-v2-b', order: 1, bodyMd: 'Eternal', isCorrect: true },
          { id: 'opt-v2-c', order: 2, bodyMd: 'Evanescent', isCorrect: false },
          { id: 'opt-v2-d', order: 3, bodyMd: 'Brief', isCorrect: false },
        ],
        explanationMd: 'Ephemeral means fleeting or short-lived. The direct antonym is **Eternal** (lasting forever).',
        timeSpentSec: 16,
      },
      {
        id: 'q-verb-3',
        sectionId: 'sec-verbal',
        order: 3,
        type: 'MCQ_SINGLE',
        marksCorrect: 1.0,
        marksIncorrect: 0.25,
        stemMd: 'Fill in the blank with the appropriate preposition:\n\n"The research team was oblivious _______ the potential hazards lurking in the subterranean laboratory."',
        hintMd: 'Prepositional Collocations: Oblivious takes a specific preposition.',
        conceptTag: 'Prepositions & Phrasal Verbs',
        difficulty: 'Easy',
        options: [
          { id: 'opt-v3-a', order: 0, bodyMd: 'to', isCorrect: true },
          { id: 'opt-v3-b', order: 1, bodyMd: 'with', isCorrect: false },
          { id: 'opt-v3-c', order: 2, bodyMd: 'at', isCorrect: false },
          { id: 'opt-v3-d', order: 3, bodyMd: 'for', isCorrect: false },
        ],
        explanationMd: 'The adjective "oblivious" correctly collocated with **"to"** (or occasionally "of"), meaning unaware or unconscious of something.',
        timeSpentSec: 20,
      },
      {
        id: 'q-verb-4',
        sectionId: 'sec-verbal',
        order: 4,
        type: 'MCQ_SINGLE',
        marksCorrect: 1.0,
        marksIncorrect: 0.25,
        stemMd: 'Rearrange the following sentences (P, Q, R, S) into a coherent paragraph:\n\nP. Furthermore, autonomous machine learning algorithms accelerate data synthesis.\nQ. Modern healthcare delivery is experiencing a paradigm shift powered by technology.\nR. In particular, diagnostic imaging precision has surged exponentially.\nS. Consequently, patient triage times have decreased by more than 40%.',
        hintMd: 'Para Jumbles: Identify opening introductory topic sentence.',
        conceptTag: 'Sentence Ordering / Para Jumbles',
        difficulty: 'Moderate',
        options: [
          { id: 'opt-v4-a', order: 0, bodyMd: 'Q - R - P - S', isCorrect: true },
          { id: 'opt-v4-b', order: 1, bodyMd: 'P - Q - R - S', isCorrect: false },
          { id: 'opt-v4-c', order: 2, bodyMd: 'R - P - Q - S', isCorrect: false },
          { id: 'opt-v4-d', order: 3, bodyMd: 'Q - S - P - R', isCorrect: false },
        ],
        explanationMd: 'Q introduces the broad topic (healthcare technology). R cites a specific area (imaging). P adds another point (ML synthesis). S delivers the concluding outcome (patient triage times). The optimal flow is **Q - R - P - S**.',
        timeSpentSec: 58,
      },
      {
        id: 'q-verb-5',
        sectionId: 'sec-verbal',
        order: 5,
        type: 'MCQ_SINGLE',
        marksCorrect: 1.0,
        marksIncorrect: 0.25,
        stemMd: 'Identify the meaning of the idiom:\n\n**"Burn the candle at both ends"**',
        hintMd: 'Idioms & Phrases: Think of working day and night without adequate rest.',
        conceptTag: 'Idioms & Phrases',
        difficulty: 'Easy',
        options: [
          { id: 'opt-v5-a', order: 0, bodyMd: 'To exhaust one\'s energies by working from early morning until late night', isCorrect: true },
          { id: 'opt-v5-b', order: 1, bodyMd: 'To waste monetary wealth recklessly', isCorrect: false },
          { id: 'opt-v5-c', order: 2, bodyMd: 'To create artificial light in dark surroundings', isCorrect: false },
          { id: 'opt-v5-d', order: 3, bodyMd: 'To argue simultaneously on both sides of a debate', isCorrect: false },
        ],
        explanationMd: '"Burn the candle at both ends" means to push oneself beyond physical limits by working excessively hard without enough sleep.',
        timeSpentSec: 22,
      },
    ],
  },
};

// Local storage session key helper
const STORAGE_PREFIX = 'testprep_mock_attempt_';

export function getMockPaper(paperId: string): MockPaper {
  if (MOCK_PAPERS[paperId]) {
    return MOCK_PAPERS[paperId];
  }
  // Default to TCS NQT 05
  return MOCK_PAPERS['tcs-nqt-05'];
}

export interface StoredAttemptData {
  attemptId: string;
  paperId: string;
  startedAt: string;
  expiresAt: string;
  answers: Record<string, {
    selectedOptionIds: string[];
    state: string;
    timeSpentMs?: number;
  }>;
  submittedAt?: string;
  isSubmitted: boolean;
  score?: number;
  maxScore?: number;
  accuracy?: number;
  correct?: number;
  incorrect?: number;
  unattempted?: number;
  percentile?: number;
}

export function saveAttemptToStorage(attemptId: string, data: StoredAttemptData) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${attemptId}`, JSON.stringify(data));
  } catch {}
}

export function getAttemptFromStorage(attemptId: string): StoredAttemptData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${attemptId}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function computeScoreForAttempt(paper: MockPaper, answers: Record<string, any>) {
  let correct = 0;
  let incorrect = 0;
  let unattempted = 0;
  let score = 0;

  paper.questions.forEach((q) => {
    const ans = answers[q.id];
    const userSelected = ans?.selectedOptionIds ?? [];
    if (!userSelected || userSelected.length === 0) {
      unattempted++;
      return;
    }
    const correctOption = q.options.find((o) => o.isCorrect);
    if (correctOption && userSelected.includes(correctOption.id)) {
      correct++;
      score += q.marksCorrect;
    } else {
      incorrect++;
      score -= q.marksIncorrect;
    }
  });

  const totalAttempted = correct + incorrect;
  const accuracy = totalAttempted > 0 ? (correct / totalAttempted) * 100 : 0;
  const maxScore = paper.totalMarks;
  const pct = maxScore > 0 ? (score / maxScore) * 100 : 0;
  // Dynamic realistic percentile estimate based on score percentage
  const percentile = Math.min(99.8, Math.max(12, Math.round((pct * 0.95 + 10) * 10) / 10));

  return {
    score: Math.max(0, Math.round(score * 100) / 100),
    maxScore,
    correct,
    incorrect,
    unattempted,
    accuracy: Math.round(accuracy * 10) / 10,
    percentile,
  };
}
