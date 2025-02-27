# 序列化

对于序列化样板，使用 [class-transformer](https://www.npmjs.com/package/class-transformer) 和全局拦截器 `ClassSerializerInterceptor`。

---

## 目录 <!-- omit in toc -->

- [隐藏私有属性] (#hide-private-property)
- [为管理员显示私有属性] (#show-private-property-for-admins)

---

## 隐藏私有属性

如果您需要在实体中隐藏某些属性，可以在列上使用 `@Exclude({ toPlainOnly: true })`。

```ts
// /src/users/entities/user.entity.ts

import { Exclude } from 'class-transformer';

@Entity()
export class User extends EntityRelationalHelper {
  // 此处是其他代码...

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  password: string;

  // 此处是其他代码...
}
```

## 为管理员显示私有属性

1. 创建一个只返回管理员数据的控制器，并在方法上添加 `@SerializeOptions({ groups: ['admin'] })`：

   ```ts
   // /src/users/users.controller.ts

   // 此处是其他代码...

   @ApiBearerAuth()
   @Roles(RoleEnum.admin)
   @UseGuards(AuthGuard('jwt'), RolesGuard)
   @Controller({
     path: 'users',
     version: '1',
   })
   export class UsersController {
     constructor(private readonly usersService: UsersService) {}

     // 此处是其他代码...

     @SerializeOptions({
       groups: ['admin'],
     })
     @Get(':id')
     @HttpCode(HttpStatus.OK)
     findOne(@Param('id') id: string) {
       return this.usersService.findOne({ id: +id });
     }

     // 此处是其他代码...
   }
   ```

1. 在实体中，对应该为管理员公开的列添加 `@Expose({ groups: ['admin'] })`：

   ```ts
   // /src/users/entities/user.entity.ts

   // 此处是其他代码...

   import { Expose } from 'class-transformer';

   @Entity()
   export class User extends EntityRelationalHelper {
     // 此处是其他代码...

     @Column({ unique: true, nullable: true })
     @Expose({ groups: ['admin'] })
     email: string | null;

     // 此处是其他代码...
   }
   ```

---

上一篇：[认证](auth.md)

下一篇：[文件上传](file-uploading.md)
