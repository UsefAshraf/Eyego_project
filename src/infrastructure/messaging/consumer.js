const kafka = require('./kafka');
const config = require('../../config');

class KafkaConsumer {
  constructor(activityService) {
    this.consumer = kafka.consumer({ groupId: config.kafka.groupId });
    this.activityService = activityService;
    this.isConnected = false;
  }

  async connect() {
    if (!this.isConnected) {
      await this.consumer.connect();
      this.isConnected = true;
      console.log('✅ Kafka Consumer connected');
    }
  }

  async subscribe() {
    await this.connect();
    await this.consumer.subscribe({
      topic: config.kafka.topic,
      fromBeginning: true  // Start from beginning for testing
    });
    console.log(`📥 Subscribed to topic: ${config.kafka.topic}`);
  }

  async startConsuming() {
    await this.subscribe();

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          // Parse message
          const activityData = JSON.parse(message.value.toString());
          
          console.log(`📨 Received message:`, {
            topic,
            partition,
            offset: message.offset,
            data: activityData
          });

          // Process through domain service
          await this.activityService.processActivity(activityData);
          
          console.log('✅ Activity processed and stored');
        } catch (error) {
          console.error('❌ Error processing message:', error);
          // In production, you might want to send to dead letter queue
        }
      }
    });
  }

  async disconnect() {
    if (this.isConnected) {
      await this.consumer.disconnect();
      this.isConnected = false;
      console.log('Kafka Consumer disconnected');
    }
  }
}

module.exports = KafkaConsumer;