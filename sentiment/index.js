const express = require('express');
const Natural = require('natural');
const app = express();

app.use(express.json());

app.post('/sentiment', (req, res) => {
    const { sentence } = req.body;
    if (!sentence) {
        return res.status(400).json({ error: "Sentence is required" });
    }

    try {
        const Analyzer = Natural.SentimentAnalyzer;
        const stemmer = Natural.PorterStemmer;
        const analyzer = new Analyzer("English", stemmer, "afinn");

        const score = analyzer.getSentiment(sentence.split(' '));
        let sentiment = "neutral";

        if (score > 0) {
            sentiment = "positive";
        } else if (score < 0) {
            sentiment = "negative";
        }

        res.status(200).json({ sentimentScore: score, sentiment: sentiment });
    } catch (error) {
        res.status(500).json({ message: 'Error performing sentiment analysis' });
    }
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => console.log(`Sentiment service running on port ${PORT}`));
}

module.exports = app;
