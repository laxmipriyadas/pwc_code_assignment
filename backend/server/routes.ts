import { Application } from "express";
import sync from "./routes/syncDb";
import ping from "./routes/test";
import login from "./routes/login";
import logout from "./routes/logout";
import refreshtoken from "./routes/refreshtoken";
import user from "./routes/user";
import receipts from "./routes/receipts";
import product from "./routes/product";
import store from "./routes/store";
import template from "./routes/template";


export default function routes(app: Application): void {
  app.use("/api/v1/ping", ping);
  app.use("/api/v1/sync", sync);

  app.use("/api/v1/login", login);
  app.use("/api/v1/logout", logout);
  app.use("/api/v1/refreshtoken", refreshtoken);

  app.use("/api/v1/users", user);
  app.use("/api/v1/users/add", user);
  app.use("/api/v1/users/edit", user);
  app.use("/api/v1/users/delete", user);
  app.use("/api/v1/users/active_deactive", user);

  app.use("/api/v1/receipts", receipts);
  app.use("/api/v1/receipts/count", receipts);
  app.use("/api/v1/receipts/approve", receipts);
  app.use("/api/v1/receipts/edit", receipts);
  app.use("/api/v1/receipts/search", receipts);
  app.use("/api/v1/receipts/customer_deatils", receipts);
  app.use("/api/v1/receipts/item_list", receipts);
  app.use("/api/v1/receipts/resolve", receipts);
  app.use("/api/v1/receipts/return", receipts);

  app.use("/api/v1/templates", template);
  app.use("/api/v1/templates/add", template);




  app.use("/api/v1/products", product);
  app.use("/api/v1/products/add", product);
  app.use("/api/v1/products/update", product);
  app.use("/api/v1/products/delete", product);

  app.use("/api/v1/stores", store);
}