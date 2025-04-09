# Description

This is a API server for my grocery app for testing with denoKV

# Quickstart

## Installation

- Clone and Install Dependencies:

```shell
git clone https://github.com/BarbarianTarkus/{PROJECT}.git

deno install
```

## Deployment

- `Local` Start API server (hardcoded on port `8693`):

```shell
# Start Server on localhost
deno task start

# Start Debugging with "debug" task and "Atach to Deno" on VSCode
deno task debug
```

- `Cloud` Start API server on denodeploy

```shell
// You need account on https://dash.deno.com/
// In this case the host would be https://{PROJECT}.deno.dev

deployctl deploy --project {PROJECT} --entrypoint=./server.ts
```

- If you have an outdated version of deno change `--unstable-kv` by `--unstable`

# API Server

## Routes

- User session

* `POST /signup` - Create a new user
* `POST /login` - Login user
* `GET /me` - Get current user

- Products

* `GET /products` - Get all products
* `GET /products/:id` - Get product by id
* `POST /products` - Create a new product
* `PUT /products/:id` - Update a product by id
* `DELETE /products/:id` - Delete a product by id

## Features

- Users
  - JWT Authentication
  - Password hashing with bcrypt
  - User session management
- Products
  - CRUD operations

# Resources

- [Deno KV Quickstart](https://docs.deno.com/deploy/kv/manual/)
- [Deno JWT Creating and Verifying](https://docs.deno.com/examples/creating_and_verifying_jwt/)
- [Bcrypt](https://deno.land/x/bcrypt) - Password hashing Library for Deno
- [awesome-oak](https://oakserver.github.io/awesome-oak/) - Resources made with
  deno and oak
- [Free-Code-Camp API creation Tutorial with deno](https://www.freecodecamp.org/news/create-a-todo-api-in-deno-written-by-a-guy-coming-from-node/)
- [Deno Crud with JWT Authentication](https://github.com/22mahmoud/deno_crud_jwt)
