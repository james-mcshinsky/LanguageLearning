# Fluent Milestone Guidelines: AI-Powered, Goal-Driven Language Learning

A reference overview of key business, product and technical details—meant to live alongside your code in the repo.

---

## 1. Vision & Mission

- **Vision**: Empower learners to meet *real-world* language goals (reading books, watching films, ordering in cafés) via a personalized AI tutor.  
- **Mission**: Combine goal-prioritized vocabulary, best-practice pedagogy, spaced repetition, Socratic questioning and contextual media in one seamless app.

---

## 2. Target Market & Pain Points

1. **Segments**  
   - Lifelong learners (enrichment, travel)  
   - Professionals (industry-specific terminology)  
   - Students (exam prep, study abroad)  
2. **Pain Points**  
   - Generic curricula → low relevance  
   - Poor retention of irrelevant words  
   - Churn when progress isn’t tied to real goals  

---

## 3. Competitive Edge

- **Every word, every exercise** directly derived from learner’s chosen goal  
- **AI-Tutor “Learn”** with:  
  - MCQ-only interface  
  - Filtered spaced-rep (SM-2 + goal-frequency)  
  - Grammar micro-lessons  
  - **Socratic questioning** to prompt learner reflection  
- **Contextual Media “Explore”**: L+1 text/audio/video with tappable transcripts  
- **AI Blurb Generator**: controlled-vocab practice dialogues  
- Rich **Analytics** & **Goal Pipelines**

---

## 4. Revenue Model

- **Freemium**: 1 goal, up to 50 words, text-only media  
- **Pro ($14.99/mo)**: unlimited goals, full media, AI blurbs, offline mode  
- **Enterprise**: volume licensing, SSO, custom corpora, white-label SDK  
- **Streams**: subscriptions, corporate contracts, API/SDK fees

---

## 5. Go-to-Market

- **Channels**: content marketing (blog, case studies), Reddit/YouTube, LinkedIn  
- **Partnerships**: open-license publishers, streaming services, universities  
- **Growth**: freemium upsell, referral incentives, influencer outreach

---

## 6. High-Level Roadmap

| Phase                         | Timeline   | Deliverables                                                  |
| ----------------------------- | ---------- | ------------------------------------------------------------- |
| **MVP**                       | Q1 2026    | Goal wizard, AI-Tutor “Learn”, SRS filtering, text media      |
| **Media + Transcript Toggle** | Q2 2026    | Audio/video support, transcript toggle, word-tap SRS queuing  |
| **AI Blurbs & Grammar**       | Q3 2026    | Controlled-vocab practice, grammar micro-lessons              |
| **Pro Launch**                | Q4 2026    | Offline mode, push notifications, mobile polish              |
| **Enterprise & API**          | 2027       | SDK, white-label, analytics integration                       |

---

## 7. Financial Snapshot

- **Year 1**: 5 000 paid users → $500 K revenue; EBITDA –$160 K  
- **Year 2**: 20 000 paid users → $2.2 M revenue; EBITDA $880 K (breakeven)  
- **Year 3**: 60 000 paid users → $7.2 M revenue; EBITDA $5.15 M  

---

## 8. Core Feature List

1. **Goal Management**  
   - Onboarding wizard; custom or template goals  
   - Chainable goal pipeline (split/reorder)  
   - Progress bars & badges  

2. **Spaced-Repetition Engine**  
   - SM-2 scheduling  
   - Filter by “due” + “goal relevance”  
   - Mastery score (0–100 %)  

3. **AI-Tutor “Learn”**  
   - MCQ, T/F, matching, drag-and-drop only  
   - Word intro (definition, example, audio)  
   - **Socratic questioning** (“Why did you choose that?”)  
   - Grammar micro-lessons at intervals  
   - Instant feedback & hints  
   - Adaptive pacing & difficulty  

4. **Contextual Media “Explore”**  
   - Carousel of L+1 text/audio/video  
   - Toggle transcripts; real-time highlighting  
   - Tap-to-queue new/weak words  

5. **AI-Generated Practice**  
   - Controlled-vocab dialogues (known + L+1)  
   - Length slider (short → long)  

6. **Analytics & Progress**  
   - Word-level mastery dashboard  
   - Lesson & media session summaries  
   - Streaks, retention predictors, goal metrics  

7. **Notifications & Offline**  
   - Push reminders for due reviews & new blurbs  
   - Cache next SRS batch + media  

8. **Accessibility & Localization**  
   - Screen-reader, high-contrast UI, adjustable fonts  
   - UI and prompts localized per target language  

9. **Integration & Extensibility**  
   - REST/GraphQL API, webhooks, Zapier integration  
   - White-label SDK

---

## 9. Tutor “How-to”: Socratic AI-Tutor Logic

1. **Select Words**  
   - Query SRS queue & goal-rank → pick new vs. review batch.  
2. **Teach New Words**  
   - Present definition + example (from user’s goal).  
   - Play audio pronunciation.  
   - Ask 1 MCQ to check initial grasp.  
3. **Review Old Words**  
   - Interleave MCQs based on SM-2 intervals.  
4. **Inject Grammar Module** (every N verbs)  
5. **Socratic Prompts**  
   - After each question or lesson segment, ask:  
     - “What clues told you this was correct?”  
     - “How would you explain this rule to a friend?”  
   - Use learner’s responses to tailor next hints/items.  
6. **Feedback Loop**  
   - Wrong → show hint → re-ask (2-option MCQ).  
   - Correct → praise + deeper example.  
7. **Session Summary**  
   - New vs. review count, accuracy, updated mastery.  
   - Schedule next SRS reviews; push reminder.

---

> **Keep this file updated** as features evolve and business goals shift.  
> Store alongside `README.md`, `docs/architecture.md`, or in a `/docs` folder for easy reference.  
