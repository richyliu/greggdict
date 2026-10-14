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

Open `http://127.0.0.1:8000`. The production build can be previewed locally with
`mise x -- npm run build` followed by `mise x -- npm run preview`.

Dictionary data and page scans are copied from the repository's `assets/`
directory into the static build. The browser does not fetch them from a CDN.

## Requesting other series

If you would like to me to add series of Gregg Shorthand other than simplified
(which has already been added), fill out [this
form](https://docs.google.com/forms/d/e/1FAIpQLSe7Dhv-7SiZavvGoYE0Fy-n9n7OCmUQjhUCIw0hMjePtQZntA/viewform)

## The OCR Process

The process of identifying the words from the raw scanned images of the
dictionary was quite tedious. It is described in detail in `format/README.md`
