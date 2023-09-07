const express = require('express');
const RSS = require('rss');
const fs = require('fs');
const scrapeWebsite = require('./scrape');

const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/rss', async (req, res) => {
  const tenders = await scrapeWebsite();
  
  const feed = new RSS({
    title: 'Öffentliche Ausschreibungen',
    description: 'Die neuesten öffentlichen Ausschreibungen von DTV',
    feed_url: 'http://example.com/rss.xml',
    site_url: 'http://example.com',
  });

  tenders.forEach(tender => {
    feed.item({
      title: tender.description,
      description: `Typ: ${tender.type}, Veröffentlicher: ${tender.publisher}, Veröffentlichungsdatum: ${tender.publishedDate}, Frist: ${tender.deadlineDate}`,
      url: tender.actionLink,
      date: tender.publishedDate,
    });
  });

  const xml = feed.xml();
  fs.writeFileSync('feed.xml', xml);

  res.type('application/xml');
  res.sendFile(__dirname + '/feed.xml');
});

app.get('/scrape', async (req, res) => {
  const tenders = await scrapeWebsite();
  res.json(tenders);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
