import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser'
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({origin: process.env.IOTBRD_ADMIN_API_ORIGINS, credentials: true})
  /* SWAGGER */
  const options = new DocumentBuilder()
    .setTitle('IoT Board Backend')
    .setDescription('NestJS server used for storing data coming from Arduino/ESP8266 based sensors. I.E. DHT22 sensor')
    .setVersion('1.0.0')
    .addTag('projects')
    .addTag('sensors')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  app.connectMicroservice({
    transport: Transport.MQTT,
    options: {
      url: process.env.IOTBRD_MICROSERVICES_TRANSPORT_HOST,
      clientId: 'iotbrd-admin-api'
    }
  })

  await app.startAllMicroservices();
  await app.listen(Number(process.env.IOTBRD_ADMIN_API_APP_PORT) || 3000);
}
bootstrap();
