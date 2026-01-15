const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const config = require('./src/config');
const { connectDB } = require('./src/infrastructure/database/mongodb');
const errorHandler = require('./src/interfaces/middleware/errorHandler');

// Infrastructure
const ActivityRepository = require('./src/infrastructure/database/repositories/ActivityRepository');
const kafkaProducer = require('./src/infrastructure/messaging/producer');
const KafkaConsumer = require('./src/infrastructure/messaging/consumer');

// Domain
const ActivityService = require('./src/domain/services/ActivityService');

// Application
const CreateActivity = require('./src/application/useCases/CreateActivity');
const GetActivities = require('./src/application/useCases/GetActivities');

// Interface
const ActivityController = require('./src/interfaces/http/controllers/ActivityController');
const createActivityRoutes = require('./src/interfaces/http/routes/activityRoutes');

// Initialize Express
const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Dependency Injection (Simple DI)
const activityRepository = new ActivityRepository();
const activityService = new ActivityService(activityRepository);
const createActivityUseCase = new CreateActivity(kafkaProducer);
const getActivitiesUseCase = new GetActivities(activityService);
const activityController = new ActivityController(createActivityUseCase, getActivitiesUseCase);

// Routes
app.use('/api/activities', createActivityRoutes(activityController));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

// Start server
async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Kafka Consumer
    const kafkaConsumer = new KafkaConsumer(activityService);
    await kafkaConsumer.startConsuming();

    // Start Express server
    app.listen(config.port, () => {
      console.log(`🚀 Server running on port ${config.port}`);
      console.log(`📍 Environment: ${config.nodeEnv}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('SIGTERM received, shutting down gracefully');
      await kafkaProducer.disconnect();
      await kafkaConsumer.disconnect();
      process.exit(0);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();