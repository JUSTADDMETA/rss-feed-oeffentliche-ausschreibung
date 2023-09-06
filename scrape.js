const puppeteer = require('puppeteer');
const RSS = require('rss');
const fs = require('fs');

async function scrapeWebsite() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.dtvp.de/Center/common/project/search.do?method=showExtendedSearch&fromExternal=true');
  
  const tenders = await page.evaluate(() => {
    const rows = document.querySelectorAll('tr');
    const tenders = [];

    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      if (cells.length === 6) {
        const publishedDate = cells[0].querySelector('abbr').title;
        const deadlineDate = cells[1].querySelector('abbr').title;
        const description = cells[2].innerText.trim();
        const type = cells[3].innerText.trim();
        const publisher = cells[4].innerText.trim();
        const actionLink = cells[5].querySelector('a').getAttribute('href');

        tenders.push({
          publishedDate,
          deadlineDate,
          description,
          type,
          publisher,
          actionLink
        });
      }
    });

    return tenders;
  });

  const feed = new RSS({
    title: 'Ihr Feed-Titel',
    description: 'Beschreibung des Feeds',
    feed_url: 'http://example.com/rss.xml',
    site_url: 'http://example.com',
  });

  tenders.forEach(tender => {
    feed.item({
      title: tender.description,
      description: `Typ: ${tender.type}, Veröffentlicher: ${tender.publisher}`,
      url: tender.actionLink,
      date: tender.publishedDate,
    });
  });

  const xml = feed.xml();

  // Speichern Sie den RSS-Feed in einer XML-Datei
  fs.writeFileSync('feed.xml', xml);

  await browser.close();
}

scrapeWebsite();
