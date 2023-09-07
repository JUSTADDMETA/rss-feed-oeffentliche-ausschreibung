const puppeteer = require('puppeteer');

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
        const publishedDate = cells[0].querySelector('abbr')?.title;
        const deadlineDate = cells[1].querySelector('abbr')?.title;
        const description = cells[2].innerText.trim();
        const type = cells[3].innerText.trim();
        const publisher = cells[4].innerText.trim();
        const actionLinkScript = cells[5].querySelector('a')?.getAttribute('href');
        const actionLink = actionLinkScript ? actionLinkScript.match(/'(.*?)'/)[1] : ''; 

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

  await browser.close();
  return tenders;
}

module.exports = scrapeWebsite;
