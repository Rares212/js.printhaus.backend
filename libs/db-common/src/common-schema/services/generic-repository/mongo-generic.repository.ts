import { Model } from 'mongoose';
import { IGenericRepository } from './generic-repository.interface';
import { PaginatedRequestDto } from "@printhaus/common";

export class MongoGenericRepository<T> implements IGenericRepository<T> {
    private _repository: Model<T>;
    private _populateOnFind: string[];

    constructor(repository: Model<T>, populateOnFind: string[] = []) {
        this._repository = repository;
        this._populateOnFind = populateOnFind;
    }

    findAll(pagination?: PaginatedRequestDto): Promise<T[]> {
        let query = this._repository.find();

        if (pagination) {
            const { page, pageSize, sortBy, sortDirection, searchTerms } = pagination;
            query = query.skip(page * pageSize).limit(pageSize);

            if (sortBy && sortDirection) {
                query = query.sort({ [sortBy]: sortDirection === 'ASC' ? 1 : -1 });
            }

            if (searchTerms) {
                searchTerms.forEach(term => {
                    switch(term.operator) {
                        case 'EQUALS':
                            query = query.where({ [term.field]: term.value });
                            break;
                        case 'LIKE':
                            query = query.where({ [term.field]: new RegExp(term.value, 'i') });
                            break;
                        case 'IN':
                            query = query.where({ [term.field]: { $in: term.value } });
                            break;
                        case 'GT':
                            query = query.where({ [term.field]: { $gt: term.value } });
                            break;
                        case 'LT':
                            query = query.where({ [term.field]: { $lt: term.value } });
                            break;
                    }
                });
            }
        }

        return query.populate(this._populateOnFind).exec();
    }

    findById(id: any): Promise<T> {
        return this._repository.findById(id).populate(this._populateOnFind).exec() as Promise<T>;
    }

    create(item: T): Promise<T> {
        return this._repository.create(item);
    }

    update(id: string, item: T): Promise<T> {
        return this._repository.findByIdAndUpdate(id, item);
    }

    count(): Promise<number> {
        return this._repository.countDocuments().exec();
    }

    countEstimated(): Promise<number> {
        return this._repository.estimatedDocumentCount().exec();
    }
}
