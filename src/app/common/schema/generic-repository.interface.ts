export abstract class IGenericRepository<T> {
    abstract findAll(): Promise<T[]>;

    abstract findById(id: string): Promise<T>;

    abstract create(item: T): Promise<T>;

    abstract update(id: string, item: T);
}