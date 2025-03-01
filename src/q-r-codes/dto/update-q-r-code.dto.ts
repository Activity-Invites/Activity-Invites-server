// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateQRCodeDto } from './create-q-r-code.dto';

export class UpdateQRCodeDto extends PartialType(CreateQRCodeDto) {}
