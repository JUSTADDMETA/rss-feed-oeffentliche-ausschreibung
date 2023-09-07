
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Scraper Interface</title>
<style>
  body {
    font-family: Arial, sans-serif;
  }
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
  }
  .tenders {
    margin-top: 20px;
    max-width: 600px;
  }
  .tender {
    border: 1px solid #ccc;
    padding: 10px;
    margin: 5px 0;
  }
</style>
</head>
<body>
<div class="container">
  <button onclick="fetchData()">Daten abrufen</button>
  <div class="tenders" id="tenders"></div>
</div>
<script>
  async function fetchData() {
    const response = await fetch('/scrape');
    const data = await response.json();
    const tendersDiv = document.getElementById('tenders');
    tendersDiv.innerHTML = '';
    data.forEach(tender => {
      const tenderDiv = document.createElement('div');
      tenderDiv.className = 'tender';
      tenderDiv.innerHTML = `
        <strong>${tender.description}</strong><br>
        Typ: ${tender.type}<br>
        Veröffentlicher: ${tender.publisher}<br>
        Veröffentlichungsdatum: ${tender.publishedDate}<br>
        Frist: ${tender.deadlineDate}<br>
        <a href="${tender.actionLink}" target="_blank">Mehr erfahren</a>
      `;
      tendersDiv.appendChild(tenderDiv);
    });
  }
</script>
</body>
</html>
