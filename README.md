# htmx Gantt chart over a server task table

**Live demo:** https://toclocoinc.github.io/lattice-grid-demo-htmx-gantt/

The server renders a plain `<table>` of tasks inside a `data-lattice-gantt` element. [Lattice Grid](https://www.latticegrid.dev/htmx/gantt/) turns it into a split view, a task grid on the left and a timeline on the right, with no mount code on the page: only markup, [htmx](https://htmx.org/) and the Lattice htmx module.

The plan is a two-year programme (and a second, data-centre migration plan) with phases, milestones, finish-to-start links, the critical path and progress. The page shows five things:

1. **Built on load.** The server-rendered task table becomes the Gantt. With JavaScript off it is still a readable table.
2. **Swap.** Picking the other project runs an `hx-get`; the old Gantt is torn down and a new one is built from the new table.
3. **Out of band.** "Server slips one task" returns one `<tr data-lattice-row>` with `hx-swap-oob`, and only that task's bar moves.
4. **Edit.** Dragging a bar raises a bubbling `lattice:gantt-change` event; `hx-trigger="lattice:gantt-change"` posts it with `hx-post`, and the server's reply appears under the chart.
5. **Back.** The zoom, scroll and collapsed rows are saved with htmx's history snapshot and come back when you press Back.

## The stand-in server

GitHub Pages is static, so `src/mock-server.js` answers htmx's requests to `/htmx-demo/` in the browser, from the route handlers in `src/server.js`, after a short delay so each swap is visible. Nothing leaves the page. Those handlers are exactly what a real server would do: return the plan's HTML for `GET /htmx-demo/gantt/plan`, store the change and reply with a line of HTML for `POST /htmx-demo/gantt/save`, and return one task row out of band for `POST /htmx-demo/gantt/slip`. Port them to your own backend (Django, Rails, Laravel, Go, anything that renders HTML) and delete the stand-in.

## Run it

```
npm ci
npm run serve        # http://localhost:8000/
npm run verify       # headless Chrome check of the steps (needs Chrome)
```

The grid and the Gantt load from the published `@toclocoinc/lattice-grid` package on jsDelivr; change the version in `index.html` and `main.js` to move to a newer release. On `localhost` no licence key is needed; the key in `main.js` is the public one for `toclocoinc.github.io`.

## Files

- `index.html`: the page, with the server-rendered plan already in it.
- `main.js`: installs the stand-in server, loads the Gantt engine, the Lattice htmx module and htmx.
- `src/server.js`: the demo data, the HTML template and the route handlers.
- `src/mock-server.js`: the in-browser stand-in for a backend.

Licence: MIT for this demo's code. Lattice Grid itself is commercially licensed; see [latticegrid.dev/pricing](https://www.latticegrid.dev/pricing/).
