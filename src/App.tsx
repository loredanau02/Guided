import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { Suspense, lazy } from 'react'
import LoadingSpinner from './components/common/LoadingSpinner'
import PublicLayout from './components/layout/PublicLayout'
import DashboardLayout from './components/layout/DashboardLayout'
import ProtectedRoute from './components/common/ProtectedRoute'
import Hero from './components/landing/Hero'
import TrustBanner from './components/landing/TrustBanner'
import Features from './components/landing/Features'
import HowItWorks from './components/landing/HowItWorks'
import Stats from './components/landing/Stats'
import Testimonials from './components/landing/Testimonials'
import CallToAction from './components/landing/CallToAction'
const LoginForm = lazy(() => import('./components/auth/LoginForm'))
const RegisterForm = lazy(() => import('./components/auth/RegisterForm'))
const TeacherDashboard = lazy(() => import('./components/teacher/TeacherDashboard'))
const LessonList = lazy(() => import('./components/teacher/lessons/LessonList'))
const LessonForm = lazy(() => import('./components/teacher/lessons/LessonForm'))
const StoryList = lazy(() => import('./components/teacher/stories/StoryList'))
const StoryForm = lazy(() => import('./components/teacher/stories/StoryForm'))
const VocabularyList = lazy(() => import('./components/teacher/vocabulary/VocabularyList'))
const VocabularyForm = lazy(() => import('./components/teacher/vocabulary/VocabularyForm'))
const PronunciationList = lazy(() => import('./components/teacher/pronunciation/PronunciationList'))
const PronunciationForm = lazy(() => import('./components/teacher/pronunciation/PronunciationForm'))
const QuizList = lazy(() => import('./components/teacher/quizzes/QuizList'))
const QuizForm = lazy(() => import('./components/teacher/quizzes/QuizForm'))
const QuizResults = lazy(() => import('./components/teacher/quizzes/QuizResults'))
const StudentList = lazy(() => import('./components/teacher/students/StudentList'))
const StudentProgressView = lazy(() => import('./components/teacher/students/StudentProgressView'))
const StudentDashboard = lazy(() => import('./components/student/StudentDashboard'))
const LessonBrowser = lazy(() => import('./components/student/lessons/LessonBrowser'))
const LessonViewer = lazy(() => import('./components/student/lessons/LessonViewer'))
const StoryBrowser = lazy(() => import('./components/student/stories/StoryBrowser'))
const StoryReader = lazy(() => import('./components/student/stories/StoryReader'))
const VocabBrowser = lazy(() => import('./components/student/vocabulary/VocabBrowser'))
const VocabStudy = lazy(() => import('./components/student/vocabulary/VocabStudy'))
const PronunciationBrowser = lazy(() => import('./components/student/pronunciation/PronunciationBrowser'))
const PronunciationPractice = lazy(() => import('./components/student/pronunciation/PronunciationPractice'))
const QuizBrowser = lazy(() => import('./components/student/quizzes/QuizBrowser'))
const QuizTaker = lazy(() => import('./components/student/quizzes/QuizTaker'))
const ProgressOverview = lazy(() => import('./components/student/progress/ProgressOverview'))

function LandingPage() {
  return (
    <>
      <Hero />
      <TrustBanner />
      <Features />
      <HowItWorks />
      <Stats />
      <Testimonials />
      <CallToAction />
    </>
  )
}

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <LoadingSpinner size="lg" />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router basename="/Guided">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
            </Route>
            <Route
              path="/teacher"
              element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <DashboardLayout role="teacher" />
                </ProtectedRoute>
              }
            >
              <Route index element={<TeacherDashboard />} />
              <Route path="lessons" element={<LessonList />} />
              <Route path="lessons/new" element={<LessonForm />} />
              <Route path="lessons/:id/edit" element={<LessonForm />} />
              <Route path="stories" element={<StoryList />} />
              <Route path="stories/new" element={<StoryForm />} />
              <Route path="stories/:id/edit" element={<StoryForm />} />
              <Route path="vocabulary" element={<VocabularyList />} />
              <Route path="vocabulary/new" element={<VocabularyForm />} />
              <Route path="vocabulary/:id/edit" element={<VocabularyForm />} />
              <Route path="pronunciation" element={<PronunciationList />} />
              <Route path="pronunciation/new" element={<PronunciationForm />} />
              <Route path="pronunciation/:id/edit" element={<PronunciationForm />} />
              <Route path="quizzes" element={<QuizList />} />
              <Route path="quizzes/new" element={<QuizForm />} />
              <Route path="quizzes/:id/edit" element={<QuizForm />} />
              <Route path="quizzes/:id/results" element={<QuizResults />} />
              <Route path="students" element={<StudentList />} />
              <Route path="students/:id" element={<StudentProgressView />} />
            </Route>
            <Route
              path="/student"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <DashboardLayout role="student" />
                </ProtectedRoute>
              }
            >
              <Route index element={<StudentDashboard />} />
              <Route path="lessons" element={<LessonBrowser />} />
              <Route path="lessons/:id" element={<LessonViewer />} />
              <Route path="stories" element={<StoryBrowser />} />
              <Route path="stories/:id" element={<StoryReader />} />
              <Route path="vocabulary" element={<VocabBrowser />} />
              <Route path="vocabulary/study" element={<VocabStudy />} />
              <Route path="pronunciation" element={<PronunciationBrowser />} />
              <Route path="pronunciation/:id" element={<PronunciationPractice />} />
              <Route path="quizzes" element={<QuizBrowser />} />
              <Route path="quizzes/:id" element={<QuizTaker />} />
              <Route path="progress" element={<ProgressOverview />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  )
}

export default App