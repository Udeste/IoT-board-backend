import { NestFactory } from '@nestjs/core';
import { IotBoardMqttModule } from './iot-board-mqtt.module';

async function bootstrap() {
  const app = await NestFactory.create(IotBoardMqttModule);
  await app.listen(process.env.port ?? 3001);
}
bootstrap();
