import { PaginationInput } from '../../graphql/inputs/pagination.input';

export abstract class BaseResolver<T, CreateInput, UpdateInput> {
  constructor(
    protected readonly service: any,
    private readonly entityTypeName: string,
  ) {}

  protected getQueryName(prefix: string): string {
    return `${prefix}${this.entityTypeName}`;
  }

  async findAll(pagination?: PaginationInput) {
    return this.service.findAll(pagination);
  }

  async findOne(id: string) {
    return this.service.findById(id);
  }

  async create(input: CreateInput) {
    return this.service.create(input);
  }

  async update(id: string, input: UpdateInput) {
    return this.service.update(id, input);
  }

  async delete(id: string): Promise<boolean> {
    return this.service.delete(id);
  }
}
