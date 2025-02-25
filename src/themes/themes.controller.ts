import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ThemesService } from './themes.service';
import { CreateThemeDto } from './dto/create-theme.dto';
import { UpdateThemeDto } from './dto/update-theme.dto';
import { FilterThemeDto, SortThemeDto } from './dto/query-theme.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/roles/roles.guard';
import { Roles } from '@/roles/roles.decorator';
import { RoleEnum } from '@/roles/roles.enum';
import { IPaginationOptions } from '@/utils/types/pagination-options';

@ApiTags('themes')
@Controller('themes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ThemesController {
  constructor(private readonly themesService: ThemesService) {}

  @Post()
  @Roles(RoleEnum.Admin)
  @ApiOperation({ summary: 'Create a new theme' })
  @ApiResponse({ status: 201, description: 'Theme created successfully' })
  create(@Body() createThemeDto: CreateThemeDto) {
    return this.themesService.create(createThemeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all themes with pagination and filters' })
  @ApiResponse({ status: 200, description: 'Return all themes' })
  findAll(
    @Query() filterDto: FilterThemeDto,
    @Query() sortDto: SortThemeDto[],
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const paginationOptions: IPaginationOptions = { page, limit };
    return this.themesService.findAll({
      filterOptions: filterDto,
      sortOptions: sortDto,
      paginationOptions,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get theme by id' })
  @ApiResponse({ status: 200, description: 'Return the theme' })
  findOne(@Param('id') id: string) {
    return this.themesService.findOne(id);
  }

  @Patch(':id')
  @Roles(RoleEnum.Admin)
  @ApiOperation({ summary: 'Update theme by id' })
  @ApiResponse({ status: 200, description: 'Theme updated successfully' })
  update(
    @Param('id') id: string,
    @Body() updateThemeDto: UpdateThemeDto,
  ) {
    return this.themesService.update(id, updateThemeDto);
  }

  @Delete(':id')
  @Roles(RoleEnum.Admin)
  @ApiOperation({ summary: 'Delete theme by id' })
  @ApiResponse({ status: 200, description: 'Theme deleted successfully' })
  remove(@Param('id') id: string) {
    return this.themesService.remove(id);
  }

  @Get('search/name/:name')
  @ApiOperation({ summary: 'Get themes by name' })
  @ApiResponse({ status: 200, description: 'Return themes matching the name' })
  findByName(@Param('name') name: string) {
    return this.themesService.findByName(name);
  }

  @Get('search/category/:category')
  @ApiOperation({ summary: 'Get themes by category' })
  @ApiResponse({ status: 200, description: 'Return themes in the category' })
  findByCategory(@Param('category') category: string) {
    return this.themesService.findByCategory(category);
  }
}
