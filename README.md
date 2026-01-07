# Drengene - WhatsApp Chat Analytics

A mobile-first web application that analyzes a WhatsApp group chat history and presents fun statistics, personality profiles, and insights about the group members.

**Live site:** https://mbundgaard.github.io/Drengene/

## Features

### Home Page
- Total message count, years active, member count
- "Bromance of the Year" - the pair who interact most
- All group name changes through history

### Awards
Fun superlatives for the group:
- Snakkesansen (most messages)
- Romansen (longest messages)
- Emoji-Kongen (most emojis)
- Natteravnen (most late night messages)
- And more...

### Members
Detailed stats for each member including message count, words, emojis, questions asked, swear words, and top emojis used.

### Activity Heatmap
Visual heatmap showing when the group is most active by day of week and hour.

### Word Clouds
Top words used by each member (filtered for stop words).

### Time Capsule (Tidskapsel)
Funniest quotes from each year - messages that got multiple laugh reactions.

### Relationships
Network visualization showing who responds to whom most often.

### Media King (Medie-Kongen)
Rankings of who shares the most images, GIFs, and videos.

### Stakkels Far
Tracks mentions of parenting struggles (sleep deprivation, crying babies, etc.)

### Reply Speed
Average response time for each member.

### Ghosts (Spøgelser)
Who disappears the longest - tracks gaps of 7+ days without messages.

### Trends
Distinctive words for each year - shows what topics were uniquely popular each year using TF-IDF-style scoring.

### Mood (Humør)
Sentiment analysis using Danish BERT model (`alexandrainst/da-sentiment-base`):
- Per-person positivity scores
- Monthly mood timeline
- Weekday mood patterns
- Highlights: "Solstrålen" (most positive), "Balanceret", "Realisten" (most negative)

### Personality (Personlighed)
16-type personality system inspired by 16personalities.com, based on chat behavior:

**4 Dimensions:**
| Code | Left | Right | Based on |
|------|------|-------|----------|
| S/L | Lytter | Snakker | Message volume vs group average |
| E/R | Reserveret | Ekspressiv | Emoji + media usage |
| P/N | Neutral | Positiv | Sentiment score |
| K/I | Impulsiv | Konsistent | Reply speed + ghost tendency |

**16 Types in 4 Roles:**
- **Motorer** (red): Dirigenten, Ildsjælen, Ankeret, Katalysatoren
- **Entertainere** (gold): Fortælleren, Provokatøren, Realisten, Jokeren
- **Tænkere** (teal): Optimisten, Drømmeren, Filosoffen, Iagttageren
- **Støtter** (purple): Diplomaten, Mystikeren, Analytikeren, Eneren

### Start & Slut
Conversation starters vs closers - who initiates conversations and who sends the last message before gaps of 4+ hours.

## Tech Stack

- **Frontend:** Vanilla HTML, CSS, JavaScript (no frameworks)
- **Styling:** Mobile-first responsive design, dark theme, CSS variables
- **Data Processing:** Python scripts for parsing WhatsApp export
- **Sentiment Analysis:** Hugging Face Transformers with Danish BERT model
- **Hosting:** GitHub Pages

## Project Structure

```
Boys/
├── chat.txt                    # WhatsApp chat export (not in repo)
├── generate_site_data.py       # Main data processing script
├── sentiment_analysis.py       # ML sentiment analysis script
├── README.md
└── site/
    ├── index.html              # Single-page app
    ├── css/
    │   └── style.css           # All styles
    └── js/
        ├── app.js              # All page rendering logic
        ├── data.js             # Generated chat statistics
        └── sentiment.js        # Generated sentiment data
```

## Setup & Usage

### 1. Export WhatsApp Chat
- Open WhatsApp group → Settings → Export Chat → Without Media
- Save as `chat.txt` in the project root

### 2. Generate Statistics
```bash
python generate_site_data.py
```
This parses the chat and generates `site/js/data.js` with all statistics.

### 3. Run Sentiment Analysis (Optional)
```bash
python sentiment_analysis.py
```
This uses a Danish BERT model (~500MB download first time) to analyze message sentiment. Takes ~25 minutes on CPU for ~120k messages.

### 4. View Locally
Open `site/index.html` in a browser, or use a local server:
```bash
cd site && python -m http.server 8000
```

### 5. Deploy
Push the `site/` folder to GitHub Pages or any static hosting.

## Data Privacy

- The `chat.txt` file is NOT included in the repository
- Generated `data.js` and `sentiment.js` contain aggregated statistics only
- Individual messages are only stored for the "Time Capsule" quotes feature

## Configuration

Edit `generate_site_data.py` to customize:
- `MAIN_MEMBERS` - list of member names to track
- `COLORS` - color assignments for each member
- `STOP_WORDS` - words to filter from word clouds and trends

## Credits

Built with Claude Code (Anthropic)

Sentiment analysis model: [alexandrainst/da-sentiment-base](https://huggingface.co/alexandrainst/da-sentiment-base)
