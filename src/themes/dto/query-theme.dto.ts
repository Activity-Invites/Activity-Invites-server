import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsIn, IsArray, IsEnum } from 'class-validator';

export enum ThemeStatus {
  LIGHT = 'light',
  DARK = 'dark',
}

export class FilterThemeDto {
  @ApiProperty({
    description: '主题名称',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: '主题分类',
    required: false,
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({
    description: '主题标签',
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class SortThemeDto {
  @ApiProperty({
    description: '排序字段',
    enum: ['name', 'category', 'createdAt', 'updatedAt'],
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(['name', 'category', 'createdAt', 'updatedAt'])
  orderBy?: string;

  @ApiProperty({
    description: '排序方向',
    enum: ['ASC', 'DESC'],
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC' = 'DESC';

}
