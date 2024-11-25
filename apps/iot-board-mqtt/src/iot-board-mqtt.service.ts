import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { connect } from 'mqtt';
import { ConfigService } from '@nestjs/config';
import { IProject } from 'libs/shared/entities/project.entity';


@Injectable()
export class IotBoardMqttService {
  private readonly mqttHost = this.configService.get<string>('MQTT_BROKER_HOST', 'localhost:1883')

  constructor(
    @Inject('ADMIN_API_SERVICE') private adminApiService: ClientProxy,
    private configService: ConfigService
  ) {
    this.init()
  }

  async init() {
    const mqttClient = connect(`mqtt://${this.mqttHost}`); // create a client

    mqttClient.on('connect', async () => {
      console.log('Mqtt connected to', this.mqttHost);
      const projects: IProject[] = await firstValueFrom(this.adminApiService.send({ cmd: 'projects:getAll' }, {}))

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
      const data = JSON.parse(message)
      const sensor = await firstValueFrom(this.adminApiService.send({ cmd: 'sensors:getbyName' }, data.device))

      if (!sensor) {
        console.error('No sensor found', data)
        return false
      }
      const payload = sensor.measurements.reduce((p, meas) => ({
        ...p,
        [meas]: data[meas]
      }), { tags: sensor.tags })

      console.log({ topic, sensor: sensor.name, payload, data })
    } catch (e) {
      console.error(e)
    }
  }
}
