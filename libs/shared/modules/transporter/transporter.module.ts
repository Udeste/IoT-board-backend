import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({ })
export class TransporterModule {
  static forRoot(clientId): DynamicModule {
    return {
      module: TransporterModule,
      imports: [
        ConfigModule,
        ClientsModule.register({
          clients: [{
            name: 'TRANSPORTER_SERVICE',
            transport: Transport.MQTT,
            options: {
              url: process.env.IOTBRD_MICROSERVICES_TRANSPORT_HOST,
              clientId
            }
          }],
          isGlobal: true
        })
      ]
    }
  }
}
