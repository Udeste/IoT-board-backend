import { NestFactory } from "@nestjs/core";
import { IotBoardMqttModule } from "./iot-board-mqtt.module";
import { Transport } from "@nestjs/microservices";

async function bootstrap() {
  const app = await NestFactory.create(IotBoardMqttModule);

  app.connectMicroservice({
    transport: Transport.MQTT,
    options: {
      url: process.env.IOTBRD_MICROSERVICES_TRANSPORT_HOST,
      clientId: 'iotbrd-sensors-api'
    }
  })

  await app.startAllMicroservices();
}
bootstrap();
