# Guided

Live demo: **[loredanau02.github.io/Guided](https://loredanau02.github.io/Guided)**

An English learning platform where teachers create and manage content like grammar lessons, stories, vocabulary, pronunciation exercises, quizzes and students use it to learn.

## Tech Stack

React 19 + TypeScript, built with Vite 7. Styling is Tailwind CSS v4 using the CSS-first `@theme` config (no `tailwind.config.ts` — everything lives in `index.css` via `@tailwindcss/vite`). Firebase handles auth (email/password), Firestore for the database, and Storage for files. State management is React Context for auth only. Everything else goes through service functions that talk to Firestore directly. Forms use React Hook Form. Rich text editing uses TipTap (StarterKit + Highlight + Placeholder mostly for testimonals). 
Charts are Recharts. 
Icons are Lucide React.

## How It Works

### Auth and Roles

Firebase Auth handles sign-up/sign-in. On registration, the user picks a role (teacher or student) which gets stored in a Firestore `users` document. `AuthContext` listens to `onAuthStateChanged`, fetches the user doc, and exposes `isTeacher`/`isStudent` booleans. `ProtectedRoute` reads these to gate access to the teacher and student route groups.

### Teacher Side

Teachers get a dashboard showing content counts and quick-action links. Each content type has a list view with search, publish/unpublish toggle, edit, and delete. Forms use React Hook Form for validation. The lesson and story forms include the TipTap rich text editor. Stories support linking vocabulary items (with context sentences) and grammar rules (with notes) through reference arrays on the document. Quizzes have a question builder supporting multiple choice (4 options, radio for correct answer), true/false, and fill-in-the-blank — each question has a point value and optional explanation.

Teachers can also view a student list (queries the `users` collection for `role === 'student'`) and drill into individual student progress that's a bar chart by content type and quiz attempt history.

### Student Side

Students browse published content in card grids with search. Lesson viewer renders the HTML content and auto-marks progress as `in_progress` on open, with a manual "Mark Complete" button. Story reader renders content with clickable vocabulary highlights (shows a popover with the context sentence) and grammar reference badges. Vocabulary has a flashcard study mode with show/hide, prev/next, and shuffle.

Pronunciation practice uses the Web Speech API through a custom `useSpeechRecognition` hook. The student sees the target phrase and phonetic transcription, taps a mic button, speaks, and gets word-by-word colour-coded feedback (green for matched, red for missed) with a percentage score. Best scores persist to Firestore.

Quiz taking supports timed quizzes (countdown timer with auto-submit on expiry) and untimed ones. Navigation dots show answered/unanswered questions. On submit, the attempt is scored, saved to Firestore, and the student sees a review with per-question correctness and explanations.

Progress tracking uses a composite document ID pattern (`${studentId}_${contentType}_${contentId}`) so `upsertProgress` can do a single `setDoc` with merge. The progress overview page has tabs to filter by content type with completion percentages.

### Speech Recognition

The `useSpeechRecognition` hook wraps the browser's `SpeechRecognition` API (with `webkitSpeechRecognition` fallback for Chrome). It exposes `isListening`, `transcript`, `confidence`, `startListening(lang)`, `stopListening`, and `resetTranscript`. The `comparePronunciation` utility in `speechUtils.ts` does word-by-word exact matching against the target phrase and returns a score plus per-word results. I made this simpler so there is no fuzzy matching or phonetic comparison and works well enough for clear speech. Chrome is the only browser with solid Web Speech API support (as of now anyway); Firefox and Safari have partial to no support.

### Content Linking

Stories hold `vocabularyRefs` and `grammarRefs` arrays, each containing an ID plus denormalised display fields (word/title and context sentence/note). When a teacher creates a story, they pick vocabulary and grammar items from dropdowns populated by their published content. The student-facing story reader uses these refs to render inline highlights and reference cards.

## Running Locally

```bash
git clone https://github.com/loredanau02/Guided.git
cd Guided
npm install
```

Create a `.env` file in the project root. These are my fields, copy them in your environment and add your variables from the Firebase console:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

```bash
npm run dev
```

The app runs at `http://127.0.0.1:8000`. Without the env vars, the landing page still renders but auth and data features won't work.