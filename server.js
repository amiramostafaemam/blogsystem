import jsonServer from "json-server";
import auth from "json-server-auth";
import cors from "cors";

const app = jsonServer.create();
const router = jsonServer.router("db.json");

app.use(cors());
app.use(jsonServer.bodyParser);
app.db = router.db;

app.use(auth);
app.use(router);

app.listen(4000, () => {
  console.log("JSON Server Auth running at http://localhost:4000");
});
