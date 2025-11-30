export interface IBaseRepository<T> {
  findById(id: string): Promise<T | null>;
  findOne(filter: any): Promise<T | null>;
  findAll(filter?: any): Promise<T[]>;
  create(data: Partial<T>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
  count(filter?: any): Promise<number>;
}
