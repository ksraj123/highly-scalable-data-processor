import Kafka from 'node-rdkafka';
import eventType from './models/kafkaEventModel.js';
import GoogleSheetsHelper from './GoogleSheetsHelper.js';
import { KAFKA_HOST,  KAFKA_PORT, KAFKA_TOPIC, KAFKA_CONSUMER_GROUP, EVENT_BATCH_SIZE} from './env.js';

class StudentDataFormConsumer {
  constructor() {
    this.events = [];
    this.kafkaConsumer = new Kafka.KafkaConsumer({
      'group.id': `${KAFKA_CONSUMER_GROUP}`,
      'metadata.broker.list': `${KAFKA_HOST}:${KAFKA_PORT}`,
    }, {});
    this.googleSheetsHelper = new GoogleSheetsHelper();
    this.initiateKafkaCosumer();
  }

  initiateKafkaCosumer() {
    this.kafkaConsumer.connect();
    this.kafkaConsumer.on('ready', () => {
      console.log('consumer ready..')
      this.kafkaConsumer.subscribe([`${KAFKA_TOPIC}`]);
      this.kafkaConsumer.consume();
    }).on('data', (data) => {
      const eventData = eventType.fromBuffer(data.value);
      this.events.push(eventData);
      if (this.events.length === Number(EVENT_BATCH_SIZE)) {
        this.googleSheetsHelper.appendToSheet(this.events);
        this.events = [];
      }
      console.log(`received message: ${eventData}`);
    });
  }
}

new StudentDataFormConsumer();
