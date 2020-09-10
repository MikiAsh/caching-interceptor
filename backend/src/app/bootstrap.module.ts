import { ServerModule } from "@sugoi/server"
import { IndexModule } from "../modules/index/index.module";

@ServerModule({
    modules:[IndexModule],
    controllers:[],
    services:[]

})
export class BootstrapModule{}