import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { commentsService } from './comments.service';
import { CreatecommentsDto } from './dto/create-comments.dto';
import { UpdatecommentsDto } from './dto/update-comments.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { comments } from './domain/comments';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllcommentsDto } from './dto/find-all-comments.dto';

@ApiTags('Comments')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'comments',
  version: '1',
})
export class commentsController {
  constructor(private readonly commentsService: commentsService) {}

  @Post()
  @ApiCreatedResponse({
    type: comments,
  })
  create(@Body() createcommentsDto: CreatecommentsDto) {
    return this.commentsService.create(createcommentsDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(comments),
  })
  async findAll(
    @Query() query: FindAllcommentsDto,
  ): Promise<InfinityPaginationResponseDto<comments>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.commentsService.findAllWithPagination({
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: comments,
  })
  findById(@Param('id') id: string) {
    return this.commentsService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: comments,
  })
  update(
    @Param('id') id: string,
    @Body() updatecommentsDto: UpdatecommentsDto,
  ) {
    return this.commentsService.update(id, updatecommentsDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.commentsService.remove(id);
  }
}
