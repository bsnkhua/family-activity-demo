import { useState } from 'react';
import ActivityCard from './ActivityCard';

const DEFAULT_FORM = {
  city: '',
  kidsAges: '',
  availability: '',
  miles: 25,
  preferences: '',
};

export default function App() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleClear() {
    setForm(DEFAULT_FORM);
    setActivities([]);
    setSearched(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch('http://localhost:3001/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setActivities(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      {/* Nav */}
      <nav className="nav">
        <div className="nav-left">
          <div className="nav-logo">🎯</div>
          <div>
            <div className="nav-title">Family Activity Finder</div>
            <div className="nav-subtitle">Discover perfect activities for your family</div>
          </div>
        </div>
        {searched && (
          <button className="nav-new-search" onClick={handleClear}>
            New Search
          </button>
        )}
      </nav>

      {/* Body */}
      <div className="body">
        {/* Left: Form */}
        <aside className="form-panel">
          <h2 className="form-heading">Find Activities</h2>
          <p className="form-subheading">Tell us about your family&apos;s preferences</p>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="label">📍 City</label>
              <input
                type="text"
                name="city"
                className="input"
                placeholder="e.g. San Francisco, CA"
                value={form.city}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label className="label">😊 Kid Ages</label>
              <input
                type="text"
                name="kidsAges"
                className="input"
                placeholder="e.g. 5, 8, 12"
                value={form.kidsAges}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label className="label">📅 Date &amp; Time Availability</label>
              <input
                type="text"
                name="availability"
                className="input"
                placeholder="e.g. Saturday afternoon"
                value={form.availability}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label className="label">
                🚗 Maximum Distance:{' '}
                <span className="miles-badge">{form.miles} miles</span>
              </label>
              <input
                type="range"
                name="miles"
                className="slider"
                min="1"
                max="50"
                value={form.miles}
                onChange={handleChange}
              />
              <div className="slider-marks">
                <span>1 mile</span>
                <span>25 miles</span>
                <span>50 miles</span>
              </div>
            </div>

            <div className="field">
              <label className="label">✨ Optional Preferences</label>
              <textarea
                name="preferences"
                className="input textarea"
                placeholder="e.g., indoor activities, educational, budget-friendly"
                value={form.preferences}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="buttons">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Searching...' : '🔍 Search Activities'}
              </button>
              <button type="button" className="btn-clear" onClick={handleClear}>
                Clear
              </button>
            </div>
          </form>
        </aside>

        {/* Right: Results */}
        <main className="results-panel">
          {loading && (
            <div className="loading">
              <div className="spinner" />
              <p>Finding activities for your family…</p>
            </div>
          )}

          {!loading && activities.length > 0 && (
            <>
              <div className="results-header">
                <div>
                  <h2 className="results-title">Top 5 Recommendations</h2>
                  <p className="results-subtitle">Perfect matches for your family</p>
                </div>
                <span className="results-tag">SORTED BY RELEVANCE</span>
              </div>
              <div className="cards-list">
                {activities.map((activity, i) => (
                  <ActivityCard key={i} activity={activity} rank={i + 1} />
                ))}
              </div>
            </>
          )}

          {!loading && !searched && (
            <div className="empty-state">
              <div className="empty-icon">🗺️</div>
              <p>Fill in the form and hit <strong>Search Activities</strong> to get personalized recommendations.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
