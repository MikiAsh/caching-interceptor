import {ModelName, ModelAbstract, QueryOptions, SortOptions} from '@sugoi/orm';
const random = require('random-name');

@ModelName("/user")
export class UserModel extends ModelAbstract{

    static USERS = [];
    static USERS_MAP = {};
    static MAX_USERS = 100000;
    age: number;
    name: any;
    id: string;

    public static generateGuid(): string {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }
    constructor() {
        super();

        this.age = Math.floor(Math.random() * 70);
        this.name = random.first();
        this.id = UserModel.generateGuid();
        UserModel.USERS_MAP[this.id] = this;
    }
    protected updateEmitter<T = any>(options?: any,query?:any){
            return null
    }

    protected saveEmitter(options?: any): Promise<any> {
        return null
    }

    protected static removeEmitter(query?: any) {
        return null
    }

    protected static findEmitter(query: any, options: QueryOptions): Promise<any> {
        const limit = options.getLimit();
        const offset = options.getOffset();
        const sortOptions = options.getSortOptions();
        if(sortOptions ){
            const sort = sortOptions[0];
            this.USERS.sort((userA, userB) => {
                const a = userA[sort.field]+'';
                const b = userB[sort.field]+'';
                const res = a.localeCompare(b);
                if(sort.sortOption){
                    switch (sort.sortOption) {
                        case  SortOptions.DESC:
                            return res * -1;
                        case  SortOptions.ASC:
                        default:
                            return res;

                    }
                }
                return res
            })
        }
        return Promise.resolve(this.USERS.slice(offset, offset + limit))
    }
}

console.log('initiate users');
for (let i = 0; i < UserModel.MAX_USERS; i++){
    UserModel.USERS.push(new UserModel())
}