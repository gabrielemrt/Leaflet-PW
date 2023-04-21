const http = require('http');

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    res.write(`
      <html>
        <head>
          <title><center>FORM INSERIMENTO DATI</center></title>
        </head>
        <body>
          <h1>Inserimento dati progetto</h1>
          <form method="POST" action="/submit">
            <label for="dataInizio">Data inizio progetto:</label>
            <input type="date" id="dataInizio" name="dataInizio"><br><br>
            <label for="dataFine">Data fine progetto:</label>
            <input type="date" id="dataFine" name="dataFine"><br><br>
            <label for="latitudine">Latitudine:</label>
            <input type="text" id="latitudine" name="latitudine"><br><br>
            <label for="longitudine">Longitudine:</label>
            <input type="text" id="longitudine" name="longitudine"><br><br>
            <label for="note">Note:</label>
            <textarea id="note" name="note"></textarea><br><br>
            <input type="submit" value="Invia">
          </form>
        </body>
      </html>
    `);
    res.end();
  } else if (req.method === 'POST' && req.url === '/submit') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const formData = new URLSearchParams(body);
      const dataInizio = formData.get('dataInizio');
      const dataFine = formData.get('dataFine');
      const latitudine = formData.get('latitudine');
      const longitudine = formData.get('longitudine');
      const note = formData.get('note');
      console.log(`Data inizio: ${dataInizio}`);
      console.log(`Data fine: ${dataFine}`);
      console.log(`Latitudine: ${latitudine}`);
      console.log(`Longitudine: ${longitudine}`);
      console.log(`Note: ${note}`);
      res.write('Dati inviati con successo!');
      res.end();
    });
  } else {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.write('404 Not Found');
    res.end();
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
