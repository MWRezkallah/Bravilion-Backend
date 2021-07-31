import { Permissions } from "../../models";

export interface IRepository<T> {
    initCollection(): Promise<void>;
    cleanUp(): Promise<void>;
    createMany(item: T[], cleanUp?: boolean): Promise<any>;
    create(item: T, cleanUp?: boolean): Promise<any>;
    update(id: string, item: T, cleanUp?: boolean): Promise<any>;
    delete(id: string, cleanUp?: boolean): Promise<boolean>;
    findAll(cleanUp?: boolean): Promise<any>;
    findOne(id: string, cleanUp?: boolean): Promise<any>;
    findAllPaging(limit: number, skip: number, cleanUp?: boolean): Promise<any>;
    findByQuery(query: any, limit: number, skip: number, cleanUp?: boolean): Promise<any>;
    findAllByQuery(query: any, cleanUp?: boolean): Promise<any>;
    findOneByQuery(query: any, cleanUp?: boolean): Promise<any>;
    updateByQuery(filter: any, updatedObject: any, cleanUp?: boolean): Promise<any>;
    deleteByQuery(query: any, cleanUp?: boolean): Promise<any>;
    isAllowed(permissions: Permissions, method: string, auth?: boolean, roles?: any[]): boolean;
}

export enum Methods {

    createMany = 'createMany',
    create = 'create',
    update = 'update',
    delete = 'delete',
    findAll = 'findAll',
    findOne = 'findOne',
    findAllPaging = 'findAllPaging',
    findByQuery = 'findByQuery',
    findAllByQuery = 'findAllByQuery',
    findOneByQuery = 'findOneByQuery',
    updateByQuery = 'updateByQuery',
    deleteByQuery = 'deleteByQuery'

}