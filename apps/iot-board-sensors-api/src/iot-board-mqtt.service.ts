import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { connect, MqttClient } from 'mqtt';
import { ConfigService } from '@nestjs/config';
import { IProject } from 'libs/shared/entities/project.entity';
import { IotBoardInfluxervice } from './iot-board-influx.service';
import { ISensorMessage } from 'libs/shared/types/sensorMessage.type';
import { MQTT_EVENTS } from 'libs/shared/constants/mqtt.events';

@Injectable()
export class IotBoardMqttService {
  private readonly mqttHost = this.configService.get<string>('IOTBRD_MICROSERVICES_TRANSPORT_HOST', 'mqtt://localhost:1883')
  private mqttClient: MqttClient;

  constructor(
    @Inject('TRANSPORTER_SERVICE') private transporterService: ClientProxy,
    private configService: ConfigService,
    private influxDbService: IotBoardInfluxervice
  ) {
    this.init()
  }

  async init() {
    this.mqttClient = connect(this.mqttHost, { clientId: 'iotbrd-sensors' }); // create a client

    this.mqttClient.on('connect', async () => {
      console.log('[MQTT] Connected to', this.mqttHost);
      try {
        const projects: IProject[] = await firstValueFrom(this.transporterService.send(MQTT_EVENTS.GET_ALL_PROJECTS, {}))

        if (projects.length === 0) return

        await Promise.all(projects.map(({ topic }) => this.influxDbService.checkAndCreateBucket(topic)))

        this.mqttClient.subscribe(projects.map(({ topic }) => topic), (err, grant) => {
          if (!err) console.log('[MQTT] Subscribed to:', grant)
          else console.error(err)
        })

        this.mqttClient.on('message', (topic, message, packet) => {
          this.handleSensorMessage(topic, message.toString())
        })
      } catch {
        console.error('[MQTT] Failed to subscribe')
      }
    })
  }

  async subscribeTo(topic: string) {
    await this.influxDbService.checkAndCreateBucket(topic)
    this.mqttClient.subscribe(topic, (err, grant) => {
      if (!err) console.log('[MQTT] Subscribed to:', grant)
      else console.error(err)
    })
  }

  async unsubscribeFrom(topic: string) {
    this.mqttClient.unsubscribe(topic, (err) => {
      if (!err) console.log('[MQTT] Unsubscribed from:', topic)
      else console.error(err)
    })
    await this.influxDbService.deleteBucket(topic)
  }

  async handleSensorMessage(topic: string, message: string) {
    try {
      const data = JSON.parse(message) as ISensorMessage
      const sensor = await firstValueFrom(this.transporterService.send(MQTT_EVENTS.GET_SENSOR_BY_NAME, data.device))

      if (!sensor) {
        console.error('[MQTT] No sensor found', data)
        return false
      }
      const payload = sensor.measurements.reduce((p, meas) => ({
        ...p,
        [meas]: (data.measurements && data.measurements[meas]) || -1
      }), {})

      this.influxDbService.saveData(topic, payload, sensor.tags)
    } catch (e) {
      console.error(e)
    }
  }
}
