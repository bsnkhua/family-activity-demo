# Family Activity Finder — Spec

## Overview
A web app where parents enter their city, kids' ages, availability, drive radius,
and preferences. It returns 5 weekend activity recommendations, each with a bold
title, emoji, and 2–4 sentences.

---

## Requirements

**Inputs (form)**
- City (text)
- Kids' ages (text, e.g. "5, 8")
- When free (text, e.g. "Saturday afternoon")
- Max drive distance in miles (number)
- Other preferences (text, optional)

**Output**
- Exactly 5 activity cards
- Each card: emoji + bold title, 2–4 sentence description
- Loading state while waiting for Claude

---

## Tech Stack

| Layer    | Choice                  |
|----------|-------------------------|
| Frontend | React (Vite)            |
| Backend  | Express (Node.js)       |
| AI       | Claude API (Sonnet 4.5) |
| Styling  | Plain CSS               |

**Project structure:**
```
/client   ← React app (Vite)
/server   ← Express app
```

---

## Design Guidelines

### Layout
- Two-column side-by-side: left form panel (~380px) + right results panel (fills remaining space)
- Top nav bar: white, full-width — logo + app name on left, "New Search" link on right
- Page background: #F1F5F9 (soft blue-gray)
- No UI library — plain CSS

### Left Panel (Form)
- White card, border-radius: 12px, box-shadow: 0 2px 12px rgba(0,0,0,0.08)
- "Find Activities" bold heading + muted subtitle beneath
- Each field label prefixed with an emoji: 📍 City, 😊 Kid Ages, 📅 Date & Time Availability, 🚗 Maximum Distance, ✨ Optional Preferences
- Input fields: background #F9FAFB, border-radius: 8px, no visible border, padding: 10px 14px
- Distance field is a `<input type="range">` (1–50 miles); current value shown in a blue pill badge inline with the label
- Preferences field is a `<textarea>` with a light placeholder
- Two buttons at bottom:
  - Primary: full-width blue (#3B82F6) rounded button, "🔍 Search Activities"
  - Secondary: plain "Clear" text button beside it

### Right Panel (Results)
- "Top 5 Recommendations" bold heading + "Perfect matches for your family" muted subtitle
- "SORTED BY RELEVANCE" — small uppercase gray label, right-aligned in the header row
- Result cards: white, border-radius: 10px, subtle border (#E5E7EB), 1-column list with 12px gap
- Each card layout (horizontal):
  - Left column: numbered circle badge (#1–#5) in light blue-gray; activity emoji below it
  - Right column: bold title (~18px), description text in #6B7280, location + distance metadata at bottom
  - Metadata row: 📍 venue name · 🚗 X miles — small (~12px), gray

### Colors
| Token            | Value     |
|------------------|-----------|
| Page background  | #F1F5F9   |
| Card / form bg   | #FFFFFF   |
| Primary blue     | #3B82F6   |
| Heading text     | #1F2937   |
| Body / desc text | #6B7280   |
| Input background | #F9FAFB   |
| Card border      | #E5E7EB   |

### Typography
- App name: 24px bold
- Form heading ("Find Activities"): 20px bold
- Card title: 17px bold
- Description: 14px regular, color #6B7280
- Metadata (location/distance): 12px, color #9CA3AF

### Data model
Cards include: `{ emoji, title, description, venue, distance }`
(`venue` and `distance` are empty strings in Milestone 1 dummy data)

---

## Milestones

### Milestone 1 — UI with Dummy Data
Goal: full UI working end-to-end with hardcoded results.

**Client**
- `App.jsx` — form with all 5 inputs + submit button
- `ActivityCard.jsx` — renders emoji, bold title, description
- On submit: show a loading spinner, then render 5 hardcoded cards
- Basic CSS for layout and cards

**Server**
- `index.js` — single POST `/api/activities` endpoint
- Returns a hardcoded array of 5 activity objects `{ emoji, title, description }`

**Done when:** Form submits, spinner shows, 5 dummy cards render.

---

### Milestone 2 — Connect Claude API with Web Search
Goal: replace dummy data with real Claude responses.

**Server changes**
- Install `@anthropic-ai/sdk`
- In POST `/api/activities`, call `client.messages.create()` with:
  - Model: `claude-sonnet-4-5-20250929`
  - Web search tool: `{ type: "web_search_20250305", name: "web_search", max_uses: 3, user_location: { type: "approximate", city } }`
  - See [Claude web search tool docs](https://docs.claude.com/en/docs/agents-and-tools/tool-use/web-search-tool)
- Use the system prompt and user prompt template from `prompt.md`
  - Interpolate `{{city}}`, `{{kids_ages}}`, `{{availability}}`, `{{miles}}`, `{{preferences}}` from the request body
  - Omit the preferences clause if the field is empty
- Parse the JSON array from Claude's text response → return to client

**Done when:** Submitting the real form returns live Claude-generated results.

---

### Milestone 3 — Polish (Optional)
- Streaming responses (token-by-token card reveal)
- Error states (API failure, no results)
- Input validation
