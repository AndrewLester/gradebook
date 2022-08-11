# Gradebook CRUD
## SvelteKit + Prisma + Litestream

## Development
Install dependencies
`npm install`

Setup test database
`npm run prisma-setup-dev`

Run app
`npm run dev -- --open`

### Local docker testing
Build with docker using build secrets
`docker build --secret id=GOOGLE_APPLICATION_CREDENTIALS --secret id=GOOGLE_APPLICATION_CREDENTIALS_CONTENT -t gradebook .`

Make sure environment variables are exposed
`. ./.env.production`

Run app with production variables
```bash
docker run \
  -p 8080:8080 \
  -v ${PWD}/data:/data \
  -e REPLICA_URL \
  -e GOOGLE_APPLICATION_CREDENTIALS \
  -e DATABASE_URL \
  gradebook
```

## Deployment

Make sure environment variables are exposed
`. ./.env.production`

Deploy to fly.io using build secrets
`flyctl deploy --build-secret GOOGLE_APPLICATION_CREDENTIALS=$GOOGLE_APPLICATION_CREDENTIALS --build-secret "GOOGLE_APPLICATION_CREDENTIALS_CONTENT=$GOOGLE_APPLICATION_CREDENTIALS_CONTENT"`
