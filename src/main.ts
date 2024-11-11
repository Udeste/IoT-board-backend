import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({origin: process.env.ORIGINS})
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

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
