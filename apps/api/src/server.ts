/**
 * Server setup with WebSocket integration
 * Combines Express app with Socket.IO for real-time communication
 */

import { createServer } from 'http';
import app from './app';
import { initializeWebSocketService } from './services/websocket.service';
import { logger } from './utils/logger';

const PORT = process.env.PORT || 3001;

// Create HTTP server
const httpServer = createServer(app);

// Initialize WebSocket service
const webSocketService = initializeWebSocketService(httpServer);

// Start server
if (process.env.NODE_ENV !== 'test') {
  httpServer.listen(PORT, () => {
    logger.info(`🚀 ShipSpeak API server running on port ${PORT}`);
    logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`🔧 Version: ${process.env.API_VERSION || '1.0.0'}`);
    logger.info(`🔌 WebSocket service initialized`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    webSocketService.close();
    httpServer.close(() => {
      logger.info('Process terminated');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    logger.info('SIGINT received, shutting down gracefully');
    webSocketService.close();
    httpServer.close(() => {
      logger.info('Process terminated');
      process.exit(0);
    });
  });
}

export { httpServer, webSocketService };
export default httpServer;