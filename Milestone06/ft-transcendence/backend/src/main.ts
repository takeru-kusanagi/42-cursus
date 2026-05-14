import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });
  app.use(json({ limit: '10mb' }));
  const isDev = process.env.NODE_ENV !== 'production';
  app.enableCors({
    origin: isDev
      ? true
      : [
          process.env.FRONTEND_URL,
          process.env.APP_URL,
          'http://localhost',
          'http://localhost:80',
          'http://localhost:3000',
          'https://localhost',
          'https://localhost:443',
          'https://localhost:8443',
        ].filter(Boolean) as string[],
    credentials: true,
  });
  app.setGlobalPrefix('api');
  app.useWebSocketAdapter(new IoAdapter(app));

  // Swagger / OpenAPI
  const config = new DocumentBuilder()
    .setTitle('ft_transcendence API')
    .setDescription('Public API for ft_transcendence — Pong game platform')
    .setVersion('1.0')
    .addApiKey(
      { type: 'apiKey', name: 'X-API-Key', in: 'header', description: 'API key for public endpoints' },
      'api-key',
    )
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', description: 'JWT token for user endpoints' },
      'jwt',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 4000;
  await app.listen(port, '0.0.0.0');
  console.log(`Backend listening on port ${port}`);
}
bootstrap();
