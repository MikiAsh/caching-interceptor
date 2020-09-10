import {
    Controller,
    HttpGet,
    RequestParam,
    QueryParam,
    Authorized, HttpPost, RequestBody
} from "@sugoi/server";
import { IndexService } from "../services/index.service";
import {UserModel} from "../models/user.model";
import {QueryOptions, SortItem, SortOptions} from "@sugoi/orm";

@Controller('/users')
@Authorized()
export class IndexController {

    private users: any[] = []

    constructor(
        private indexService:IndexService
    ){

    }


    @HttpGet("/")
    async index(@QueryParam('page') page: number,
                @QueryParam('limit') limit: number,
                @QueryParam('sort') sort: string,
                @QueryParam('sortDir') sortDirection: string
    ) {
        page = page || 0;
        sort = sort || '';
        limit = parseInt(limit as any);
        sortDirection = sortDirection || '';
        if (
            (!limit || limit > 10000)
        ) {
            return 400;
        }

        return await UserModel.find({}, QueryOptions.builder()
            .setLimit(limit)
            .setOffset(page * limit)
            .setSortOptions(new SortItem(
                sortDirection.toUpperCase() as any,
                sort
            ))).then(users => users.map(user => user.id));
    }

    @HttpPost("/")
    queryByIds(@RequestBody() body: any){
        if(
            !(
                Array.isArray(body.ids)
                && body.ids.length < 10000
            )
        ){
            return 400;
        }

        return body.ids.reduce((arr, id) => {
            if(UserModel.USERS_MAP[id]){
                arr.push(UserModel.USERS_MAP[id]);
            }
            return arr;
        }, []);

    }

}
