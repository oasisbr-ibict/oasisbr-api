import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
const { timestamp, printf } = winston.format;

const oasisbrFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const fileTransport = new winston.transports.DailyRotateFile({
  filename: 'oasisbr-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  dirname: './logs',
  maxSize: '20m',
  maxFiles: '10d',
  level: 'debug',
  format: winston.format.combine(timestamp(), oasisbrFormat),
});

const consoleTransport = new winston.transports.Console({
  level: 'debug',
  format: winston.format.combine(
    winston.format.colorize({ all: true }),
    timestamp(),
    oasisbrFormat,
  ),
});

const transports: winston.transport[] = [consoleTransport];

if (process.env.NODE_ENV === 'production') {
  transports.push(fileTransport);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: transports,
    }),
  });

  app.setGlobalPrefix('api/v1');
  const origins: string[] = process.env.CORS_ORIGIN_URL.split(',');
  app.enableCors({
    origin: origins,
  });
  app.use(helmet());
  const config = new DocumentBuilder()
    .setTitle('OasisBr API')
    .setDescription('The OasisBr API documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/doc', app, document);
  await app.listen(process.env.SERVER_PORT);
}
bootstrap();
