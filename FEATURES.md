# Feature Deep Dive

Comprehensive documentation of Relearnable's core features, implementation details, and user experience design.

---

## 🎯 Adaptive Learning Engine

### Learn Mode

The Learn Mode provides a full educational experience for any topic:

1. **Topic Input**: Users enter any topic (e.g., "Machine Learning", "French Revolution")
2. **Difficulty Selection**: Choose Beginner, Intermediate, or Advanced
3. **AI Generation**: Gemini AI creates a structured lesson plan
4. **Sectioned Learning**: Content divided into digestible sections
5. **Progress Tracking**: Resume where you left off

#### Lesson Structure
```
Lesson Plan
├── Section 1: Introduction
│   ├── Flashcard 1 (with keywords)
│   ├── Flashcard 2
│   ├── Flashcard 3
│   └── Section Quiz (3 questions)
├── Section 2: Core Concepts
│   ├── Flashcards...
│   └── Section Quiz
├── Section 3: Advanced Topics
│   ├── Flashcards...
│   └── Section Quiz
└── Final Exam (10 questions)
```

### Relearn Mode

Relearn Mode identifies and addresses knowledge gaps:

1. **Placement Test**: 10-question diagnostic exam
2. **Knowledge Mapping**: Results mapped to curriculum tree
3. **Gap Identification**: Nodes marked as conquered/unconquered
4. **Targeted Curriculum**: AI generates focused remediation
5. **Curriculum Expansion**: Tree grows as topics are mastered

![Curriculum Tree](assets/Curriculum%20Tree.png)

---

## 🌳 Knowledge Graph Visualization

An interactive, zoomable visualization of learning progress:

### Features
- **Node States**: Locked → Unlocked → Current → Completed
- **Visual Feedback**: Color-coded nodes with icons
- **Interactivity**: Pan, zoom, and touch gestures
- **Dynamic Expansion**: New nodes appear as you progress

### Technical Implementation
- Custom SVG rendering for performance
- Hierarchical layout algorithm
- Framer Motion for state transitions
- Touch event handling for mobile

### Node Status Legend
| Status | Visual | Description |
|--------|--------|-------------|
| Locked | 🔒 Gray | Prerequisite not met |
| Unlocked | 🔓 Blue outline | Ready to learn |
| Current | 🚀 Pulsing blue | Currently studying |
| Completed | ✅ Green | Successfully mastered |

---

## 📊 Mastery Tracking System

A radar chart visualization tracking progress across 15 knowledge categories:

### Categories
- Mathematics
- Natural Sciences
- Computer Science & Technology
- Engineering
- Medicine & Health
- Social Sciences
- History & Geography
- Literature & Languages
- Arts & Music
- Business & Economics
- Philosophy & Religion
- Politics & Law
- Sports & Fitness
- Current Events & Media
- Life Skills

### Visualization Features
- **Animated Hover**: Smooth scale and glow effects
- **Tooltip Display**: Category name and exact score
- **Responsive Sizing**: Adapts to container
- **Dark Mode Support**: Themed colors and grids

---

## 🃏 Flashcard System

Interactive flashcards with keyword highlighting:

### Features
- **Swipe Gestures**: Navigate between cards
- **Keyword Highlighting**: Key terms emphasized
- **Progress Indicator**: Section and card position
- **Smooth Animations**: Card transitions

![Flashcard View](assets/Lesson%20Plan%20Flashcard.png)

---

## 📝 Quiz Engine

Comprehensive quiz system with immediate feedback:

### Quiz Types
1. **Section Quizzes**: 3 questions after each section
2. **Final Exam**: 10 questions covering entire lesson
3. **Placement Tests**: Diagnostic exams for Relearn mode

### Features
- **Immediate Feedback**: Correct/incorrect with explanation
- **Score Tracking**: Running score during quiz
- **Progress Persistence**: Resume interrupted quizzes
- **Review Option**: Flashback to relevant flashcards

| Correct Answer | Incorrect Answer |
|:---:|:---:|
| ![Correct](assets/Correct%20Answer%20in%20Quiz.png) | ![Incorrect](assets/Incorrect%20Answer%20in%20Quiz.png) |

---

## 🏠 Dashboard Experience

The central hub for all learning activities:

### Sections
1. **Search & Create**: Start new topics with any subject
2. **In Progress**: Resume ongoing lessons
3. **Completed**: Review finished topics
4. **Recommendations**: AI-suggested next topics

### UI Elements
- Animated topic cards with status indicators
- Difficulty badges (color-coded)
- Progress bars for in-progress topics
- "Continue" vs "Review" actions

| Dashboard Areas |
|:---:|
| ![Search Area](assets/Dashboard%20(Search%20Area).png) |
| ![Card Area](assets/Dashboard%20(Learning_Card%20Area).png) |

---

## ⚙️ Settings & Account Management

Comprehensive user settings:

### Features
- **Profile Management**: Name, avatar display
- **Theme Toggle**: Light/Dark/System preference
- **Subscription Management**: Stripe Customer Portal access
- **Activity Log**: History of all learning activities
- **Data Management**: Reset progress or delete account

| Account Settings | Activity Log |
|:---:|:---:|
| ![Account](assets/Account%20Management%20(Settings).png) | ![Activity](assets/Activity%20Log%20(Settings).png) |

---

## 📱 PWA Support

Relearnable is installable as a Progressive Web App:

### Features
- **Install Prompt**: Native-feeling installation
- **Home Screen Icon**: Branded app icon
- **Standalone Mode**: No browser chrome
- **Responsive**: Mobile-first design

<!-- TODO: Add screenshot of PWA install prompt on mobile -->
> 📸 *Screenshot placeholder: PWA install prompt on iOS/Android*

---

## 💳 Subscription Tiers

### Free Tier
- 3 Learn generations per day
- 3 Relearn generations per day
- Full feature access
- Progress saved

### Premium (Monthly/Yearly)
- Unlimited Learn generations
- Unlimited Relearn generations
- Priority AI processing
- Early access to new features
