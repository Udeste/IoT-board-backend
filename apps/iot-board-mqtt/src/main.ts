import { NestFactory } from "@nestjs/core";
import { IotBoardMqttModule } from "./iot-board-mqtt.module";

async function bootstrap() {
  await NestFactory.create(IotBoardMqttModule);
}
bootstrap();
