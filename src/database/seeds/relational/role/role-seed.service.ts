import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleEntity } from '../../../../roles/infrastructure/persistence/relational/entities/role.entity';
import { RoleEnum } from '../../../../roles/roles.enum';

@Injectable()
export class RoleSeedService {
  constructor(
    @InjectRepository(RoleEntity)
    private repository: Repository<RoleEntity>,
  ) {}

  async run() {
    const countUser = await this.repository.count({
      where: {
        id: RoleEnum.User,
      },
    });

    if (!countUser) {
      await this.repository.save(
        this.repository.create({
          id: RoleEnum.User,
          name: 'User',
        }),
      );
    }

    const countAdmin = await this.repository.count({
      where: {
        id: RoleEnum.Admin,
      },
    });

    if (!countAdmin) {
      await this.repository.save(
        this.repository.create({
          id: RoleEnum.Admin,
          name: 'Admin',
        }),
      );
    }
  }
}
