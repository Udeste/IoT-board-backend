import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IotBoardMqttService } from './iot-board-mqtt.service'
import { ClientsModule, Transport } from '@nestjs/microservices';
import { IotBoardInfluxervice } from './iot-board-influx.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([{
      name: 'ADMIN_API_SERVICE',
      transport: Transport.TCP,
      options: {
        host: process.env.IOTBRD_ADMIN_API_MS_HOST || 'localhost',
        port: Number(process.env.IOTBRD_ADMIN_API_MS_PORT) || 4000
      }
    }]),
  ],
  controllers: [],
  providers: [IotBoardMqttService, IotBoardInfluxervice],
})
export class IotBoardMqttModule { }
