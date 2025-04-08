import { Context } from "node:vm";

export default ({ response }: Context) => {
  response.status = 404;
  response.body = {
    success: false,
    message: "404 - Not found.",
  };
};
