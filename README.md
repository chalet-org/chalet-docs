# chalet-docs

1. Create a GitHub access token with repository access
2. Create `.env.local` at the root with:

```
NODE_ENV=development
NEXT_PUBLIC_API_TOKEN=
```

3. Add `export GITHUB_TOKEN=(your token)` to your shell somewhere ( in `.zshrc` or `.bashrc`). `source` the file, or restart your shell afterwards

4. run:

```
yarn install
yarn dev
```

5. Test GITHUB_TOKEN by going to `localhost:3000/api/schema/latest/settings-json`
