import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { connect } from 'mqtt';
import { ConfigService } from '@nestjs/config';
import { IProject } from 'libs/shared/entities/project.entity';
import { IotBoardInfluxervice } from './iot-board-influx.service';
import { ISensorMessage } from 'libs/shared/types/sensorMessage.type';


@Injectable()
export class IotBoardMqttService {
  private readonly mqttHost = this.configService.get<string>('IOTBRD_SENSORS_API_MQTT_BROKER_HOST', 'localhost:1883')

  constructor(
    @Inject('ADMIN_API_SERVICE') private adminApiService: ClientProxy,
    private configService: ConfigService,
    private influxDbService: IotBoardInfluxervice
  ) {
    this.init()
  }

  async init() {
    const mqttClient = connect(`mqtt://${this.mqttHost}`); // create a client

    mqttClient.on('connect', async () => {
      console.log('Mqtt connected to', this.mqttHost);
      const projects: IProject[] = await firstValueFrom(this.adminApiService.send({ cmd: 'projects:getAll' }, {}))

      if(projects.length === 0) return 

      await Promise.all(projects.map(({ topic }) => this.influxDbService.checkAndCreateBucket(topic)))

      mqttClient.subscribe(projects.map(({ topic }) => topic), (err, grant) => {
        if (!err) console.log('Subscribed to:', grant)
        else console.error(err)
      })
    })

    mqttClient.on('message', (topic, message, packet) => {
      this.handleSensorMessage(topic, message.toString())
    })
  }

  async handleSensorMessage(topic: string, message: string) {
    try {
      const data = JSON.parse(message) as ISensorMessage
      const sensor = await firstValueFrom(this.adminApiService.send({ cmd: 'sensors:getbyName' }, data.device))

      if (!sensor) {
        console.error('No sensor found', data)
        return false
      }
      const payload = sensor.measurements.reduce((p, meas) => ({
        ...p,
        [meas]: (data.measurements && data.measurements[meas]) || -1
      }), { })

      this.influxDbService.saveData(topic, payload, sensor.tags)
    } catch (e) {
      console.error(e)
    }
  }
}
