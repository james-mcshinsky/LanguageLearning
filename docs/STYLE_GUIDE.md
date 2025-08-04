# Language Learning Website Style Guide

A comprehensive, professional—and a bit playful—guide to keep your brand consistent, accessible, and delightful!

## 1. Brand Typography

**Primary Typeface:** Gabarito  
*Designed by Leandro Assis & Álvaro Franca*

| Weight    | Usage                                     | CSS Font-Weight |
|-----------|-------------------------------------------|-----------------|
| Regular   | Body copy, captions, form labels          | 400             |
| Medium    | Subheadings, blockquotes, sidebar titles  | 500             |
| Semibold  | Section headings, card titles, navigation labels | 600    |
| Bold      | Page titles, key calls-to-action, strong emphasis | 700    |

```css
@import url('https://fonts.googleapis.com/css2?family=Gabarito:wght@400;500;600;700&display=swap');
body { font-family: 'Gabarito', sans-serif; }
```

### 1.1 Typography Hierarchy

| Element             | Font Family | Weight  | Size    | Line-Height |
|---------------------|-------------|---------|---------|-------------|
| H1 (Page Title)     | Gabarito    | Bold    | 2.5rem  | 1.2         |
| H2 (Section)        | Gabarito    | Semibold| 2rem    | 1.3         |
| H3 (Subsection)     | Gabarito    | Medium  | 1.5rem  | 1.4         |
| Body Text           | Gabarito    | Regular | 1rem    | 1.6         |
| Small Text          | Gabarito    | Regular | 0.875rem| 1.4         |

```css
h1 { font-weight:700; font-size:2.5rem; }
h2 { font-weight:600; font-size:2rem; }
h3 { font-weight:500; font-size:1.5rem; }
p, li { font-weight:400; font-size:1rem; }
small { font-weight:400; font-size:0.875rem; }
```

## 2. Color Palette

### 2.1 Primary Colors

| Role            | Swatch | Hex     |
|-----------------|--------|---------|
| ⚡️ Primary Accent   |        | `#FFBF32` |
| 🌟 Light Accent     |        | `#FFF7D3` |
| 🌑 Dark Accent      |        | `#462104` |

### 2.2 Secondary Colors

| Role             | Swatch | Hex     |
|------------------|--------|---------|
| ✅ Success / Go    |        | `#529917` |
| 🌱 Light Success  |        | `#E5F9CE` |
| 🌲 Dark Success   |        | `#162B08` |

### 2.3 Accent Colors

| Role                  | Swatch | Hex     |
|-----------------------|--------|---------|
| 🔹 Interactive / Link |        | `#1EC6F2` |
| 💧 Light Accent Blue  |        | `#BAF4FF` |
| 🌌 Dark Accent Blue   |        | `#072F45` |

### 2.4 Neutrals

| Role              | Swatch | Hex     |
|-------------------|--------|---------|
| ⚪️ Background       |        | `#F6F6F6` |
| ⚙️ Secondary Text   |        | `#5D5D5D` |
| ⬛ Primary Text     |        | `#0F0F0F` |

### 2.5 Brand Gradient

A fresh gradient for heroes, banners, or CTAs:

```css
background: linear-gradient(
  180deg,
  #BAF4FF 0%,
  #E5F9CE 100%
);
```

## 3. Usage Guidelines

### 3.1 Color Roles

| Element              | Color    |
|----------------------|----------|
| Page Background      | `#F6F6F6`|
| Card / Panel BG      | `#FFFFFF` or gradient |
| Primary Text         | `#0F0F0F`|
| Secondary Text       | `#5D5D5D`|
| Links & Buttons      | `#1EC6F2`|
| Primary Button BG    | `#FFBF32`|
| Primary Button Text  | `#0F0F0F`|
| Secondary Button BG  | `#529917`|
| Secondary Button Text| `#FFFFFF`|
| Success / Alerts BG  | `#529917`|
| Success Tint BG      | `#E5F9CE`|

### 3.2 Buttons & Interactions

```css
.button-primary {
  background-color: var(--color-primary);
  color: var(--color-text-primary);
  font-weight:600;
  border-radius:0.5rem;
  padding:0.75rem 1.5rem;
}
.button-secondary {
  background-color: #529917;
  color:#FFFFFF;
  font-weight:600;
  border-radius:0.5rem;
  padding:0.75rem 1.5rem;
}
a {
  color:#1EC6F2;
  text-decoration:none;
}
a:hover { text-decoration:underline; }
```

## 4. Accessibility & Contrast

- **Primary Button Text** (`#0F0F0F` on `#FFBF32`): 12.8:1 → AAA
- **Link Color** (`#1EC6F2` on `#FFFFFF`): 3.7:1 → AA (underline on hover/focus)
- **Body Text** (`#0F0F0F` on `#F6F6F6`): 15.3:1 → AAA

## 5. Example Components

### 5.1 Hero Section

```html
<section class="hero" style="
  background: linear-gradient(180deg, #BAF4FF 0%, #E5F9CE 100%);
  color: #0F0F0F;
  padding: 4rem 2rem;
  text-align: center;">
  <h1>Master a New Language, One Step at a Time</h1>
  <p>Interactive lessons, AI-guided feedback, and real-world practice—designed around your goals.</p>
  <a href="/signup" class="button-primary">Get Started</a>
</section>
```

### 5.2 Card Component

```html
<div class="card" style="
  background-color:#FFFFFF;
  border:1px solid #E5F9CE;
  border-radius:0.75rem;
  padding:1.5rem;">
  <h3 style="font-weight:600; color:#072F45;">Vocabulary Builder</h3>
  <p style="color:#5D5D5D;">Learn the 50 most frequent words for your chosen topic.</p>
  <button class="button-secondary">Explore</button>
</div>
```

## 6. Assets & Iconography

- **Icons:** 2px stroke, rounded caps
  - Active: `#1EC6F2`
  - Inactive: `#5D5D5D`
- **Photos:** warm light, real learners in action
- **Illustrations:** simple shapes, pastel tints (`#FFF7D3`, `#BAF4FF`, `#E5F9CE`)
- **Alt-Text:** concise + descriptive

## 7. Layout & Spacing

- **Grid:** 12-column, 16px gutter

| Token | px |
|-------|----|
| XXS   | 4  |
| XS    | 8  |
| S     | 16 |
| M     | 24 |
| L     | 32 |
| XL    | 48 |
| XXL   | 64 |

Let your modules “yoga stretch”—give them room to breathe!

## 8. Responsive Breakpoints

| Label | Media Query |
|-------|-------------|
| XS    | `< 576px`   |
| SM    | `≥ 576px` |
| MD    | `≥ 768px` |
| LG    | `≥ 992px` |
| XL    | `≥ 1200px`|

```css
@media (min-width:768px){/* tablet+ */}
@media (min-width:992px){/* desktop+ */}
```

## 9. Iconography & Imagery

- **Icon Style:** 2px stroke, rounded caps
- **Imagery:**
  - Photos: authentic, bright, inclusive
  - Illustrations: minimal, soft pastels
- **Writing Alt-Text:**
  - Good: “Student practicing vocabulary flashcards”
  - Bad: “Image1.png”

## 10. Brand Voice & Tone

- **Personality:** Friendly, encouraging, playful
- **Do:**
  - Active voice (“You’ll nail those verbs!”)
  - Simple language (“Let’s dive in!”)
- **Don’t:**
  - Overpromise (“Fluent overnight!”)
  - Jargon (“Phonemic segmentation”)

## 11. Content & Microcopy

- **Buttons:**
  - ✔️ “Start Lesson”
  - ❌ “Submit”
- **Form Hints:**
  - “Enter your email—no spam, promise!”
- **Error States:**
  - Illustration of a puzzled owl
  - Copy: “Oops! That page flew away. Let’s get you back on track.”

## 12. Motion & Interaction

- **Durations:**
  - Fast: 150 ms
  - Medium: 300 ms
  - Slow: 500 ms
- **Easing:**
  - In: `cubic-bezier(0.4,0.0,1,1)`
  - Out: `cubic-bezier(0.0,0.0,0.2,1)`
- **Micro-interactions:**
  - Button hover: `transform: scale(1.05)`
  - Input focus glow: `box-shadow: 0 0 0 3px rgba(255,191,50,0.3)`

## 13. Design Tokens & Implementation

```css
:root {
  /* Colors */
  --color-primary: #FFBF32;
  --color-primary-light: #FFF7D3;
  --color-accent: #1EC6F2;
  --color-bg: #F6F6F6;
  /* Spacing */
  --space-s: 16px;
  --space-m: 24px;
  /* Typography */
  --font-base: 'Gabarito', sans-serif;
}
```

Future dark mode? Invert neutrals, keep accents bright!

## 14. Accessibility Checklist

✅ Contrast meets WCAG AA/AAA  
✅ Keyboard-reachable controls  
✅ Visible focus states  
✅ ARIA labels on icons  
✅ Descriptive link text

## 15. File & Component Naming

- **Design Files:** `Page_Component_State`  
  e.g. `Dashboard_Card_Hover.sketch`
- **CSS / React:**
  - PascalCase or kebab-case
  - Examples: `ButtonPrimary`, `HeroBanner`, `vocabulary-card`

