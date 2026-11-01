import { PrismaClient, QuestionType } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedAssessments() {
  console.log('🌱 Starting Online Assessment (OA) Seeding...');

  // 1. Fetch domains
  const fullstackDomain = await prisma.domain.findUnique({ where: { slug: 'fullstack' } });
  const frontendDomain = await prisma.domain.findUnique({ where: { slug: 'frontend' } });
  const backendDomain = await prisma.domain.findUnique({ where: { slug: 'backend' } });

  if (!fullstackDomain || !frontendDomain || !backendDomain) {
    throw new Error('Domains not found. Please run prisma/seed.ts first.');
  }

  // Domain 1: Full Stack Assessment
  const fsAssessment = await prisma.assessment.upsert({
    where: { id: 'assessment-fs-core-101' },
    update: {
      title: 'Full Stack Engineering Core Screening',
      description: 'Comprehensive screening covering asynchronous JavaScript, REST APIs, database transactions, and algorithmic problem-solving.',
      durationMinutes: 45,
      passingScore: 70.0,
      isActive: true,
      domainId: fullstackDomain.id,
    },
    create: {
      id: 'assessment-fs-core-101',
      domainId: fullstackDomain.id,
      title: 'Full Stack Engineering Core Screening',
      description: 'Comprehensive screening covering asynchronous JavaScript, REST APIs, database transactions, and algorithmic problem-solving.',
      durationMinutes: 45,
      passingScore: 70.0,
      isActive: true,
    },
  });

  // Questions for Full Stack
  const fsQuestions = [
    {
      id: 'fs-q1-mcq',
      assessmentId: fsAssessment.id,
      type: QuestionType.MCQ,
      title: 'JavaScript Event Loop & Microtasks',
      prompt: 'In Node.js and modern browsers, which queue takes highest priority when resolving microtasks after the currently executing script completes?',
      points: 10,
      orderIndex: 0,
      options: [
        'Timer queue (setTimeout / setInterval callbacks)',
        'I/O polling queue (fs / net callbacks)',
        'Microtask queue (Promise.then / process.nextTick / queueMicrotask)',
        'Check phase (setImmediate callbacks)',
      ],
      correctOption: 2,
    },
    {
      id: 'fs-q2-mcq',
      assessmentId: fsAssessment.id,
      type: QuestionType.MCQ,
      title: 'HTTP Idempotency & Safe Methods',
      prompt: 'According to RFC 9110 HTTP Semantics, which of the following HTTP methods is defined as IDEMPOTENT but NOT safe?',
      points: 10,
      orderIndex: 1,
      options: ['GET', 'POST', 'DELETE', 'PATCH'],
      correctOption: 2,
    },
    {
      id: 'fs-q3-mcq',
      assessmentId: fsAssessment.id,
      type: QuestionType.MCQ,
      title: 'Database Concurrency & Isolation',
      prompt: 'Which ANSI SQL transaction isolation level prevents Dirty Reads and Non-Repeatable Reads, but allows Phantom Reads?',
      points: 10,
      orderIndex: 2,
      options: ['Read Uncommitted', 'Read Committed', 'Repeatable Read', 'Serializable'],
      correctOption: 2,
    },
    {
      id: 'fs-q4-code',
      assessmentId: fsAssessment.id,
      type: QuestionType.CODING,
      title: 'Two Sum (Optimal Hash Map Lookup)',
      prompt: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume each input has exactly one solution, and you may not use the same element twice. Return the indices in ascending order.',
      points: 35,
      orderIndex: 3,
      starterCode: {
        javascript: 'function twoSum(nums, target) {\n  // Write your code here\n  // Return [index1, index2]\n}',
        python: 'def two_sum(nums, target):\n    # Write your code here\n    # Return [index1, index2]\n    pass',
      },
      testCases: [
        {
          id: 'tc-fs-1',
          input: 'nums = [2, 7, 11, 15], target = 9',
          expectedOutput: '[0, 1]',
          isHidden: false,
          description: 'Standard basic pair',
        },
        {
          id: 'tc-fs-2',
          input: 'nums = [3, 2, 4], target = 6',
          expectedOutput: '[1, 2]',
          isHidden: false,
          description: 'Indices not at start',
        },
        {
          id: 'tc-fs-3',
          input: 'nums = [3, 3], target = 6',
          expectedOutput: '[0, 1]',
          isHidden: true,
          description: 'Duplicate values',
        },
        {
          id: 'tc-fs-4',
          input: 'nums = [-1, -2, -3, -4, -5], target = -8',
          expectedOutput: '[2, 4]',
          isHidden: true,
          description: 'Negative numbers',
        },
      ],
      solutionCode: 'function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}',
    },
    {
      id: 'fs-q5-code',
      assessmentId: fsAssessment.id,
      type: QuestionType.CODING,
      title: 'Valid Palindrome (Alphanumeric)',
      prompt: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.\n\nGiven a string `s`, return `true` if it is a palindrome, or `false` otherwise.',
      points: 35,
      orderIndex: 4,
      starterCode: {
        javascript: 'function isPalindrome(s) {\n  // Write your code here\n  // Return boolean true or false\n}',
        python: 'def is_palindrome(s):\n    # Write your code here\n    # Return bool\n    pass',
      },
      testCases: [
        {
          id: 'tc-fs-p1',
          input: 's = "A man, a plan, a canal: Panama"',
          expectedOutput: 'true',
          isHidden: false,
          description: 'Standard mixed phrase with punctuation',
        },
        {
          id: 'tc-fs-p2',
          input: 's = "race a car"',
          expectedOutput: 'false',
          isHidden: false,
          description: 'Non-palindrome phrase',
        },
        {
          id: 'tc-fs-p3',
          input: 's = " "',
          expectedOutput: 'true',
          isHidden: true,
          description: 'Empty string / whitespace only',
        },
        {
          id: 'tc-fs-p4',
          input: 's = "0P"',
          expectedOutput: 'false',
          isHidden: true,
          description: 'Alphanumeric mismatch',
        },
      ],
      solutionCode: 'function isPalindrome(s) {\n  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, "");\n  return clean === clean.split("").reverse().join("");\n}',
    },
  ];

  // Upsert questions for Full Stack
  for (const q of fsQuestions) {
    await prisma.question.upsert({
      where: { id: q.id },
      update: q,
      create: q,
    });
  }
  console.log(`   - Seeded Assessment & ${fsQuestions.length} Questions for Full Stack`);

  // Domain 2: Frontend Assessment
  const feAssessment = await prisma.assessment.upsert({
    where: { id: 'assessment-fe-core-102' },
    update: {
      title: 'Frontend Engineering Core Assessment',
      description: 'Focuses on React component architecture, hook lifecycles, CSS box model/specificity, and DOM algorithms.',
      durationMinutes: 45,
      passingScore: 70.0,
      isActive: true,
      domainId: frontendDomain.id,
    },
    create: {
      id: 'assessment-fe-core-102',
      domainId: frontendDomain.id,
      title: 'Frontend Engineering Core Assessment',
      description: 'Focuses on React component architecture, hook lifecycles, CSS box model/specificity, and DOM algorithms.',
      durationMinutes: 45,
      passingScore: 70.0,
      isActive: true,
    },
  });

  const feQuestions = [
    {
      id: 'fe-q1-mcq',
      assessmentId: feAssessment.id,
      type: QuestionType.MCQ,
      title: 'CSS Specificity Hierarchy',
      prompt: 'Which CSS selector has the highest specificity weight among the following?',
      points: 10,
      orderIndex: 0,
      options: [
        'div.header > nav.menu a:hover',
        '#main-header .nav-item',
        'body #content div p.text-bold',
        'nav#navbar ul li.active',
      ],
      correctOption: 1, // #main-header .nav-item has 1 ID + 1 Class = (0, 1, 1, 0) vs others
    },
    {
      id: 'fe-q2-mcq',
      assessmentId: feAssessment.id,
      type: QuestionType.MCQ,
      title: 'React useMemo vs useCallback',
      prompt: 'What is the precise behavioral difference between `useMemo` and `useCallback` in React?',
      points: 10,
      orderIndex: 1,
      options: [
        'useMemo caches JSX elements only; useCallback caches DOM references',
        'useMemo caches the result of calling a function; useCallback caches the function instance itself',
        'useMemo runs asynchronously on background threads; useCallback runs synchronously',
        'useMemo re-renders children; useCallback suppresses renders',
      ],
      correctOption: 1,
    },
    {
      id: 'fe-q3-code',
      assessmentId: feAssessment.id,
      type: QuestionType.CODING,
      title: 'Debounce Implementation',
      prompt: 'Implement a debounce function that takes a callback `fn` and a delay `wait` in milliseconds, returning a throttled/debounced executor.',
      points: 40,
      orderIndex: 2,
      starterCode: {
        javascript: 'function debounce(fn, wait) {\n  let timerId = null;\n  return function(...args) {\n    // Implement debounce\n  };\n}',
      },
      testCases: [
        {
          id: 'tc-fe-d1',
          input: 'fn called 3 times within 50ms (wait=100ms)',
          expectedOutput: 'Called once after 100ms',
          isHidden: false,
          description: 'Basic debounce coalescing',
        },
      ],
      solutionCode: 'function debounce(fn, wait) {\n  let timerId = null;\n  return function(...args) {\n    clearTimeout(timerId);\n    timerId = setTimeout(() => fn.apply(this, args), wait);\n  };\n}',
    },
  ];

  for (const q of feQuestions) {
    await prisma.question.upsert({
      where: { id: q.id },
      update: q,
      create: q,
    });
  }
  console.log(`   - Seeded Assessment & ${feQuestions.length} Questions for Frontend`);

  // Domain 3: Backend Assessment
  const beAssessment = await prisma.assessment.upsert({
    where: { id: 'assessment-be-core-103' },
    update: {
      title: 'Backend Systems & API Architecture',
      description: 'Distributed cache invalidation, indexing strategies, rate limiting, and systems concurrency.',
      durationMinutes: 45,
      passingScore: 70.0,
      isActive: true,
      domainId: backendDomain.id,
    },
    create: {
      id: 'assessment-be-core-103',
      domainId: backendDomain.id,
      title: 'Backend Systems & API Architecture',
      description: 'Distributed cache invalidation, indexing strategies, rate limiting, and systems concurrency.',
      durationMinutes: 45,
      passingScore: 70.0,
      isActive: true,
    },
  });

  const beQuestions = [
    {
      id: 'be-q1-mcq',
      assessmentId: beAssessment.id,
      type: QuestionType.MCQ,
      title: 'Distributed Cache Stampede Prevention',
      prompt: 'When a popular cached key expires under high read traffic, which pattern best prevents the "Thundering Herd" or cache stampede problem?',
      points: 15,
      orderIndex: 0,
      options: [
        'Setting TTL to zero',
        'Mutex lock (probabilistic early expiration / cache warming)',
        'Increasing client-side timeout',
        'Switching from Redis to Memcached',
      ],
      correctOption: 1,
    },
    {
      id: 'be-q2-code',
      assessmentId: beAssessment.id,
      type: QuestionType.CODING,
      title: 'LRU Cache Design',
      prompt: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache with `get(key)` and `put(key, value)` operations in O(1) time complexity.',
      points: 45,
      orderIndex: 1,
      starterCode: {
        javascript: 'class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.map = new Map();\n  }\n  get(key) {\n    // Implement get\n  }\n  put(key, value) {\n    // Implement put\n  }\n}',
      },
      testCases: [
        {
          id: 'tc-be-lru-1',
          input: 'capacity=2, put(1, 1), put(2, 2), get(1), put(3, 3), get(2)',
          expectedOutput: '[null, null, 1, null, -1]',
          isHidden: false,
          description: 'Basic LRU eviction test',
        },
      ],
      solutionCode: 'class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.map = new Map();\n  }\n  get(key) {\n    if (!this.map.has(key)) return -1;\n    const val = this.map.get(key);\n    this.map.delete(key);\n    this.map.set(key, val);\n    return val;\n  }\n  put(key, value) {\n    if (this.map.has(key)) this.map.delete(key);\n    this.map.set(key, value);\n    if (this.map.size > this.capacity) {\n      const firstKey = this.map.keys().next().value;\n      this.map.delete(firstKey);\n    }\n  }\n}',
    },
  ];

  for (const q of beQuestions) {
    await prisma.question.upsert({
      where: { id: q.id },
      update: q,
      create: q,
    });
  }
  console.log(`   - Seeded Assessment & ${beQuestions.length} Questions for Backend`);

  console.log('✅ All OA Assessments and Questions seeded successfully!');
}

// Run directly if invoked via CLI
if (require.main === module) {
  seedAssessments()
    .catch((e) => {
      console.error('Failed to seed OA assessments:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
