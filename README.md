# NestJS API Example

이 레포지토리는 노마드코더의 [NestJS로 API 만들기](https://nomadcoders.co/nestjs-fundamentals)를 수강하고 정리한 레포지토리입니다.

## 0. Instroduction

### NestJS

NestJS는 Node.js의 express와 fastify 위에서 돌아가는 프레임워크이다.
Java에는 Spring이 있듯이 언어마다 프레임워크가 존재한다.
Spring처럼 Node.js보다 좀 더 구조적이고 엄격한 규칙을 적용한다.
기업들이 선호하는 프레임워크이다.

### [Project Setup](https://docs.nestjs.com/)

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

## 1. NestJS의 구조

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
    @Get('/:id')
    getOne(@Param('id') identity: string /*이 변수는 다른 이름을 쓸수 있다.*/) {
      // Param 데코레이터를 써야 정상적으로 인식한다.
      return `This will return one movie with the id: ${identity}`;
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

## 2. Rest API

### Nest CLI 활용하기

#### 사용 가능한 명령어 목록 확인

```bash
nest
```

#### Controller 생성

```bash
nest g controller
? What name would you like to use for the controller? movies
```

컨트롤러 생성하면 movies/movies.controller.ts가 생성되고,  
app.module.ts에 다음과 같이 MoviesController가 자동으로 추가되었음을 알 수 있다.

```ts
@Module({
  imports: [],
  controllers: [MoviesController],
  providers: [],
})
```

### Decorators

- Module : 모듈 정의
- Controller: 컨트롤러 정의
- Injectable
- Get: Get 방식 요청 컨트롤러 정의(Read)
- Post: Post 방식 요청 컨트롤러 정의(Create)
- Delete: Delete 방식 요청 컨트롤러 정의(Delete)
- Patch: Patch 방식 요청 컨트롤러 정의(Update) -> 일부분만 업데이트
- Put: Put 방식 요청 컨트롤러 정의(Update) -> 전체 업데이트
- Query: URL에서 "movies/search?year=2000" 처럼 ?뒤에 들어오는 쿼리를 받을 때 사용
  ```ts
  @Get('search')
  search(@Query('year') searchingYear: string) {
      return `We are search for a movie made after ${searchingYear}`;
  }
  ```
- Param: URL에서 "movies/1" 처럼 슬래시를 기준으로 들어오는 파라미터를 받을 때 사용
  ```ts
  @Get('/:id')
  getOne(@Param('id') movieId: string) {
      return `This will return one movie with the id: ${movieId}`;
  }
  ```
- Body: Post, Delete, Patch, Put 요청 시 함께 들어오는 Request Body 데이터를 받을 때 사용
  ```ts
  @Patch('/:id') // Update
  patch(@Param('id') movieId: string, @Body() updateData) {
      return {
      updatedMovie: movieId,
      ...updateData,
      };
  }
  ```
- Req: HttpRequest 객체를 받을 수 있다. (express가 아닌 fastify위에서 NestJs가 동작 시 사용 안하는 것을 추천)
- Res: HttpResponse 객체를 받을 수 있다. (express가 아닌 fastify위에서 NestJs가 동작 시 사용 안하는 것을 추천)

### 예외 처리

사용자가 DB에 없는 정보를 요청했을 경우 다음과 같이 예외를 던지면 404 http status를 응답한다.

```ts
// movies.service.ts
getOne(id: string): Movie {
  const movie = this.movies.find(movie => movie.id === +id); //+는 parseInt와 같음
  if (!movie) {
    throw new NotFoundException(`Movie with ID ${id} not found.`);
  }
  return movie;
}
```

### 유효성 검사

Request body에 유효하지 않은 데이터가 넘어오는 것을 방지해야한다.

```bash
npm i class-validator class-transformer @nestjs/mapped-types
```

다음과 같이 DTO를 생성하고, IsString 같은 validator로 유효성 검사를 한다.

```ts
// movies/dto/create-movie.dto.ts
export class CreateMovieDto {
  @IsString()
  readonly title: string;
  @IsNumber()
  readonly year: number;
  @IsString({ each: true })
  readonly genres: string[];
}
```

```ts
// movies/dto/update-movie.dto.ts
// UpdateMovieDto는 CreateMovieDto와 구조가 똑같다.
// 단 모든 변수가 필수사항이 아니라는 점만 다르다.
// 이럴 때, PartialType을 사용하여 간단히 만들 수 있다.
export class UpdateMovieDto extends PartialType(CreateMovieDto) {}
```

컨트롤러와 서비스에 request body의 타입을 dto로 명시한다.

```ts
// movies/movies.controller.ts
@Post()
create(@Body() movieData: CreateMovieDto) {}
```

메인 모듈에 Validation Pipe를 사용하겠다고 선언한다.

```ts
// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 유효성 검사를 도와주는 파이프 설정
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 유효하지 않은 데이터는 컨트롤러로 아예 도달하지 못하도록 함
      forbidNonWhitelisted: true, // 유효하지 않은 데이터를 받으면 리퀘스트 자체를 막는다.
      transform: true, // 사용자가 보낸 데이터를 컨트롤러에 명시된 타입으로 자동으로 변환해줌. 예를 들어 id같은 경우 url로 넘어와서 string인데 컨트롤러에 명시된 타입이 number 타입이면 number로 자동 변환됨.
    }),
  );
  await app.listen(3000);
}
```

유효성 검사 결과
<img src="./imgs/validation.png"></img>

### Dependency Injection

#### 컨트롤러에서 서비스 주입하기

```ts
// movies.module.ts
@Module({
  // ...
  providers: [MoviesService], // providers에 MoviesService를 명시(의존성 주입하겠다는 뜻)
})
```

```ts
// movie.service.ts
@Injectable() // 서비스에 의존성 주입이 가능하다고 명시
export class MoviesService {}
```

```ts
//movies.controller.ts
constructor(private readonly movieService: MoviesService/*타입을 반드시 명시해야 주입 가능*/) {}
// this.movieService로 서비스 접근 가능
```

## 3. Unit Testing

## 4. E2E Testing
