# 架构

---

## 目录 <!-- omit in toc -->

- [六边形架构] (#hexagonal-architecture)
- [动机] (#motivation)
- [模块结构描述] (#description-of-the-module-structure)
- [建议] (#recommendations)
  - [仓库] (#repository)
- [常见问题] (#faq)
  - [是否有一种方法可以使用六边形架构生成新资源（控制器、服务、DTO 等）？] (#is-there-a-way-to-generate-a-new-resource-controller-service-dtos-etc-with-hexagonal-architecture)
- [链接] (#links)

---

## 六边形架构

NestJS 样板项目基于[六边形架构](https://en.wikipedia.org/wiki/Hexagonal_architecture_(software))。这种架构也被称为端口与适配器模式。

![六边形架构图](https://github.com/brocoders/nestjs-boilerplate/assets/6001723/6a6a763e-d1c9-43cc-910a-617cda3a71db)

## 动机

使用六边形架构的主要原因是将业务逻辑与基础设施分离。这种分离使我们能够轻松更改数据库、文件上传方式或任何其他基础设施，而无需更改业务逻辑。

## 模块结构描述

```txt
.
├── domain
│   └── [DOMAIN_ENTITY].ts
├── dto
│   ├── create.dto.ts
│   ├── find-all.dto.ts
│   └── update.dto.ts
├── infrastructure
│   └── persistence
│       ├── document
│       │   ├── document-persistence.module.ts
│       │   ├── entities
│       │   │   └── [SCHEMA].ts
│       │   ├── mappers
│       │   │   └── [MAPPER].ts
│       │   └── repositories
│       │       └── [ADAPTER].repository.ts
│       ├── relational
│       │   ├── entities
│       │   │   └── [ENTITY].ts
│       │   ├── mappers
│       │   │   └── [MAPPER].ts
│       │   ├── relational-persistence.module.ts
│       │   └── repositories
│       │       └── [ADAPTER].repository.ts
│       └── [PORT].repository.ts
├── controller.ts
├── module.ts
└── service.ts
```

`[DOMAIN_ENTITY].ts` 表示业务逻辑中使用的实体。领域实体与数据库或任何其他基础设施没有依赖关系。

`[SCHEMA].ts` 表示**数据库结构**。它用于文档型数据库（MongoDB）。

`[ENTITY].ts` 表示**数据库结构**。它用于关系型数据库（PostgreSQL）。

`[MAPPER].ts` 是一个映射器，用于将**数据库实体**转换为**领域实体**，反之亦然。

`[PORT].repository.ts` 是定义与数据库交互方法的仓库**端口**。

`[ADAPTER].repository.ts` 是实现 `[PORT].repository.ts` 的仓库。它用于与数据库交互。

`infrastructure` 文件夹 - 包含所有与基础设施相关的组件，如 `persistence`、`uploader`、`senders` 等。

每个组件都有 `port` 和 `adapters`。`Port` 是定义与基础设施交互方法的接口。`Adapters` 是 `port` 的实现。

## 建议

### 仓库

不要尝试在仓库中创建通用方法，因为它们在项目生命周期中难以扩展。相反，创建具有单一职责的方法。

```typescript
// ❌
export class UsersRelationalRepository implements UserRepository {
  async find(condition: UniversalConditionInterface): Promise<User> {
    // ...
  }
}

// ✅
export class UsersRelationalRepository implements UserRepository {
  async findByEmail(email: string): Promise<User> {
    // ...
  }
  
  async findByRoles(roles: string[]): Promise<User> {
    // ...
  }
  
  async findByIds(ids: string[]): Promise<User> {
    // ...
  }
}
```

---

## 常见问题

### 是否有一种方法可以使用六边形架构生成新资源（控制器、服务、DTO 等）？

是的，您可以使用 [CLI](cli.md) 通过六边形架构生成新资源。

---

## 链接

- 使用 NestJS 的[依赖倒置原则](https://trilon.io/blog/dependency-inversion-principle)。

---

上一篇：[安装和运行](installing-and-running.md)

下一篇：[命令行界面](cli.md)
