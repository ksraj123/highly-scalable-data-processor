import express from 'express';
import Kafka from 'node-rdkafka';
import { StatusCodes } from 'http-status-codes';
import eventType from './models/kafkaEventModel.js';
import { validationResult } from 'express-validator';
import { validationRules } from './middleware/validator.js';
import { KAFKA_HOST, KAFKA_PORT, KAFKA_TOPIC, PORT } from './env.js';

class StudentDataForm {
  constructor() {
    this.server = express();
    this.kafkaProducer = Kafka.Producer.createWriteStream({
      'metadata.broker.list': `${KAFKA_HOST}:${KAFKA_PORT}`
    }, {}, {
      topic: `${KAFKA_TOPIC}`
    });
    this.configureKafkaProducer();
    this.serverSetupGlobalMiddlewares();
    this.serverSetupRoutes();
    this.startServer();
  }
  
  configureKafkaProducer() {
    this.kafkaProducer.on('error', (err) => {
      this.kafkaReady = false;
      console.error('Error in our kafka stream');
      console.error(err);
    });
  }

  serverSetupGlobalMiddlewares() {
    this.server.use(express.json());
  }

  serverSetupRoutes() {
    this.server.post("/", validationRules, (req, res) => {
      const validationError = validationResult(req).array({ onlyFirstError: true});
      if (validationError.length !== 0) {
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json(validationError);
      } else {
        try {
          this.writeEventToKafka(req.body);
          res.status(StatusCodes.OK).json({
            success: req.body
          });
        } catch(err) {
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: err.description
          })
        }
      }
    })
  }

  writeEventToKafka(event) {
    const success = this.kafkaProducer.write(eventType.toBuffer(event));     
    if (success) {
      console.log(`message queued (${JSON.stringify(event)})`);
    } else {
      throw('Error writing event to kafka stream');
    }
  }

  startServer() {
    this.server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  }
}

// give some time for kafka stream to startup
setTimeout(() => new StudentDataForm(), 10 * 1000);
