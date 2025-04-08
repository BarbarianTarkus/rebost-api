# Description

This is a API server for my test app with denoKV called `rebost`

# Quickstart

- Clone and Install Dependencies:

```
git clone https://github.com/BarbarianTarkus/rebost-api.git

deno install
```

- Start server (hardcoded on port `8693`):

```
deno run --watch --allow-net --unstable-kv server.ts
```

- If you have an outdated version of deno change `--unstable-kv` by `--unstable`
