import { Router } from "jsr:@oak/oak@^17.1.4";
import { hello, login, me, signup } from "../controllers/user.ts";

const router = new Router();

router
  .get("/", hello)
  .post("/signup", signup)
  .post("/login", login)
  .get("/me", me);

export default router;
