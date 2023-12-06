import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GatewayExceptionFilter, ResponseInterceptor } from './middlewares';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');

  app.enableCors({
    origin: '*',
    allowedHeaders: '*',
    methods: ['GET', 'POST', 'DELETE'],
  });

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new GatewayExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Payment')
    .setDescription('API description')
    .addBearerAuth({
      type: 'http',
      scheme: 'Bearer',
      bearerFormat: 'JWT',
      in: 'header',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
}
bootstrap();
