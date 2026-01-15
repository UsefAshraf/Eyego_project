require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/event-microservice'
  },
  
  kafka: {
    brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
    clientId: process.env.KAFKA_CLIENT_ID || 'event-microservice',
    groupId: process.env.KAFKA_GROUP_ID || 'activity-consumer-group',
    topic: process.env.KAFKA_TOPIC || 'user-activities'
  }
};