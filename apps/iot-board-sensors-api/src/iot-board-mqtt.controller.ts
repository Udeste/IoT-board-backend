import { EventPattern } from '@nestjs/microservices';
import { IotBoardMqttService } from './iot-board-mqtt.service';
import { Controller } from '@nestjs/common';
import { MQTT_EVENTS } from 'libs/shared/constants/mqtt.events';

@Controller('sensors-api')
export class IotBoardMqttController {
  constructor(private readonly iotBoardMqttService: IotBoardMqttService) { }

  @EventPattern(MQTT_EVENTS.CREATED_ONE_PROJECT)
  projectCreated(project) {
    this.iotBoardMqttService.subscribeTo(project.topic)
  }

  @EventPattern(MQTT_EVENTS.UPDATED_ONE_PROJECT)
  projectUpdated(project) {
    // TODO: handle the renaming from the old to new topic if a project is updated
    // this.iotBoardMqttService.reload()
  }

  @EventPattern(MQTT_EVENTS.DELETED_ONE_PROJECT)
  projectDeleted(project) {
    this.iotBoardMqttService.unsubscribeFrom(project.topic)
  }

}
