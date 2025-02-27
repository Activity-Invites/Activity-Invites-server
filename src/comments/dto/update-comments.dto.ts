// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreatecommentsDto } from './create-comments.dto';

export class UpdatecommentsDto extends PartialType(CreatecommentsDto) {}
