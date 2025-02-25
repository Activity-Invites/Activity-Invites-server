import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsArray, IsUrl, IsBoolean } from 'class-validator';

export class CreateThemeDto {
  @ApiProperty({
    description: '主题名称',
    example: '户外运动',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: '主题描述',
    example: '这是一个户外运动主题，包含各种户外活动。',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: '主题分类',
    example: '运动',
  })
  @IsNotEmpty()
  @IsString()
  category: string;

  @ApiProperty({
    description: '主题标签',
    example: ['户外', '运动', '健康'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({
    description: '封面图片',
    example: 'https://example.com/images/outdoor.jpg',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  coverImage?: string;

  @ApiProperty({
    description: '是否已删除',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;
}
