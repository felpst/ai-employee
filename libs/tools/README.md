## setup

1 - Create the .env files in the respective places:

- ./

  ```
    PYTHON_TOOL_URL=
    SQL_TOOL_URL=
    USER_ID=
  ```

- ./apps/python_api/.env

  ```
    AZURE_API_BASE=
    AZURE_OPENAI_API_KEY=
    DATABASE=
  ```

- ./apps/server/.env

  ```
    PROD=
    PORT=
    OPENAI_API_KEY=
    MONGO_URL=
    retryWrites=
    AUTH_SECRET_KEY=
    CORS_ORIGIN=
    EMAIL_USER=
    EMAIL_PASSWORD=
    AUTH_SECRET_KEY=
    SERPAPI_API_KEY=
    MILVUS_URL=
    AZURE_OPENAI_API_KEY=
    AZURE_INSTANCE_NAME=
    AZURE_VERSION=
  ```

2 - Build the project

Run the command below to run everything in docker:

```
  docker-compose up --build
```

Or

Run the commands below to run locally:

```
  docker compose  -f "docker-compose.yml" up -d --build etcd minio mongodb postgres python-tools standalone
```

and

Run the command to launch the application:

```
  npx nx serve server
```

and

```
  npx nx serve app
```

## tests

Run the command below to test the entire project

`npx nx test`

Or

Run the command below to test each component individually

`npx nx test <component_name>`
