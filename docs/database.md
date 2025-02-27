# 使用数据库

---

## 目录 <!-- omit in toc -->

- [关于数据库] (#about-databases)
- [使用数据库架构 (TypeORM)] (#working-with-database-schema-typeorm)
  - [生成迁移] (#generate-migration)
  - [运行迁移] (#run-migration)
  - [回滚迁移] (#revert-migration)
  - [删除数据库中的所有表] (#drop-all-tables-in-database)
- [使用数据库架构 (Mongoose)] (#working-with-database-schema-mongoose)
  - [创建架构] (#create-schema)
- [数据填充 (TypeORM)] (#seeding-typeorm)
  - [创建种子 (TypeORM)] (#creating-seeds-typeorm)
  - [运行种子 (TypeORM)] (#run-seed-typeorm)
  - [工厂和假数据 (TypeORM)] (#factory-and-faker-typeorm)
- [数据填充 (Mongoose)] (#seeding-mongoose)
  - [创建种子 (Mongoose)] (#creating-seeds-mongoose)
  - [运行种子 (Mongoose)] (#run-seed-mongoose)
- [性能优化 (PostgreSQL + TypeORM)] (#performance-optimization-postgresql--typeorm)
  - [索引和外键] (#indexes-and-foreign-keys)
  - [最大连接数] (#max-connections)
- [性能优化 (MongoDB + Mongoose)] (#performance-optimization-mongodb--mongoose)
  - [设计架构] (#design-schema)

---

## 关于数据库

样板支持两种类型的数据库：使用 TypeORM 的 PostgreSQL 和使用 Mongoose 的 MongoDB。您可以选择其中一种或在项目中同时使用两种。数据库的选择取决于您项目的需求。

为了支持两种数据库，使用了[六边形架构] (architecture.md#hexagonal-architecture)。

## 使用数据库架构 (TypeORM)

### 生成迁移

1. 创建扩展名为 `.entity.ts` 的实体文件。例如 `post.entity.ts`：

   ```ts
   // /src/posts/infrastructure/persistence/relational/entities/post.entity.ts

   import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
   import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

   @Entity()
   export class Post extends EntityRelationalHelper {
     @PrimaryGeneratedColumn()
     id: number;

     @Column()
     title: string;

     @Column()
     body: string;

     // 这里是您需要的任何字段
   }
   ```

1. 接下来，生成迁移文件：

   ```bash
   npm run migration:generate -- src/database/migrations/CreatePostTable
   ```

1. 通过 [npm run migration:run] (#run-migration) 将此迁移应用到数据库。

### 运行迁移

```bash
npm run migration:run
```

### 回滚迁移

```bash
npm run migration:revert
```

### 删除数据库中的所有表

```bash
npm run schema:drop
```

---

## 使用数据库架构 (Mongoose)

### 创建架构

1. 创建扩展名为 `.schema.ts` 的实体文件。例如 `post.schema.ts`：

   ```ts
   // /src/posts/infrastructure/persistence/document/entities/post.schema.ts

   import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
   import { HydratedDocument } from 'mongoose';

   export type PostSchemaDocument = HydratedDocument<PostSchemaClass>;

   @Schema({
     timestamps: true,
     toJSON: {
       virtuals: true,
       getters: true,
     },
   })
   export class PostSchemaClass extends EntityDocumentHelper {
     @Prop()
     title: string;

     @Prop()
     body: string;

     // 这里是您需要的任何字段
   }

   export const PostSchema = SchemaFactory.createForClass(PostSchemaClass);
   ```

---

## 数据填充 (TypeORM)

### 创建种子 (TypeORM)

1. 使用 `npm run seed:create:relational -- --name Post` 创建种子文件。其中 `Post` 是实体的名称。
1. 转到 `src/database/seeds/relational/post/post-seed.service.ts`。
1. 在 `run` 方法中扩展您的逻辑。
1. 运行 [npm run seed:run:relational] (#run-seed-typeorm)

### 运行种子 (TypeORM)

```bash
npm run seed:run:relational
```

### 工厂和假数据 (TypeORM)

1. 安装 faker：

    ```bash
    npm i --save-dev @faker-js/faker
    ```

1. 创建 `src/database/seeds/relational/user/user.factory.ts`：

    ```ts
    import { faker } from '@faker-js/faker';
    import { RoleEnum } from '../../../../roles/roles.enum';
    import { StatusEnum } from '../../../../statuses/statuses.enum';
    import { Injectable } from '@nestjs/common';
    import { InjectRepository } from '@nestjs/typeorm';
    import { Repository } from 'typeorm';
    import { RoleEntity } from '../../../../roles/infrastructure/persistence/relational/entities/role.entity';
    import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';
    import { StatusEntity } from '../../../../statuses/infrastructure/persistence/relational/entities/status.entity';

    @Injectable()
    export class UserFactory {
      constructor(
        @InjectRepository(UserEntity)
        private repositoryUser: Repository<UserEntity>,
        @InjectRepository(RoleEntity)
        private repositoryRole: Repository<RoleEntity>,
        @InjectRepository(StatusEntity)
        private repositoryStatus: Repository<StatusEntity>,
      ) {}

      createRandomUser() {
        // 需要保存 "this" 上下文
        return () => {
          return this.repositoryUser.create({
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            role: this.repositoryRole.create({
              id: RoleEnum.user,
              name: 'User',
            }),
            status: this.repositoryStatus.create({
              id: StatusEnum.active,
              name: 'Active',
            }),
          });
        };
      }
    }
    ```

1. 在 `src/database/seeds/relational/user/user-seed.service.ts` 中进行更改：

    ```ts
    // 这里有一些代码...
    import { UserFactory } from './user.factory';
    import { faker } from '@faker-js/faker';

    @Injectable()
    export class UserSeedService {
      constructor(
        // 这里有一些代码...
        private userFactory: UserFactory,
      ) {}

      async run() {
        // 这里有一些代码...

        await this.repository.save(
          faker.helpers.multiple(this.userFactory.createRandomUser(), {
            count: 5,
          }),
        );
      }
    }
    ```

1. 在 `src/database/seeds/relational/user/user-seed.module.ts` 中进行更改：

    ```ts
    import { Module } from '@nestjs/common';
    import { TypeOrmModule } from '@nestjs/typeorm';
    
    import { UserSeedService } from './user-seed.service';
    import { UserFactory } from './user.factory';

    import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';
    import { RoleEntity } from '../../../../roles/infrastructure/persistence/relational/entities/role.entity';
    import { StatusEntity } from '../../../../statuses/infrastructure/persistence/relational/entities/status.entity';

    @Module({
      imports: [TypeOrmModule.forFeature([UserEntity, Role, Status])],
      providers: [UserSeedService, UserFactory],
      exports: [UserSeedService, UserFactory],
    })
    export class UserSeedModule {}

    ```

1. 运行种子：

    ```bash
    npm run seed:run
    ```

---

## 数据填充 (Mongoose)

### 创建种子 (Mongoose)

1. 使用 `npm run seed:create:document -- --name Post` 创建种子文件。其中 `Post` 是实体的名称。
1. 转到 `src/database/seeds/document/post/post-seed.service.ts`。
1. 在 `run` 方法中扩展您的逻辑。
1. 运行 [npm run seed:run:document] (#run-seed-mongoose)

### 运行种子 (Mongoose)

```bash
npm run seed:run:document
```

---

## 性能优化 (PostgreSQL + TypeORM)

### 索引和外键

不要忘记在外键（FK）列上创建 `索引`（如果需要），因为默认情况下 PostgreSQL [不会自动向 FK 添加索引](https://stackoverflow.com/a/970605/18140714)。

### 最大连接数

在 `/.env` 中为您的应用程序设置最优的数据库[最大连接数](https://node-postgres.com/apis/pool)：

```txt
DATABASE_MAX_CONNECTIONS=100
```

您可以将此参数视为应用程序可以处理的并发数据库连接数。

## 性能优化 (MongoDB + Mongoose)

### 设计架构

为 MongoDB 设计架构与为关系型数据库设计架构完全不同。为了获得最佳性能，您应该根据以下内容设计架构：

1. [MongoDB 架构设计反模式](https://www.mongodb.com/developer/products/mongodb/schema-design-anti-pattern-massive-arrays)
1. [MongoDB 架构设计最佳实践](https://www.mongodb.com/developer/products/mongodb/mongodb-schema-design-best-practices/)

---

上一篇：[命令行界面] (cli.md)

下一篇：[认证] (auth.md)
