import { Model } from "mongoose";
import {IGenericRepository} from "./generic-repository.interface";

export class MongoGenericRepository<T> implements IGenericRepository<T> {
    private _repository: Model<T>;
    private _populateOnFind: string[];

    constructor(repository: Model<T>, populateOnFind: string[] = []) {
        this._repository = repository;
        this._populateOnFind = populateOnFind;
    }

    findAll(): Promise<T[]> {
        return this._repository.find().populate(this._populateOnFind).exec();
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
}