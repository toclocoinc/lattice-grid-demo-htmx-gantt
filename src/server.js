/**
 * The "server": two project plans, the HTML template and the route handlers.
 * The page prints the part between the SERVER TEMPLATE markers beside the demo.
 */
const plans = {
  launch: [
    { id: 'L1', name: 'Scope the launch', start: '2026-10-05', end: '2026-10-08', percentComplete: 100 },
    { id: 'L2', name: 'Build the landing page', start: '2026-10-09', end: '2026-10-16', percentComplete: 60 },
    { id: 'L3', name: 'Write the announcement', start: '2026-10-12', end: '2026-10-15', percentComplete: 30 },
    { id: 'L4', name: 'Review with legal', start: '2026-10-19', end: '2026-10-21', percentComplete: 0 },
    { id: 'L5', name: 'Go live', start: '2026-10-22', end: '2026-10-23', percentComplete: 0 },
  ],
  migration: [
    { id: 'M1', name: 'Audit the old system', start: '2026-10-05', end: '2026-10-09', percentComplete: 100 },
    { id: 'M2', name: 'Map the data', start: '2026-10-12', end: '2026-10-16', percentComplete: 40 },
    { id: 'M3', name: 'Dry-run the import', start: '2026-10-19', end: '2026-10-23', percentComplete: 0 },
    { id: 'M4', name: 'Cut over', start: '2026-10-26', end: '2026-10-28', percentComplete: 0 },
  ],
};

// SERVER TEMPLATE START
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
const names = { launch: 'Product launch', migration: 'Data migration' };

const taskRow = (t, attrs = '') =>
  `<tr ${attrs}><td>${t.id}</td><td>${esc(t.name)}</td><td>${t.start}</td><td>${t.end}</td><td>${t.percentComplete}</td></tr>`;

/** Project picker, plus the Gantt over the plan's task table. */
export function ganttFragment(project = 'launch') {
  const pick = Object.keys(plans)
    .map((p) => `<button hx-get="/htmx-demo/gantt/plan?project=${p}" hx-target="#gantt-view"
      hx-push-url="?project=${p}" aria-pressed="${p === project}">${names[p]}</button>`)
    .join('\n  ');
  const list = plans[project];
  // The anchors sit inside the Gantt element: an out-of-band row lands on one.
  const anchors = list.map((t) => `<i id="task-${t.id}" data-lattice-row="${t.id}"></i>`).join('');
  const action = `<button class="action" hx-post="/htmx-demo/gantt/slip" hx-vals='{"project": "${project}"}' hx-swap="none">Server slips one task</button>`;
  return `<div class="view"><div class="filters">${pick}${action}</div>
<div data-lattice-gantt hx-post="/htmx-demo/gantt/save" hx-trigger="lattice:gantt-change"
  hx-vals='js:{id: event.detail.id, kind: event.detail.kind, changes: JSON.stringify(event.detail.changes)}'
  hx-target="#save-status" hx-swap="innerHTML" style="height:460px">
  <table><thead><tr><th data-field="id">ID</th><th data-field="name">Task</th><th data-field="start">Start</th>
    <th data-field="end">End</th><th data-field="percentComplete">Done %</th></tr></thead>
  <tbody>
  ${list.map((t) => taskRow(t)).join('\n  ')}
  </tbody></table>${anchors}
</div>
<script type="application/json" data-lattice-config>{"projectStart":"2026-10-05","split":{"editable":true,"dateAxis":true,"zoom":"week","zoomControl":true,"gridWidth":400}}</script></div>`;
}

export const routes = {
  // hx-get: another project's plan; the old Gantt is torn down and a new one built.
  'GET /htmx-demo/gantt/plan': ({ params }) => ganttFragment(params.project in plans ? params.project : 'launch'),

  // hx-post from lattice:gantt-change: record the change and confirm it.
  'POST /htmx-demo/gantt/save': ({ params }) => {
    const task = Object.values(plans).flat().find((t) => t.id === params.id);
    if (!task) return { html: 'Unknown task', status: 404 };
    const changes = JSON.parse(params.changes);
    for (const [field, v] of Object.entries(changes)) task[field] = v?.to ?? v;
    return `Server saved ${esc(task.name)} (${esc(params.kind)}): ${esc(task.start)} to ${esc(task.end)}`;
  },

  // hx-post with hx-swap="none": one task comes back out of band and its bar moves.
  'POST /htmx-demo/gantt/slip': ({ params }) => {
    const list = plans[params.project in plans ? params.project : 'launch'];
    const task = list[1 + Math.floor(Math.random() * (list.length - 1))];
    const day = (iso) => new Date(Date.parse(iso) + 864e5).toISOString().slice(0, 10);
    task.start = day(task.start);
    task.end = day(task.end);
    return taskRow(task, `id="task-${task.id}" data-lattice-row="${task.id}" hx-swap-oob="true"`);
  },
};
// SERVER TEMPLATE END

