import Kafka from 'node-rdkafka';
import eventType from './models/eventType.js';
import express from 'express';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { envVars } from './env.js';

const { KAFKA_HOST, KAFKA_PORT, KAFKA_TOPIC, PORT } = envVars;

const app = express();
app.use(express.json());

const stream = Kafka.Producer.createWriteStream({
  'metadata.broker.list': `${KAFKA_HOST}:${KAFKA_PORT}`
}, {}, {
  topic: `${KAFKA_TOPIC}`
});

stream.on('error', (err) => {
  console.error('Error in our kafka stream');
  console.error(err);
});

// do some simple form data validation alteast
app.post("/", (req, res) => {
  console.log(req.body);
  const success = stream.write(eventType.toBuffer(req.body));     
  if (success) {
    console.log(`message queued (${JSON.stringify(req.body)})`);
    res.status(StatusCodes.OK).json({
      success: ReasonPhrases.OK
    });
  } else {
    console.log('Too many messages in the queue');
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: 'Too many messages in the queue'
    })
  }
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
