
![Chalet logo](chalet-banner.jpg)
## Website & documentation

<br />
<br />

## Development environment
---

1. Create a GitHub access token with repository access
2. Create `.env.local` at the root with:

```
USE_SERVER_CACHE=1
PRINT_SERVER_CACHE_LOG=1
# NEXT_PUBLIC_API_BASE=http://localhost:3000/api
NEXT_PUBLIC_API_TOKEN=
NEXT_PUBLIC_CRONITOR_CLIENT_ID=
GITHUB_TOKEN=
```

3. Add necessary tokens:
    - `USE_SERVER_CACHE` must contain a `1` to use the server's memory cache. Caching will be disabled in development otherwise
    - `PRINT_SERVER_CACHE_LOG` must contain  `1` to print the server cache log. This can be exhaustive, so it may be worth disabling
    - `GITHUB_TOKEN` should have access to `github.com/chalet-org/chalet`
    - `NEXT_PUBLIC_API_TOKEN` can be anything while in the development environment. It just ensures the api can only be used by the website itself.
    - `NEXT_PUBLIC_CRONITOR_CLIENT_ID` is optional - it's used for basic site analytics in production (page visits & downloads)
    - `NEXT_PUBLIC_API_BASE` is optional. It falls back to `http://localhost:3000/api`

4. run:

```
pnpm run install
pnpm run start
```

5. Test GITHUB_TOKEN by going to `localhost:3000/api/schema/latest/settings-json` (this is a public endpoint)


## To test for production
---

Instead of `pnpm run start`, run `pnpm run build && pnpm run serve`

