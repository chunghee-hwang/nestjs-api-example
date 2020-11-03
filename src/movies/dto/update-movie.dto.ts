import { PartialType } from '@nestjs/mapped-types';
import { CreateMovieDto } from './create-movie.dto';
// UpdateMovieDto는 CreateMovieDto와 구조가 똑같다.
// 단 모든 변수가 필수사항이 아니라는 점만 다르다.
// 이럴 때, PartialType을 사용하여 간단히 만들 수 있다.
export class UpdateMovieDto extends PartialType(CreateMovieDto) {}
