import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';

@Controller('movies') // 루트 URL이 /movies
export class MoviesController {
  @Get()
  getAll() {
    return 'This will return all movies.';
  }

  @Get('search')
  search(@Query('year') searchingYear: string) {
    return `We are search for a movie made after ${searchingYear}`;
  }

  @Get('/:id') // Read
  getOne(@Param('id') movieId: string) {
    return `This will return one movie with the id: ${movieId}`;
  }

  @Post() // Create
  create(@Body() movieData) {
    // Request body 가져오기
    return movieData;
  }

  @Delete('/:id') // Delete
  remove(@Param('id') movieId: string) {
    return `This will delete a movie with the id ${movieId}`;
  }

  @Patch('/:id') // Update
  patch(@Param('id') movieId: string, @Body() updateData) {
    return {
      updatedMovie: movieId,
      ...updateData,
    };
  }
}
