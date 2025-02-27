# 命令行界面 (CLI)

---

## 目录 <!-- omit in toc -->

- [生成资源] (#generate-resource)
  - [针对文档型数据库 (MongoDB + Mongoose)] (#for-document-oriented-database-mongodb--mongoose)
  - [针对关系型数据库 (PostgreSQL + TypeORM)] (#for-relational-database-postgresql--typeorm)
    - [关系型数据库视频指南 (PostgreSQL + TypeORM)] (#video-guideline-for-relational-database-postgresql--typeorm)
  - [针对两种数据库] (#for-both-databases)
- [向资源添加属性] (#add-property-to-resource)
  - [文档型数据库的属性 (MongoDB + Mongoose)] (#property-for-document-oriented-database-mongodb--mongoose)
  - [关系型数据库的属性 (PostgreSQL + TypeORM)] (#property-for-relational-database-postgresql--typeorm)
    - [如何向关系型数据库添加属性的视频指南 (PostgreSQL + TypeORM)] (#video-guideline-how-to-add-property-for-relational-database-postgresql--typeorm)
  - [针对两种数据库的属性] (#property-for-both-databases)

---

## 生成资源

使用以下命令生成资源：

### 针对文档型数据库 (MongoDB + Mongoose)
  
```bash
npm run generate:resource:document -- --name ResourceName
```

示例：

```bash
npm run generate:resource:document -- --name Category
```

### 针对关系型数据库 (PostgreSQL + TypeORM)

```bash
npm run generate:resource:relational -- --name ResourceName
```

示例：

```bash
npm run generate:resource:relational -- --name Category
```

#### 关系型数据库视频指南 (PostgreSQL + TypeORM)

<https://github.com/user-attachments/assets/f7f91a7d-f9ff-4653-a78a-152ac5e7a95d>

### 针对两种数据库

```bash
npm run generate:resource:all-db -- --name ResourceName
```

示例：

```bash
npm run generate:resource:all-db -- --name Category
--------
npm run migration:generate -- src/database/migrations/xxx
npm run migration:run
```

## 向资源添加属性

### 文档型数据库的属性 (MongoDB + Mongoose)

```bash
npm run add:property:to-document
```

### 关系型数据库的属性 (PostgreSQL + TypeORM)

```bash
npm run add:property:to-relational
```

#### 如何向关系型数据库添加属性的视频指南 (PostgreSQL + TypeORM)

<https://github.com/user-attachments/assets/95b9d70a-70cf-442a-b8bf-a73d32810e0c>

### 针对两种数据库的属性

```bash
npm run add:property:to-all-db
```

---

上一篇：[架构] (architecture.md)

下一篇：[使用数据库] (database.md)
