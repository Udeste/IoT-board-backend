import { Test, TestingModule } from '@nestjs/testing';
import { IotBoardMqttController } from './iot-board-mqtt.controller';
import { IotBoardMqttService } from './iot-board-mqtt.service';

describe('IotBoardMqttController', () => {
  let iotBoardMqttController: IotBoardMqttController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [IotBoardMqttController],
      providers: [IotBoardMqttService],
    }).compile();

    iotBoardMqttController = app.get<IotBoardMqttController>(IotBoardMqttController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(iotBoardMqttController.getHello()).toBe('Hello World!');
    });
  });
});
