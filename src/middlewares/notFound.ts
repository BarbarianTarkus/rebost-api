import { Context } from "jsr:@oak/oak@^17.1.4";

export default ({ response }: Context) => {
  response.status = 404;
  response.body = {
    success: false,
    message: "404 - Not found.",
  };
};
