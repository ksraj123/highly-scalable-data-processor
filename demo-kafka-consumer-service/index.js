import Kafka from 'node-rdkafka';
import eventType from './models/eventType.js';
import {KAFKA_CONSUMER_GROUP, KAFKA_HOST, KAFKA_PORT, KAFKA_TOPIC} from './env.js';

class DemoKafkaConsumer {
  constructor() {
    this.kafkaConsumer = new Kafka.KafkaConsumer({
      'group.id': `${KAFKA_CONSUMER_GROUP}`,
      'metadata.broker.list': `${KAFKA_HOST}:${KAFKA_PORT}`,
    }, {});
    this.initiateKafkaCosumer();
  }

  initiateKafkaCosumer() {
    this.kafkaConsumer.connect();
    this.kafkaConsumer.on('ready', () => {
      console.log('consumer ready..')
      this.kafkaConsumer.subscribe([`${KAFKA_TOPIC}`]);
      this.kafkaConsumer.consume();
    }).on('data', (data) => {
      console.log(data);
      console.log(`received message: ${eventType.fromBuffer(data.value)}`);
    });
  }
}

new DemoKafkaConsumer();
