const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || '0.0.0.0';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    let isShuttingDown = false;

    const server = createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error('Error occurred handling', req.url, err);
        if (!res.headersSent) {
          res.statusCode = 500;
          res.end('Internal Server Error');
        }
      }
    });

    server.once('error', (err) => {
      console.error('Server error:', err);
      process.exit(1);
    });

    server.listen(port, hostname, () => {
      console.log(`> Next.js production server ready on http://${hostname}:${port}`);
    });

    // Bezpieczne zamykanie procesu bez błędu Server is not running
    const handleShutdown = (signal) => {
      if (isShuttingDown) return;
      isShuttingDown = true;
      console.log(`Received ${signal}, closing server...`);

      if (server.listening) {
        server.close((err) => {
          if (err) {
            console.error('Error closing server:', err);
          }
          process.exit(0);
        });
      } else {
        process.exit(0);
      }
    };

    process.on('SIGTERM', () => handleShutdown('SIGTERM'));
    process.on('SIGINT', () => handleShutdown('SIGINT'));
  })
  .catch((err) => {
    console.error('Failed to prepare Next.js app:', err);
    process.exit(1);
  });
