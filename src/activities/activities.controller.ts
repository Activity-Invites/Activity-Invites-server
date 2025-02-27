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
import { activitiesService } from './activities.service';
import { CreateactivitiesDto } from './dto/create-activities.dto';
import { UpdateactivitiesDto } from './dto/update-activities.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { activities } from './domain/activities';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllactivitiesDto } from './dto/find-all-activities.dto';

@ApiTags('Activities')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'activities',
  version: '1',
})
export class activitiesController {
  constructor(private readonly activitiesService: activitiesService) {}

  @Post()
  @ApiCreatedResponse({
    type: activities,
  })
  create(@Body() createactivitiesDto: CreateactivitiesDto) {
    return this.activitiesService.create(createactivitiesDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(activities),
  })
  async findAll(
    @Query() query: FindAllactivitiesDto,
  ): Promise<InfinityPaginationResponseDto<activities>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.activitiesService.findAllWithPagination({
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
    type: activities,
  })
  findById(@Param('id') id: string) {
    return this.activitiesService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: activities,
  })
  update(
    @Param('id') id: string,
    @Body() updateactivitiesDto: UpdateactivitiesDto,
  ) {
    return this.activitiesService.update(id, updateactivitiesDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.activitiesService.remove(id);
  }
}
