// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateTagsDto } from './create-tags.dto';

export class UpdateTagsDto extends PartialType(CreateTagsDto) {}
