import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';
import { MoviesService } from './movies.service';

@Controller('movies') // 루트 URL이 /movies
export class MoviesController {
  constructor(private readonly movieService: MoviesService) {}

  @Get()
  getAll(): Movie[] {
    return this.movieService.getAll();
  }

  @Get('/:id') // Read
  getOne(@Param('id') movieId: number): Movie {
    const movie = this.movieService.getOne(movieId);
    return movie;
  }

  @Post() // Create
  create(@Body() movieData: CreateMovieDto) {
    // Request body 가져오기
    this.movieService.create(movieData);
  }

  @Delete('/:id') // Delete
  remove(@Param('id') movieId: number): void {
    this.movieService.deleteOne(movieId);
  }

  @Patch('/:id') // Update
  patch(@Param('id') movieId: number, @Body() updateData: UpdateMovieDto) {
    console.log(updateData);
    return this.movieService.update(movieId, updateData);
  }
}
