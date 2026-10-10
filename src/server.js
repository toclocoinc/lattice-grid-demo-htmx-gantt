/**
 * The "server": two project plans, the HTML template and the route handlers.
 * The page prints the part between the SERVER TEMPLATE markers beside the demo.
 */
const plans = {
  platform: [
    { id: 'P1', name: 'Discovery', parent: '', start: '2026-04-06', end: '2026-06-26', percentComplete: 0, milestone: false },
    { id: 'P1.1', name: 'Stakeholder interviews', parent: 'P1', start: '2026-04-06', end: '2026-04-24', percentComplete: 100, milestone: false },
    { id: 'P1.2', name: 'Current system audit', parent: 'P1', start: '2026-04-20', end: '2026-05-22', percentComplete: 100, milestone: false },
    { id: 'P1.3', name: 'Requirements and roadmap', parent: 'P1', start: '2026-05-25', end: '2026-06-19', percentComplete: 100, milestone: false },
    { id: 'M1', name: 'Business case approved', parent: 'P1', start: '2026-06-26', end: '2026-06-26', percentComplete: 100, milestone: true },
    { id: 'P2', name: 'Architecture', parent: '', start: '2026-06-29', end: '2026-10-30', percentComplete: 0, milestone: false },
    { id: 'P2.1', name: 'Target architecture', parent: 'P2', start: '2026-06-29', end: '2026-08-07', percentComplete: 100, milestone: false },
    { id: 'P2.2', name: 'Data model and APIs', parent: 'P2', start: '2026-08-03', end: '2026-09-25', percentComplete: 90, milestone: false },
    { id: 'P2.3', name: 'Security review', parent: 'P2', start: '2026-09-21', end: '2026-10-23', percentComplete: 40, milestone: false },
    { id: 'M2', name: 'Architecture sign-off', parent: 'P2', start: '2026-10-30', end: '2026-10-30', percentComplete: 0, milestone: true },
    { id: 'P3', name: 'Build', parent: '', start: '2026-11-02', end: '2027-09-24', percentComplete: 0, milestone: false },
    { id: 'P3.1', name: 'Core services', parent: 'P3', start: '2026-11-02', end: '2027-03-26', percentComplete: 5, milestone: false },
    { id: 'P3.2', name: 'Customer portal', parent: 'P3', start: '2027-01-11', end: '2027-06-25', percentComplete: 0, milestone: false },
    { id: 'P3.3', name: 'Reporting and analytics', parent: 'P3', start: '2027-03-29', end: '2027-07-30', percentComplete: 0, milestone: false },
    { id: 'P3.4', name: 'Integrations', parent: 'P3', start: '2027-05-03', end: '2027-09-10', percentComplete: 0, milestone: false },
    { id: 'M3', name: 'Feature complete', parent: 'P3', start: '2027-09-24', end: '2027-09-24', percentComplete: 0, milestone: true },
    { id: 'P4', name: 'Test and pilot', parent: '', start: '2027-09-27', end: '2028-01-28', percentComplete: 0, milestone: false },
    { id: 'P4.1', name: 'System and load testing', parent: 'P4', start: '2027-09-27', end: '2027-11-19', percentComplete: 0, milestone: false },
    { id: 'P4.2', name: 'Pilot with two customers', parent: 'P4', start: '2027-11-22', end: '2028-01-21', percentComplete: 0, milestone: false },
    { id: 'M4', name: 'Go / no-go', parent: 'P4', start: '2028-01-28', end: '2028-01-28', percentComplete: 0, milestone: true },
    { id: 'P5', name: 'Rollout', parent: '', start: '2028-01-31', end: '2028-03-31', percentComplete: 0, milestone: false },
    { id: 'P5.1', name: 'Migrate customers in waves', parent: 'P5', start: '2028-01-31', end: '2028-03-17', percentComplete: 0, milestone: false },
    { id: 'P5.2', name: 'Retire the old platform', parent: 'P5', start: '2028-03-06', end: '2028-03-31', percentComplete: 0, milestone: false },
    { id: 'M5', name: 'Programme complete', parent: 'P5', start: '2028-03-31', end: '2028-03-31', percentComplete: 0, milestone: true },
  ],
  migration: [
    { id: 'D1', name: 'Assessment', parent: '', start: '2026-05-04', end: '2026-07-31', percentComplete: 0, milestone: false },
    { id: 'D1.1', name: 'Inventory servers and apps', parent: 'D1', start: '2026-05-04', end: '2026-06-12', percentComplete: 100, milestone: false },
    { id: 'D1.2', name: 'Dependency mapping', parent: 'D1', start: '2026-06-08', end: '2026-07-24', percentComplete: 100, milestone: false },
    { id: 'MD1', name: 'Migration plan approved', parent: 'D1', start: '2026-07-31', end: '2026-07-31', percentComplete: 100, milestone: true },
    { id: 'D2', name: 'Landing zone', parent: '', start: '2026-08-03', end: '2026-11-27', percentComplete: 0, milestone: false },
    { id: 'D2.1', name: 'Network and identity', parent: 'D2', start: '2026-08-03', end: '2026-09-25', percentComplete: 100, milestone: false },
    { id: 'D2.2', name: 'Security baseline', parent: 'D2', start: '2026-09-14', end: '2026-11-06', percentComplete: 35, milestone: false },
    { id: 'D2.3', name: 'Monitoring and backup', parent: 'D2', start: '2026-10-19', end: '2026-11-27', percentComplete: 0, milestone: false },
    { id: 'MD2', name: 'Landing zone ready', parent: 'D2', start: '2026-11-27', end: '2026-11-27', percentComplete: 0, milestone: true },
    { id: 'D3', name: 'Migration waves', parent: '', start: '2026-11-30', end: '2027-08-27', percentComplete: 0, milestone: false },
    { id: 'D3.1', name: 'Wave 1: internal tools', parent: 'D3', start: '2026-11-30', end: '2027-01-29', percentComplete: 0, milestone: false },
    { id: 'D3.2', name: 'Wave 2: data warehouse', parent: 'D3', start: '2027-02-01', end: '2027-04-30', percentComplete: 0, milestone: false },
    { id: 'D3.3', name: 'Wave 3: customer systems', parent: 'D3', start: '2027-05-03', end: '2027-08-20', percentComplete: 0, milestone: false },
    { id: 'MD3', name: 'All workloads moved', parent: 'D3', start: '2027-08-27', end: '2027-08-27', percentComplete: 0, milestone: true },
    { id: 'D4', name: 'Close-down', parent: '', start: '2027-08-30', end: '2027-12-17', percentComplete: 0, milestone: false },
    { id: 'D4.1', name: 'Decommission hardware', parent: 'D4', start: '2027-08-30', end: '2027-11-12', percentComplete: 0, milestone: false },
    { id: 'D4.2', name: 'Exit the data centre lease', parent: 'D4', start: '2027-11-15', end: '2027-12-10', percentComplete: 0, milestone: false },
    { id: 'MD4', name: 'Data centre closed', parent: 'D4', start: '2027-12-17', end: '2027-12-17', percentComplete: 0, milestone: true },
  ],
};

// Finish-to-start links between tasks, sent with each plan.
const links = {
  platform: [{ from: 'P1.1', to: 'P1.3' }, { from: 'P1.2', to: 'P1.3' }, { from: 'P1.3', to: 'M1' }, { from: 'M1', to: 'P2.1' }, { from: 'P2.1', to: 'P2.2' }, { from: 'P2.2', to: 'P2.3' }, { from: 'P2.3', to: 'M2' }, { from: 'M2', to: 'P3.1' }, { from: 'P3.1', to: 'P3.3' }, { from: 'P3.2', to: 'M3' }, { from: 'P3.3', to: 'M3' }, { from: 'P3.4', to: 'M3' }, { from: 'M3', to: 'P4.1' }, { from: 'P4.1', to: 'P4.2' }, { from: 'P4.2', to: 'M4' }, { from: 'M4', to: 'P5.1' }, { from: 'P5.1', to: 'M5' }, { from: 'P5.2', to: 'M5' }],
  migration: [{ from: 'D1.1', to: 'D1.2' }, { from: 'D1.2', to: 'MD1' }, { from: 'MD1', to: 'D2.1' }, { from: 'D2.1', to: 'D2.2' }, { from: 'D2.2', to: 'D2.3' }, { from: 'D2.3', to: 'MD2' }, { from: 'MD2', to: 'D3.1' }, { from: 'D3.1', to: 'D3.2' }, { from: 'D3.2', to: 'D3.3' }, { from: 'D3.3', to: 'MD3' }, { from: 'MD3', to: 'D4.1' }, { from: 'D4.1', to: 'D4.2' }, { from: 'D4.2', to: 'MD4' }],
};

// SERVER TEMPLATE START
// Element ids for the out-of-band anchors: htmx targets them by #id, so no dots.
const anchorId = (id) => `task-${String(id).replace(/\./g, '-')}`;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
const names = { platform: 'Platform rebuild', migration: 'Data centre migration' };

const taskRow = (t, attrs = '') =>
  `<tr ${attrs}><td>${t.id}</td><td>${esc(t.name)}</td><td>${t.parent}</td><td>${t.start}</td><td>${t.end}</td><td>${t.percentComplete}</td><td>${t.milestone}</td></tr>`;

/** The Gantt's options: the plan's links and the split view's columns and zoom. */
const config = (project) => ({
  projectStart: plans[project][0].start,
  dependencies: links[project],
  split: {
    editable: true, dateAxis: true, zoom: 'month', zoomControl: { levels: ['week', 'month', 'quarter', 'fit'] }, gridWidth: 540,
    columns: ['wbs', 'name', 'start', 'end', 'progress'], arrows: true, criticalPath: true,
  },
});

/** Project picker, plus the Gantt over the plan's task table. */
export function ganttFragment(project = 'platform', page = (typeof location !== 'undefined' ? location.pathname : '/lattice-grid-demo-htmx-gantt/')) {
  const pick = Object.keys(plans)
    .map((p) => `<button hx-get="/htmx-demo/gantt/plan?project=${p}" hx-target="#gantt-view"
      hx-push-url="${page}?project=${p}" aria-pressed="${p === project}">${names[p]}</button>`)
    .join('\n  ');
  const list = plans[project];
  // The anchors sit inside the Gantt element: an out-of-band row lands on one.
  const anchors = list.map((t) => `<i id="${anchorId(t.id)}" data-lattice-row="${t.id}"></i>`).join('');
  const action = `<button class="action" hx-post="/htmx-demo/gantt/slip" hx-vals='{"project": "${project}"}' hx-swap="none">Server slips one task</button>`;
  return `<div class="view"><div class="filters">${pick}${action}</div>
<div data-lattice-gantt style="height:calc(100vh - 260px); min-height:480px" hx-post="/htmx-demo/gantt/save" hx-trigger="lattice:gantt-commit"
  hx-vals='js:{changes: JSON.stringify(event.detail.changes), primary: event.detail.primary.id}'
  hx-target="#save-log" hx-swap="afterbegin">
  <table><thead><tr><th data-field="id">ID</th><th data-field="name">Task</th><th data-field="parent">Phase</th>
    <th data-field="start">Start</th><th data-field="end">End</th><th data-field="percentComplete">Done %</th><th data-field="milestone">Milestone</th></tr></thead>
  <tbody>
  ${list.map((t) => taskRow(t)).join('\n  ')}
  </tbody></table>${anchors}
</div>
<script type="application/json" data-lattice-config>${JSON.stringify(config(project))}</script></div>`;
}

export const routes = {
  // hx-get: another project's plan; the old Gantt is torn down and a new one built.
  'GET /htmx-demo/gantt/plan': ({ params }) => ganttFragment(params.project in plans ? params.project : 'platform'),

  // hx-post from lattice:gantt-change: record the change and confirm it.
  'POST /htmx-demo/gantt/save': ({ params }) => {
    const all = Object.values(plans).flat();
    const saved = [];
    for (const c of JSON.parse(params.changes || '[]')) {
      const task = all.find((t) => t.id === c.id);
      if (!task) continue;
      for (const [field, v] of Object.entries(c.changes || {})) if (field === 'start' || field === 'end') task[field] = v?.to ?? v;
      if (task.parent) saved.push(task);
    }
    const lead = saved.find((t) => t.id === params.primary) || saved[0];
    if (!lead) return { html: '', status: 204 };
    const more = saved.length > 1 ? ` (and ${saved.length - 1} linked task${saved.length > 2 ? 's' : ''})` : '';
    return `<li>Saved <strong>${esc(lead.name)}</strong>: ${esc(lead.start)} to ${esc(lead.end)}${more}</li>`;
  },

  // hx-post with hx-swap="none": one task comes back out of band and its bar moves.
  'POST /htmx-demo/gantt/slip': ({ params }) => {
    const list = plans[params.project in plans ? params.project : 'platform'];
    const open = list.filter((t) => t.parent && !t.milestone && t.percentComplete < 100);
    const task = open[Math.floor(Math.random() * open.length)];
    const day = (iso) => new Date(Date.parse(iso) + 7 * 864e5).toISOString().slice(0, 10);
    task.start = day(task.start);
    task.end = day(task.end);
    return taskRow(task, `id="${anchorId(task.id)}" data-lattice-row="${task.id}" hx-swap-oob="true"`);
  },
};
// SERVER TEMPLATE END

