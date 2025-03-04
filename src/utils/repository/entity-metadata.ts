/**
 * 实体元数据接口
 * 定义所有实体共有的基本属性
 */
export interface EntityMetadata {
  /** 实体唯一标识符 */
  id: string;
  
  /** 实体创建时间 */
  createdAt: Date;
  
  /** 实体最后更新时间 */
  updatedAt: Date;
  
  /** 实体删除时间（如果支持软删除） */
  deletedAt?: Date;
}

/**
 * 通用领域实体抽象类
 * 所有领域实体可以继承此类获取基本元数据属性
 */
export abstract class BaseEntity implements EntityMetadata {
  /** 实体唯一标识符 */
  id: string;
  
  /** 实体创建时间 */
  createdAt: Date;
  
  /** 实体最后更新时间 */
  updatedAt: Date;
  
  /** 实体删除时间（如果支持软删除） */
  deletedAt?: Date;
}
