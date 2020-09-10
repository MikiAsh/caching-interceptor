import { defaultErrorHandler, express, HttpServer } from "@sugoi/server";
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as path from "path";
import * as cors from "cors";
import { paths } from "../config/paths";
import { BootstrapModule } from "./bootstrap.module";
import { Authorization } from "./classes/authorization.class"

const DEVELOPMENT = process.env['isDev']  as any;
const TESTING = process.env['isTest']  as any;
const PROD = process.env['isProd']  as any;



const server: HttpServer = HttpServer.init(BootstrapModule, "/", Authorization)
    .setMiddlewares((app) => {
	app.use(cors());
        app.disable('x-powered-by');
        app.set('etag', 'strong');
        app.set('host', process.env.HOST || '0.0.0.0');
        app.use(express.json());
        app.use(compression());

    })
    .setErrorHandlers((app) => {
        app.use((req, res, next) => {
            // Set fallback to send the web app index file
            return res.sendFile(path.resolve(paths.index))
        });
        // The value which will returns to the client in case of an exception
        app.use(defaultErrorHandler(DEVELOPMENT || TESTING));
    });

export {server};
