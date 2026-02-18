export default function ActivityCard({ activity, rank }) {
  const { emoji, title, date, description, venue, distance } = activity;

  return (
    <div className="card">
      <div className="card-left">
        <div className="card-badge">#{rank}</div>
        <div className="card-emoji">{emoji}</div>
      </div>
      <div className="card-right">
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{description}</p>
        {(date || venue || distance) && (
          <div className="card-meta">
            {date && <span>📅 {date}</span>}
            {venue && <span>📍 {venue}</span>}
            {distance && <span>🚗 {distance}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
