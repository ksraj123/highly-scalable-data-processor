import express from 'express';
import Kafka from 'node-rdkafka';
import eventType from './models/kafkaEventModel.js';
import { validationResult } from 'express-validator';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { validationRules } from './middleware/validator.js';
import { KAFKA_HOST, KAFKA_PORT, KAFKA_TOPIC, PORT } from './env.js';

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
app.post("/", validationRules, (req, res) => {
  console.log(req.body);
  const validationError = validationResult(req).array({ onlyFirstError: true});
  if (validationError.length !== 0) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json(validationError);
  }
  const success = stream.write(eventType.toBuffer(req.body));     
  if (success) {
    console.log(`message queued (${JSON.stringify(req.body)})`);
    res.status(StatusCodes.OK).json({
      success: req.body
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
