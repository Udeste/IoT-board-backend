import { Controller, Get } from '@nestjs/common';
import { IotBoardMqttService } from './iot-board-mqtt.service';

@Controller()
export class IotBoardMqttController {
  constructor(private readonly iotBoardMqttService: IotBoardMqttService) {}

  @Get()
  getHello(): string {
    return this.iotBoardMqttService.getHello();
  }
}
