import { VocabItem, Module, Project } from '../contexts/AppContext'

// Sample vocabulary data
export const sampleVocabItems: VocabItem[] = [
  {
    id: '1',
    keyword: 'algorithm',
    definition: 'A process or set of rules to be followed in calculations or other problem-solving operations',
    example: 'The sorting algorithm efficiently organized the data.',
    pronunciation: '/ˈælɡəˌrɪðəm/',
    tag: 'Computer Science',
    failed: 2,
    passed1: 5,
    passed2: 3,
    successRate: 0.8,
    inQueue: 1,
    quitQueue: 0,
    rankPoint: 150
  },
  {
    id: '2',
    keyword: 'ubiquitous',
    definition: 'Present, appearing, or found everywhere',
    example: 'Smartphones have become ubiquitous in modern society.',
    pronunciation: '/juːˈbɪkwɪtəs/',
    tag: 'Vocabulary',
    failed: 1,
    passed1: 3,
    passed2: 4,
    successRate: 0.875,
    inQueue: 0,
    quitQueue: 0,
    rankPoint: 200
  },
  {
    id: '3',
    keyword: 'paradigm',
    definition: 'A typical example or pattern of something; a model',
    example: 'The new educational paradigm focuses on student-centered learning.',
    pronunciation: '/ˈpærəˌdaɪm/',
    tag: 'General',
    failed: 3,
    passed1: 2,
    passed2: 1,
    successRate: 0.5,
    inQueue: 2,
    quitQueue: 1,
    rankPoint: 75
  },
  {
    id: '4',
    keyword: 'meticulous',
    definition: 'Showing great attention to detail; very careful and precise',
    example: 'The artist was meticulous in her attention to every brushstroke.',
    pronunciation: '/məˈtɪkjʊləs/',
    tag: 'Vocabulary',
    failed: 0,
    passed1: 4,
    passed2: 5,
    successRate: 1.0,
    inQueue: 0,
    quitQueue: 0,
    rankPoint: 250
  },
  {
    id: '5',
    keyword: 'ephemeral',
    definition: 'Lasting for a very short time',
    example: 'The beauty of cherry blossoms is ephemeral, lasting only a few days.',
    pronunciation: '/ɪˈfɛmərəl/',
    tag: 'Literature',
    failed: 1,
    passed1: 1,
    passed2: 2,
    successRate: 0.75,
    inQueue: 1,
    quitQueue: 0,
    rankPoint: 120
  }
]

export const sampleModules: Module[] = [
  {
    id: '1',
    name: 'Computer Science Terms',
    tableId: 'sample-table',
    questionColumn: 'definition',
    answerColumn: 'keyword',
    type: 'typing'
  },
  {
    id: '2',
    name: 'Vocabulary MCQ',
    tableId: 'sample-table',
    questionColumn: 'definition',
    answerColumn: 'keyword',
    type: 'mcq',
    distractors: 3
  },
  {
    id: '3',
    name: 'True or False',
    tableId: 'sample-table',
    questionColumn: 'example',
    answerColumn: 'keyword',
    type: 'true-false'
  }
]

export const sampleProjects: Project[] = [
  {
    id: '1',
    name: 'Sample Study Session',
    moduleIds: ['1', '2', '3'],
    mode: 'Random'
  },
  {
    id: '2',
    name: 'Vocabulary Focus',
    moduleIds: ['2'],
    mode: 'Ordered'
  }
]

// Sample data loader
export function loadSampleData(): {
  vocabItems: VocabItem[]
  modules: Module[]
  projects: Project[]
} {
  return {
    vocabItems: sampleVocabItems,
    modules: sampleModules,
    projects: sampleProjects
  }
}
