// Sample vocabulary data for Grade 5 learners

import { VocabItem, Module, Project, DEFAULT_MODULE_SETTINGS } from '../core/models'

export const sampleVocabItems: VocabItem[] = [
  {
    id: 'sample_1',
    term: 'abundant',
    meaning: 'existing in large quantities; plentiful',
    example: 'The forest was abundant with wildlife.',
    tags: ['adjective', 'nature'],
    passed1: 0,
    passed2: 0,
    failed: 0,
    createdAt: Date.now() - 86400000, // 1 day ago
    updatedAt: Date.now() - 86400000
  },
  {
    id: 'sample_2',
    term: 'curious',
    meaning: 'eager to know or learn something',
    example: 'She was curious about how the machine worked.',
    tags: ['adjective', 'personality'],
    passed1: 1,
    passed2: 0,
    failed: 1,
    createdAt: Date.now() - 172800000, // 2 days ago
    updatedAt: Date.now() - 86400000,
    lastReviewedAt: Date.now() - 86400000
  },
  {
    id: 'sample_3',
    term: 'determine',
    meaning: 'to decide or establish exactly',
    example: 'We need to determine the best route to take.',
    tags: ['verb', 'decision'],
    passed1: 2,
    passed2: 1,
    failed: 0,
    createdAt: Date.now() - 259200000, // 3 days ago
    updatedAt: Date.now() - 172800000,
    lastReviewedAt: Date.now() - 172800000
  },
  {
    id: 'sample_4',
    term: 'enormous',
    meaning: 'very large in size or quantity',
    example: 'The elephant was enormous compared to the mouse.',
    tags: ['adjective', 'size'],
    passed1: 0,
    passed2: 0,
    failed: 2,
    createdAt: Date.now() - 345600000, // 4 days ago
    updatedAt: Date.now() - 86400000,
    lastReviewedAt: Date.now() - 86400000
  },
  {
    id: 'sample_5',
    term: 'fragile',
    meaning: 'easily broken or damaged',
    example: 'Handle the glass vase carefully because it is fragile.',
    tags: ['adjective', 'physical'],
    passed1: 3,
    passed2: 2,
    failed: 1,
    createdAt: Date.now() - 432000000, // 5 days ago
    updatedAt: Date.now() - 259200000,
    lastReviewedAt: Date.now() - 259200000
  }
]

export const sampleModules: Module[] = [
  {
    id: 'mcq_default',
    name: 'Multiple Choice Questions',
    description: 'Choose the correct meaning from 4 options',
    type: 'mcq',
    settings: DEFAULT_MODULE_SETTINGS.mcq,
    isActive: true,
    createdAt: Date.now() - 432000000,
    updatedAt: Date.now() - 432000000
  },
  {
    id: 'tf_default',
    name: 'True or False',
    description: 'Decide if the statement is true or false',
    type: 'true-false',
    settings: DEFAULT_MODULE_SETTINGS.trueFalse,
    isActive: true,
    createdAt: Date.now() - 432000000,
    updatedAt: Date.now() - 432000000
  },
  {
    id: 'typing_default',
    name: 'Type the Answer',
    description: 'Type the correct meaning or term',
    type: 'typing',
    settings: DEFAULT_MODULE_SETTINGS.typing,
    isActive: true,
    createdAt: Date.now() - 432000000,
    updatedAt: Date.now() - 432000000
  }
]

export const sampleProject: Project = {
  id: 'grade5_basics',
  name: 'Grade 5 Vocabulary Basics',
  description: 'Essential vocabulary words for Grade 5 students',
  modules: ['mcq_default', 'tf_default', 'typing_default'],
  items: ['sample_1', 'sample_2', 'sample_3', 'sample_4', 'sample_5'],
  isActive: true,
  createdAt: Date.now() - 432000000,
  updatedAt: Date.now() - 86400000
}

// Additional vocabulary for expanded testing
export const extendedVocabItems: VocabItem[] = [
  {
    id: 'extended_1',
    term: 'magnificent',
    meaning: 'extremely beautiful, elaborate, or impressive',
    example: 'The magnificent castle stood on top of the hill.',
    tags: ['adjective', 'beauty'],
    passed1: 0,
    passed2: 0,
    failed: 0,
    createdAt: Date.now() - 518400000, // 6 days ago
    updatedAt: Date.now() - 518400000
  },
  {
    id: 'extended_2',
    term: 'investigate',
    meaning: 'to examine or look into something carefully',
    example: 'The detective will investigate the mysterious case.',
    tags: ['verb', 'research'],
    passed1: 1,
    passed2: 0,
    failed: 0,
    createdAt: Date.now() - 604800000, // 7 days ago
    updatedAt: Date.now() - 259200000,
    lastReviewedAt: Date.now() - 259200000
  },
  {
    id: 'extended_3',
    term: 'ancient',
    meaning: 'very old; from a long time ago',
    example: 'The ancient ruins were thousands of years old.',
    tags: ['adjective', 'time'],
    passed1: 2,
    passed2: 1,
    failed: 1,
    createdAt: Date.now() - 691200000, // 8 days ago
    updatedAt: Date.now() - 345600000,
    lastReviewedAt: Date.now() - 345600000
  },
  {
    id: 'extended_4',
    term: 'accomplish',
    meaning: 'to complete or achieve something successfully',
    example: 'She worked hard to accomplish her goals.',
    tags: ['verb', 'achievement'],
    passed1: 0,
    passed2: 0,
    failed: 3,
    createdAt: Date.now() - 777600000, // 9 days ago
    updatedAt: Date.now() - 172800000,
    lastReviewedAt: Date.now() - 172800000
  },
  {
    id: 'extended_5',
    term: 'brilliant',
    meaning: 'very bright, clever, or outstanding',
    example: 'The student had a brilliant idea for the science project.',
    tags: ['adjective', 'intelligence'],
    passed1: 4,
    passed2: 3,
    failed: 0,
    createdAt: Date.now() - 864000000, // 10 days ago
    updatedAt: Date.now() - 432000000,
    lastReviewedAt: Date.now() - 432000000
  }
]

// Function to initialize sample data in the store
export function initializeSampleData() {
  return {
    items: [...sampleVocabItems, ...extendedVocabItems],
    modules: sampleModules,
    projects: [
      sampleProject,
      {
        id: 'extended_vocab',
        name: 'Extended Vocabulary',
        description: 'More challenging words for advanced Grade 5 learners',
        modules: ['mcq_default', 'typing_default'],
        items: ['extended_1', 'extended_2', 'extended_3', 'extended_4', 'extended_5'],
        isActive: true,
        createdAt: Date.now() - 345600000,
        updatedAt: Date.now() - 86400000
      }
    ]
  }
}

// Distractor words for MCQ questions
export const distractorWords = [
  'beautiful', 'ugly', 'small', 'large', 'happy', 'sad', 'fast', 'slow',
  'hot', 'cold', 'bright', 'dark', 'loud', 'quiet', 'rough', 'smooth',
  'hard', 'soft', 'sweet', 'bitter', 'clean', 'dirty', 'new', 'old',
  'easy', 'difficult', 'strong', 'weak', 'tall', 'short', 'wide', 'narrow',
  'thick', 'thin', 'heavy', 'light', 'full', 'empty', 'open', 'closed'
]

// Common meanings for generating distractors
export const commonMeanings = [
  'very small in size',
  'making a lot of noise',
  'having a pleasant taste',
  'moving at high speed',
  'feeling unhappy or upset',
  'having bright colors',
  'difficult to understand',
  'used for writing or drawing',
  'found in nature',
  'related to school or learning',
  'used in cooking food',
  'helpful for solving problems',
  'important for staying healthy',
  'used for entertainment',
  'related to family or friends'
]
