// Order is the whole trick: the stand-in server goes in first, the Gantt engine
// and the Lattice htmx module next so their listeners are registered, and htmx
// itself last. htmx then processes the page and fires htmx:load for the
// server-rendered table, which is what builds the Gantt. No mount call anywhere.
import { installMockServer } from './src/mock-server.js?v=20261012a';
import { routes, ganttFragment, projectFor } from './src/server.js?v=20261012a';

const GRID = 'https://cdn.jsdelivr.net/npm/@toclocoinc/lattice-grid@1.101.5';
const HTMX = 'https://cdn.jsdelivr.net/npm/htmx.org@2.0.4/dist/htmx.min.js';
const HTMX_SRI = 'sha384-HGfztofotfshcF7+8n44JQL2oJmowVChPTg48S+jvZoztPfvwD79OC/LTtG6dMp+';
// Public, domain-bound key for toclocoinc.github.io; on localhost no key is needed.
const LICENCE = 'LG1.eyJ2IjoxLCJwIjoibGF0dGljZS1ncmlkIiwidCI6IlRPQ0xPQ08gSW5jIC0gcHVibGljIGRlbW9zIiwiZSI6IjIwMzAtMDEtMDEiLCJkIjpbInRvY2xvY29pbmMuZ2l0aHViLmlvIl19.9De42ua3aCGpiMB6EVRP7Tv-upUlDI-0T07rlSPzvCrsqg8t4YJi7SRnStEpAg48uzmcG7il1fR_TfwkUE7iCA';

const loadScript = (src, attrs = {}) => new Promise((resolve, reject) => {
  const s = document.createElement('script');
  s.src = src;
  for (const [k, v] of Object.entries(attrs)) s.setAttribute(k, v);
  s.onload = resolve;
  s.onerror = () => reject(new Error('could not load ' + src));
  document.head.append(s);
});

installMockServer(routes);
// A server would answer this URL with the page for its query. Render that fragment now, before the
// Lattice scripts and htmx load, so the right project is hydrated once and its button is pressed.
const wanted = projectFor(new URLSearchParams(location.search).get('project'));
if (wanted !== projectFor(null)) document.getElementById('gantt-view').innerHTML = ganttFragment(wanted);
// The server-rendered picker carries the full page path in hx-push-url so Back works under any base path.
for (const b of document.querySelectorAll('[hx-push-url]')) {
  b.setAttribute('hx-push-url', location.pathname + b.getAttribute('hx-push-url').slice(b.getAttribute('hx-push-url').indexOf('?')));
}
await loadScript(GRID + '/modules/gantt.min.js');
const lattice = await import('@toclocoinc/lattice-grid/modules/htmx');
lattice.setLicence(LICENCE);
// htmx 2.0.4 starts on DOMContentLoaded unless the document is already complete, so a script added in
// between never starts. Add it only once the window has loaded.
if (document.readyState !== 'complete') await new Promise((r) => { window.addEventListener('load', r, { once: true }); });
await loadScript(HTMX, { integrity: HTMX_SRI, crossorigin: 'anonymous' });

// The request log: one line per request the stand-in server answered.
const log = document.getElementById('request-log');
document.body.addEventListener('htmx:afterRequest', (e) => {
  const { requestConfig: c, xhr } = e.detail;
  if (log.firstElementChild?.textContent === 'none yet') log.replaceChildren();
  const li = document.createElement('li');
  li.textContent = c.verb.toUpperCase() + ' ' + c.path + ' → ' + xhr.status;
  log.prepend(li);
  while (log.children.length > 6) log.lastElementChild.remove();
});

