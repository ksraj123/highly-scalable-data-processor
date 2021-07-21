import Kafka from 'node-rdkafka';
import eventType from './models/eventType.js';
import GoogleSheetsHelper from './GoogleSheetsHelper.js';

var consumer = new Kafka.KafkaConsumer({
  'group.id': `${process.env.KAFKA_CONSUMER_GROUP}`,
  'metadata.broker.list': `${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`,
}, {});

const googleSheetsHelper = new GoogleSheetsHelper();

consumer.connect();

consumer.on('ready', () => {
  console.log('consumer ready..')
  consumer.subscribe([`${process.env.KAFKA_TOPIC}`]);
  consumer.consume();
}).on('data', function(data) {
  googleSheetsHelper.appendToSheet();
  console.log(`received message: ${eventType.fromBuffer(data.value)}`);
});
