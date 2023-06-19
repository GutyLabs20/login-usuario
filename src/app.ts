import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import { APP_PORT, APP_URL, CORS_URL } from "./config/config";
import { appDataSource } from "./config/db";
import { router } from "./routes";
import path from "path";

class Server {
  public app: Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  config(): void {
    this.app.set("port", APP_PORT);
    this.app.set("url", APP_URL);
    this.app.use(morgan("dev"));
    this.app.use(express.json());
    this.app.use(cors({ origin: CORS_URL }));
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(express.static("public"));
  }

  routes(): void {
    this.app.use(router);
    this.app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, '../public/index.html'));
    });
  }

  conection() {
    appDataSource
      .initialize()
      .then((value) => {
        console.log(`Connection succesfully DB ✔️✔️  ${value.options.database}`);
        this.start();
      })
      .catch(console.log);
  }

  start() {
    this.app.listen(this.app.get("port"), () => {
      // console.log('Server on port', this.app.get('port'));
      console.log("Server run on", this.app.get("url"));
    });
  }
}

export const server = new Server();
