# Description

This is a API server for my test app with denoKV called `rebost`

# Quickstart

- Clone and Install Dependencies:

```
git clone https://github.com/BarbarianTarkus/{PROJECT}.git

deno install
```

- `Local` Start API server (hardcoded on port `8693`):

```
deno run --watch --allow-net --unstable-kv server.ts
```

- `Cloud` Start API server on denodeploy

```shell
// You need account on https://dash.deno.com/
// In this case the host would be https://{PROJECT}.deno.dev

deployctl deploy --project {PROJECT} --entrypoint=./server.ts
```

- If you have an outdated version of deno change `--unstable-kv` by `--unstable`
