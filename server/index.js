const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

const DUMMY_ACTIVITIES = [
  {
    emoji: '🚂',
    title: 'Muni Heritage Weekend - Sunday 10am-4pm',
    description: 'A special event where families can ride vintage transit vehicles that are rarely seen on San Francisco streets, including vintage buses and the Blackpool Boat Tram. All rides on these special streetcars are FREE all weekend.',
    venue: 'San Francisco Railway Museum',
    distance: '0.5 miles',
  },
  {
    emoji: '🇬🇷',
    title: 'Greek Food Festival - Sunday 11am-8pm',
    description: 'The annual Greek Food Festival features delicious traditional food like Spanakopita and Moussaka, plus desserts and Greek wine. Visitors can enjoy classic Greek music, watch award-winning folk dance groups perform, and browse unique gifts from local vendors.',
    venue: 'Mission District',
    distance: '1.2 miles',
  },
  {
    emoji: '🎨',
    title: 'Sunday Funnies Exhibit - Sunday 10am-5pm',
    description: "The Cartoon Art Museum's 40th anniversary showcase features classic comic strips from the dawn of the comics medium to the present day, including works from legendary cartoonists like Charles M. Schulz (Peanuts) and contemporary classics like Phoebe and Her Unicorn.",
    venue: 'Cartoon Art Museum',
    distance: '2 miles',
  },
  {
    emoji: '💃',
    title: 'Lindy in the Park Dance Party - Sunday 11am-2pm',
    description: 'A weekly free swing dance event near the de Young Museum when the streets of Golden Gate Park are closed to traffic. Get ready to swing in Golden Gate Park every sunny Sunday at this family-friendly dance gathering.',
    venue: 'Golden Gate Park',
    distance: '3.1 miles',
  },
  {
    emoji: '🦁',
    title: 'San Francisco Zoo — Keeper Talk Series',
    description: 'Join zookeepers for up-close animal encounters and educational talks throughout the day. Kids can meet the big cats, penguins, and lemurs while learning about conservation efforts. Timed entry tickets are available online in advance.',
    venue: 'San Francisco Zoo',
    distance: '4.8 miles',
  },
];

app.post('/api/activities', (req, res) => {
  res.json(DUMMY_ACTIVITIES);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
