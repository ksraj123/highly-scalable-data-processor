import Kafka from 'node-rdkafka';
import eventType from './models/eventType.js';

var consumer = new Kafka.KafkaConsumer({
  'group.id': 'kafka',
  'metadata.broker.list': `${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`,
}, {});

consumer.connect();

consumer.on('ready', () => {
  console.log('consumer ready..')
  consumer.subscribe([`${process.env.KAFKA_TOPIC}`]);
  consumer.consume();
}).on('data', function(data) {
  console.log(`received message: ${eventType.fromBuffer(data.value)}`);
});
