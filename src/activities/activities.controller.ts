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
import { ActivitiesService } from './activities.service';
import { CreateActivitiesDto } from './dto/create-activities.dto';
import { UpdateActivitiesDto } from './dto/update-activities.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Activities } from './domain/activities';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllActivitiesDto } from './dto/find-all-activities.dto';

@ApiTags('Activities')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'activities',
  version: '1',
})
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  @ApiCreatedResponse({
    type: Activities,
  })
  create(@Body() createActivitiesDto: CreateActivitiesDto) {
    return this.activitiesService.create(createActivitiesDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Activities),
  })
  async findAll(
    @Query() query: FindAllActivitiesDto,
  ): Promise<InfinityPaginationResponseDto<Activities>> {
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
    type: Activities,
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
    type: Activities,
  })
  update(
    @Param('id') id: string,
    @Body() updateActivitiesDto: UpdateActivitiesDto,
  ) {
    return this.activitiesService.update(id, updateActivitiesDto);
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
