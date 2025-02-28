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
import { ThemesService } from './themes.service';
import { CreatethemesDto } from './dto/create-themes.dto';
import { UpdatethemesDto } from './dto/update-themes.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Themes } from './domain/themes';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllthemesDto } from './dto/find-all-themes.dto';

@ApiTags('Themes')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'themes',
  version: '1',
})
export class ThemesController {
  constructor(private readonly themesService: ThemesService) {}

  @Post()
  @ApiCreatedResponse({
    type: Themes,
  })
  create(@Body() createthemesDto: CreatethemesDto) {
    return this.themesService.create(createthemesDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Themes),
  })
  async findAll(
    @Query() query: FindAllthemesDto,
  ): Promise<InfinityPaginationResponseDto<Themes>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.themesService.findAllWithPagination({
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
    type: Themes,
  })
  findById(@Param('id') id: string) {
    return this.themesService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Themes,
  })
  update(@Param('id') id: string, @Body() updatethemesDto: UpdatethemesDto) {
    return this.themesService.update(id, updatethemesDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.themesService.remove(id);
  }
}
