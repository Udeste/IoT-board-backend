import { Injectable } from '@nestjs/common';

@Injectable()
export class IotBoardMqttService {
  getHello(): string {
    return 'Hello World!';
  }
}
