const { Kafka } = require('kafkajs');
const config = require('../../config');

// Create Kafka instance
const kafka = new Kafka({
  clientId: config.kafka.clientId,
  brokers: config.kafka.brokers,
  retry: {
    initialRetryTime: 100,
    retries: 8
  }
});

module.exports = kafka;