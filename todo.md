# Milestone 1 — UI with Dummy Data ✅

## Server

- [x] `npm init` in `/server`, install `express` and `cors`
- [x] Create `server/index.js` with Express app on port 3001
- [x] Add `POST /api/activities` route that returns hardcoded array of 5 activity objects
  ```js
  { emoji, title, description, venue: "", distance: "" }
  ```
- [x] Enable CORS for `http://localhost:5173` (Vite dev server)
- [x] Verify endpoint works: `curl -X POST http://localhost:3001/api/activities`

## Client

- [x] Scaffold Vite + React app in `/client` (`npm create vite@latest`)
- [x] Delete boilerplate (default CSS, logo, App.css content)
- [x] Create `client/src/App.jsx` with form state for all 5 fields:
  - City (text input)
  - Kid Ages (text input)
  - Date & Time Availability (text input)
  - Max Distance (range slider, 1–50, default 25)
  - Optional Preferences (textarea)
- [x] Wire up form submit: POST to `http://localhost:3001/api/activities`, set loading state
- [x] Create `client/src/ActivityCard.jsx` — renders one card:
  - Numbered badge (#1–#5) + emoji (left column)
  - Bold title, description, venue + distance metadata (right column)
- [x] Show loading spinner while request is in-flight
- [x] Render 5 `<ActivityCard>` components when response arrives

## Styles (`client/src/index.css`)

- [x] Page: background `#F1F5F9`, font-family sans-serif
- [x] Nav bar: white, full-width, logo + "Family Activity Finder" left, "New Search" right
- [x] Two-column layout: form panel `~380px` fixed width, results panel fills rest
- [x] Form card: white, `border-radius: 12px`, `box-shadow: 0 2px 12px rgba(0,0,0,0.08)`
- [x] Input fields: `background: #F9FAFB`, `border-radius: 8px`, no border, `padding: 10px 14px`
- [x] Range slider value shown in a blue `#3B82F6` pill badge next to the label
- [x] Primary button: full-width, `background: #3B82F6`, white text, rounded
- [x] Result cards: white, `border-radius: 10px`, `border: 1px solid #E5E7EB`, `gap: 12px`
- [x] Numbered badge: circle, light blue-gray background
- [x] Metadata row: `font-size: 12px`, `color: #9CA3AF`

---

# Milestone 2 — Connect Claude API with Web Search

## Server

- [ ] Install `@anthropic-ai/sdk` in `/server`
- [ ] Add `ANTHROPIC_API_KEY` to a `.env` file and load it with `dotenv`
- [ ] Read system prompt and user prompt template from `prompt.md` at startup
- [ ] Build prompt interpolation helper: replace `{{city}}`, `{{kids_ages}}`, `{{availability}}`, `{{miles}}`, `{{preferences}}` with request body values; omit preferences clause if field is empty
- [ ] Replace hardcoded dummy data in `POST /api/activities` with a `client.messages.create()` call:
  - Model: `claude-sonnet-4-5-20250929`
  - Web search tool: `{ type: "web_search_20250305", name: "web_search", max_uses: 3, user_location: { type: "approximate", city } }`
  - System prompt + interpolated user prompt from `prompt.md`
- [ ] Parse the JSON array from Claude's text response (strip any markdown fences if present)
- [ ] Return parsed array to client; return HTTP 500 with error message on failure

## Verify

- [ ] Submit the form with real values (e.g. city: Austin TX, ages: 6 and 9, Saturday afternoon, 20 miles)
- [ ] Confirm 5 cards render with real activity titles, venues, and distances
- [ ] Confirm each card has an emoji, bold title, 2–4 sentence description, and metadata row
