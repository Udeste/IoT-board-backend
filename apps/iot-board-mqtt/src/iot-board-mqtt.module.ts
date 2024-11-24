import { Module } from '@nestjs/common';
import { IotBoardMqttController } from './iot-board-mqtt.controller';
import { IotBoardMqttService } from './iot-board-mqtt.service';

@Module({
  imports: [],
  controllers: [IotBoardMqttController],
  providers: [IotBoardMqttService],
})
export class IotBoardMqttModule {}
