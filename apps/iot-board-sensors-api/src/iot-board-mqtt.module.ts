import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IotBoardMqttService } from './iot-board-mqtt.service'
import { IotBoardInfluxervice } from './iot-board-influx.service';
import { IotBoardMqttController } from './iot-board-mqtt.controller';
import { TransporterModule } from 'libs/shared/modules/transporter/transporter.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TransporterModule.forRoot('iotbrd-sensor-client'),
  ],
  controllers: [IotBoardMqttController],
  providers: [IotBoardMqttService, IotBoardInfluxervice],
  exports: [IotBoardMqttService]
})
export class IotBoardMqttModule { }
