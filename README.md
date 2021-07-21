# chalet-docs

1. Create a GitHub access token with repository access
2. Create `.env.local` at the root with:

```
NODE_ENV=development
GITHUB_TOKEN=(your token)
```

3. run:

```
yarn install
yarn dev
```

4. Test GITHUB_TOKEN by going to `localhost:3000/api/chalet-schema/main`
