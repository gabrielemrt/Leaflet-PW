const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  if (req.url === '/form' && req.method === 'GET') {
    
    // leggi il file HTML del form
    fs.readFile('form.html', (err, data) => {
      if (err) {
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.write('Errore nel caricamento del file HTML');
        res.end();
      } else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
      }
    });
  } else if (req.url === '/form' && req.method === 'POST') {
    
    // gestisci la richiesta POST
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
    
      // elabora i dati del form
      const params = new URLSearchParams(body);
      const nomeProgetto = params.get('nome_progetto');
      const dataInizioProgetto = params.get('data_inizio_progetto');
      const dataFineProgetto = params.get('data_fine_progetto');
      const latitudine = params.get('latitudine');
      const longitudine = params.get('longitudine');
      const note = params.get('note');
    
      // fai qualcosa con i dati inseriti nel form
      console.log(`Nome del progetto: ${nome_progetto}`);
      console.log(`Data inzio progetto: ${data_inizio_progetto}`);
      console.log(`Data fine progetto: ${data_fine_progetto}`);
      console.log(`Latitudine: ${latitudine}`);
      console.log(`Longitudine: ${longitudine}`);
      console.log(`Note: ${note}`);
    
      // rispondi con un messaggio di conferma
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.write('Dati del form inviati correttamente');
      res.end();
    });
  } else {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.write('Pagina non trovata');
    res.end();
  }
});

server.listen(3000, () => {
  console.log('Server in ascolto sulla porta 3000');
});
