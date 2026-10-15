# Gregg Shorthand Dictionary

Web searcher and viewer for Gregg Shorthand dictionary. Gregg Shorthand is a
style of shorthand which uses lines and loops to represent words. This app
(built in React) is helpful in learning shorthand by allowing you to search up
words you don't know.

Try it online at [https://greggdict.com](https://greggdict.com)

## Running locally

The React app is in `react_app/`. It uses Node.js 26, npm, Vite, and Cloudflare's
Workers Static Assets tooling.

```sh
cd react_app
mise install
mise x -- npm ci
mise x -- npm run dev
```

Open `http://127.0.0.1:8000`.

## Building and previewing

From the repository root, install the dependencies and build the app with:

```sh
cd react_app
mise install
mise x -- npm ci
mise x -- npm run build
```

`mise x --` runs the command after `--` with the tools selected by mise. This
repository selects Node.js 26 in `.node-version`. To serve the production build
locally, run `mise x -- npm run preview` from `react_app/` and open
`http://127.0.0.1:8000`.

## Deploying

After installing dependencies as described above, run these commands from the
repository root. Sign in with Wrangler once per machine; skip that command if
already authenticated:

```sh
cd react_app
mise x -- npx wrangler login
mise x -- npm run build
mise x -- npm run deploy
```

The build creates the deployment configuration used by Wrangler. This deploys
the `greggdict` Worker configured in `react_app/wrangler.jsonc`. See Cloudflare's
[Wrangler login](https://developers.cloudflare.com/workers/wrangler/commands/general/#login)
and [deploy](https://developers.cloudflare.com/workers/wrangler/commands/workers/#deploy)
documentation for account authentication and deployment details.

Dictionary data and page scans are copied from the repository's `assets/`
directory into the static build. The browser does not fetch them from a CDN.

## Requesting other series

If you would like to me to add series of Gregg Shorthand other than simplified
(which has already been added), fill out [this
form](https://docs.google.com/forms/d/e/1FAIpQLSe7Dhv-7SiZavvGoYE0Fy-n9n7OCmUQjhUCIw0hMjePtQZntA/viewform)

## The OCR Process

The process of identifying the words from the raw scanned images of the
dictionary was quite tedious. It is described in detail in `format/README.md`
