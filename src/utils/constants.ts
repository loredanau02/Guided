export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  TEACHER: {
    DASHBOARD: '/teacher',
    LESSONS: '/teacher/lessons',
    LESSON_NEW: '/teacher/lessons/new',
    LESSON_EDIT: (id: string) => `/teacher/lessons/${id}/edit`,
    STORIES: '/teacher/stories',
    STORY_NEW: '/teacher/stories/new',
    STORY_EDIT: (id: string) => `/teacher/stories/${id}/edit`,
    VOCABULARY: '/teacher/vocabulary',
    VOCAB_NEW: '/teacher/vocabulary/new',
    VOCAB_EDIT: (id: string) => `/teacher/vocabulary/${id}/edit`,
    PRONUNCIATION: '/teacher/pronunciation',
    PRONUNCIATION_NEW: '/teacher/pronunciation/new',
    PRONUNCIATION_EDIT: (id: string) => `/teacher/pronunciation/${id}/edit`,
    QUIZZES: '/teacher/quizzes',
    QUIZ_NEW: '/teacher/quizzes/new',
    QUIZ_EDIT: (id: string) => `/teacher/quizzes/${id}/edit`,
    QUIZ_RESULTS: (id: string) => `/teacher/quizzes/${id}/results`,
    STUDENTS: '/teacher/students',
    STUDENT_DETAIL: (id: string) => `/teacher/students/${id}`,
  },
  STUDENT: {
    DASHBOARD: '/student',
    LESSONS: '/student/lessons',
    LESSON_VIEW: (id: string) => `/student/lessons/${id}`,
    STORIES: '/student/stories',
    STORY_VIEW: (id: string) => `/student/stories/${id}`,
    VOCABULARY: '/student/vocabulary',
    VOCAB_STUDY: '/student/vocabulary/study',
    PRONUNCIATION: '/student/pronunciation',
    PRONUNCIATION_PRACTICE: (id: string) => `/student/pronunciation/${id}`,
    QUIZZES: '/student/quizzes',
    QUIZ_TAKE: (id: string) => `/student/quizzes/${id}`,
    QUIZ_REVIEW: (id: string, attemptId: string) => `/student/quizzes/${id}/review/${attemptId}`,
    PROGRESS: '/student/progress',
  },
} as const

export const DIFFICULTY_OPTIONS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
] as const

export const DIFFICULTY_COLORS = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-red-100 text-red-800',
} as const

export const PART_OF_SPEECH_OPTIONS = [
  'noun', 'verb', 'adjective', 'adverb', 'preposition', 'conjunction', 'pronoun', 'interjection', 'other',
] as const

export const QUIZ_TYPE_OPTIONS = [
  { value: 'grammar', label: 'Grammar' },
  { value: 'vocabulary', label: 'Vocabulary' },
  { value: 'story_comprehension', label: 'Story Comprehension' },
  { value: 'mixed', label: 'Mixed' },
] as const

export const QUESTION_TYPE_OPTIONS = [
  { value: 'multiple_choice', label: 'Multiple Choice' },
  { value: 'true_false', label: 'True / False' },
  { value: 'fill_in_blank', label: 'Fill in the Blank' },
] as const