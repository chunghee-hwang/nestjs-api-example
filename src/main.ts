import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 유효성 검사를 도와주는 파이프 설정
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 유효하지 않은 데이터는 컨트롤러로 아예 도달하지 못하도록 함
      forbidNonWhitelisted: true, // 유효하지 않은 데이터를 받으면 리퀘스트 자체를 막는다.
      transform: true, // 사용자가 보낸 데이터를 controller의 param type에 맞게 자동으로 변환해줌
    }),
  );
  await app.listen(3000);
}
bootstrap();
