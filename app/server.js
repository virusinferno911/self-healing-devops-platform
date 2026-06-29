const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// A normal, healthy route
app.get('/', (req, res) => {
  res.send('Ghost Node.js App is running smoothly.');
});

// A route for Kubernetes to check if the app is alive
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// The sabotage route: This intentionally crashes the app to test our self-healing infrastructure
app.get('/crash', (req, res) => {
  console.log('Crash endpoint hit! Simulating a fatal application error...');
  res.status(500).send('Crashing the system...');
  process.exit(1); 
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});