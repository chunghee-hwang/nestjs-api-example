# NestJS API Example

이 레포지토리는 노마드코더의 [NestJS로 API 만들기](https://nomadcoders.co/nestjs-fundamentals)를 수강하고 정리한 레포지토리입니다.

## NestJS

NestJS는 Node.js의 express 위에서 돌아가는 프레임워크이다.
Java에는 Spring이 있듯이 언어마다 프레임워크가 존재한다.
Spring처럼 Node.js보다 좀 더 구조적이고 엄격한 규칙을 적용한다.
기업들이 선호하는 프레임워크이다.

## [Project Setup](https://docs.nestjs.com/)

- Nest CLI 설치, 새 프로젝트 생성

  ```bash
  npm cache clean --force
  sudo npm i -g source-map-resolve
  sudo npm i -g @nestjs/cli
  nest new project_name
  ```

- 프로젝트 실행

  ```bash
  npm run start:dev
  http://localhost:3000 으로 접속
  ```

## NestJS의 구조

Spring과 마찬가지로 계층적 구조를 가진다.  
NestJS는 컨트롤러를 비지니스 로직과 구분 짓고 싶어한다.  
컨트롤러는 url을 가져오는 역할만 한다.  
비지니스 로직은 서비스가 담당한다.  
서비스는 일반적으로 실제 function을 가지는 부분이다.

- main (main.ts)
  모든 것의 루트 모듈과 같다.

  ```ts
  // bootstrap은 함수 이름으로 아무거나 써도 된다.
  async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.listen(3000); // 3000번 포트로 리스닝을 시작한다.
  }
  bootstrap();
  ```

- module(app.module.ts)
  하나의 모듈을 정의하는 계층
  ```ts
  // @Module : 어떤 역할을 하는 함수인지 명시한다. 데코레이터로 Spring의 Annotation과 비슷하다.
  @Module({
    imports: [],
    controllers: [AppController], // 컨트롤러 명시
    providers: [AppService], // 서비스 명시
  })
  export class AppModule {} // AppModule 클래스는 비어있는 것처럼 보이지만 사실 @Module 함수가 안에 있다.
  ```
- controller(app.controller.ts)
  URL을 통해 요청이 오면 그것을 처리하는 계층.  
   express의 라우터와 같다.

  ```ts
  @Controller()
  export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get() // Get 요청 방식
    getHello(): string {
      return this.appService.getHello();
    }
  }
  ```

- service
  비즈니스 로직을 처리하는 계층.
  ```ts
  // 가장 내부에 있는 층으로 데이터를 컨트롤러에 전달하는 역할을 한다.
  @Injectable()
  export class AppService {
    getHello(): string {
      return 'Hello World!';
    }
  }
  ```
