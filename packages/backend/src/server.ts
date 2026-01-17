import app from './app.js';
import { env, validateEnv } from './config/environment.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';

async function startServer(): Promise<void> {
  try {
    // Validate environment variables
    validateEnv();

    // Connect to database (optional in development)
    let dbConnected = false;
    try {
      await connectDatabase();
      dbConnected = true;
    } catch (dbError) {
      if (env.NODE_ENV === 'development') {
        console.warn('\n⚠️  Warning: Could not connect to database. Running in limited mode.');
        console.warn('   Database-dependent features will not work.');
        console.warn('   Configure DATABASE_URL in .env to enable full functionality.\n');
      } else {
        throw dbError;
      }
    }

    // Start server
    const server = app.listen(env.PORT, () => {
      console.log(`
========================================
  Studio AI Backend Server
========================================
  Environment: ${env.NODE_ENV}
  Port: ${env.PORT}
  Frontend URL: ${env.FRONTEND_URL}
  Database: ${dbConnected ? '✓ Connected' : '✗ Not connected'}
========================================
      `);
    });

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      console.log(`\n${signal} received. Starting graceful shutdown...`);

      server.close(async () => {
        console.log('HTTP server closed');

        await disconnectDatabase();

        console.log('Graceful shutdown completed');
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
