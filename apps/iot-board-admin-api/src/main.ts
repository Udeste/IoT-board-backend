import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser'
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({origin: process.env.ORIGINS, credentials: true})
  /* SWAGGER */
  const options = new DocumentBuilder()
    .setTitle('IoT Board Backend')
    .setDescription('NestJS server used for storing data coming from Arduino/ESP8266 based sensors. I.E. DHT22 sensor')
    .setVersion('1.0.0')
    .addTag('projects')
    .addTag('sensors')
    .addTag('sensors-data')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: process.env.ADMIN_API_MS_HOST || 'localhost',
      port: Number(process.env.ADMIN_API_MS_PORT) || 4000
    }
  })

  await app.startAllMicroservices();
  await app.listen(Number(process.env.APP_PORT) || 3000);
}
bootstrap();
