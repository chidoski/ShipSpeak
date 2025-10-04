/**
 * Main entry point for ShipSpeak API
 * Exports both the Express app and HTTP server with WebSocket support
 */

import app from './app';
import httpServer from './server';

// Export app for testing
export { app };

// Export server for production use
export default httpServer;