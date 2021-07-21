import Kafka from 'node-rdkafka';
import eventType from './models/kafkaEventModel.js';
import GoogleSheetsHelper from './GoogleSheetsHelper.js';
import { KAFKA_HOST,  KAFKA_PORT, KAFKA_TOPIC, KAFKA_CONSUMER_GROUP} from './env.js';

var consumer = new Kafka.KafkaConsumer({
  'group.id': `${KAFKA_CONSUMER_GROUP}`,
  'metadata.broker.list': `${KAFKA_HOST}:${KAFKA_PORT}`,
}, {});

const googleSheetsHelper = new GoogleSheetsHelper();

consumer.connect();

consumer.on('ready', () => {
  console.log('consumer ready..')
  consumer.subscribe([`${KAFKA_TOPIC}`]);
  consumer.consume();
}).on('data', function(data) {
  googleSheetsHelper.appendToSheet();
  console.log(`received message: ${eventType.fromBuffer(data.value)}`);
});
