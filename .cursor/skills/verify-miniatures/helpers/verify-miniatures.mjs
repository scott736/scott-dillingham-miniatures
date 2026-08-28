#!/usr/bin/env node
import { execSync, spawn } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  openSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { createServer } from 'node:net';
import { dirname, isAbsolute, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as sleep } from 'node:timers/promises';

const helperDir = dirname(fileURLToPath(import.meta.url));
const skillDir = join(helperDir, '..');
const repoRoot = join(skillDir, '../../..');
const artifactsDir = join(skillDir, 'artifacts');
const stateDir = process.env.VERIFY_STATE_DIR || '/tmp/verify-miniatures';
const statePath = join(stateDir, 'state.json');
const BRAND = 'Scott Dillingham Miniatures';
const HOME_H1 = 'Miniature Furniture';
const DEFAULT_PORT = Number(process.env.VERIFY_PORT || 4321);
const DEFAULT_CDP = Number(process.env.VERIFY_CDP_PORT || 9333);
const CHROME =
  process.env.CHROME_PATH ||
  (existsSync('/usr/local/bin/google-chrome')
    ? '/usr/local/bin/google-chrome'
    : 'google-chrome');

function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (!next || next.startsWith('--')) out[key] = true;
      else {
        out[key] = next;
        i++;
      }
    } else out._.push(a);
  }
  return out;
}

function print(obj) {
  process.stdout.write(`${JSON.stringify(obj, null, 2)}\n`);
}

function printSnap(snap, opts = {}) {
  if (opts.full) {
    print({ ok: true, ...snap });
    return;
  }
  print({
    ok: true,
    title: snap.title,
    url: snap.url,
    dark: snap.dark,
    h1: (snap.headings || []).filter((h) => h.tag === 'H1').map((h) => h.text),
  });
}

function fail(message, extra = {}) {
  print({ ok: false, error: message, ...extra });
  process.exitCode = 1;
  throw new Error(message);
}

function readState() {
  if (!existsSync(statePath)) return null;
  try {
    return JSON.parse(readFileSync(statePath, 'utf8'));
  } catch {
    return null;
  }
}

function writeState(state) {
  mkdirSync(stateDir, { recursive: true });
  writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`);
}

function pidAlive(pid) {
  if (!pid) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function cmdlineOf(pid) {
  try {
    return readFileSync(`/proc/${pid}/cmdline`, 'utf8').replace(/\0/g, ' ').trim();
  } catch {
    return '';
  }
}

function portFree(port) {
  return new Promise((resolve) => {
    const server = createServer();
    server.once('error', () => resolve(false));
    server.listen(port, '127.0.0.1', () => {
      server.close(() => resolve(true));
    });
  });
}

async function pickPort(start) {
  for (let port = start; port < start + 40; port++) {
    if (await portFree(port)) return port;
  }
  fail(`no free port from ${start}`);
}

function currentRev() {
  try {
    return execSync('git rev-parse --short HEAD', {
      cwd: repoRoot,
      encoding: 'utf8',
    }).trim();
  } catch {
    return null;
  }
}

function killPid(pid) {
  if (!pidAlive(pid)) return;
  try {
    process.kill(-pid, 'SIGTERM');
  } catch {
    try {
      process.kill(pid, 'SIGTERM');
    } catch {
    }
  }
}

async function waitForHttp(url, { timeoutMs = 60000, contains = BRAND } = {}) {
  const start = Date.now();
  let last = '';
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url, { redirect: 'follow' });
      const html = await res.text();
      last = `HTTP ${res.status} len=${html.length}`;
      if (res.status === 200 && (!contains || html.includes(contains))) {
        return { status: res.status, html };
      }
    } catch (err) {
      last = String(err.message || err);
    }
    await sleep(400);
  }
  fail(`timeout waiting for ${url}`, { last });
}

function artifactPath(rel) {
  const path = rel && isAbsolute(rel) ? rel : join(artifactsDir, rel || '');
  mkdirSync(dirname(path), { recursive: true });
  return path;
}

function baseUrl(state) {
  if (!state?.url) fail('no launch state; run launch first');
  return state.url.replace(/\/$/, '');
}

async function httpGet(path, opts = {}) {
  const state = readState();
  const url = `${baseUrl(state)}${path.startsWith('/') ? path : `/${path}`}`;
  const res = await fetch(url, {
    redirect: 'follow',
    headers: { 'user-agent': 'verify-miniatures/1.0' },
  });
  const body = await res.text();
  const wantStatus = opts['assert-status'] != null ? Number(opts['assert-status']) : null;
  const wantContains = opts['assert-contains'];
  const result = { ok: true, url, status: res.status, bytes: body.length };
  if (wantStatus != null && res.status !== wantStatus) {
    fail(`expected HTTP ${wantStatus}, got ${res.status}`, { url });
  }
  if (wantContains && !body.includes(wantContains)) {
    fail(`response missing ${JSON.stringify(wantContains)}`, { url, status: res.status });
  }
  if (opts.out) writeFileSync(artifactPath(opts.out), body);
  return { ...result, body: opts.body ? body : undefined };
}

async function httpPost(path, opts = {}) {
  const state = readState();
  const url = `${baseUrl(state)}${path.startsWith('/') ? path : `/${path}`}`;
  const json = opts.json != null ? opts.json : '{}';
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'user-agent': 'verify-miniatures/1.0',
    },
    body: json,
  });
  const body = await res.text();
  const wantStatus = opts['assert-status'] != null ? Number(opts['assert-status']) : null;
  const wantContains = opts['assert-contains'];
  if (wantStatus != null && res.status !== wantStatus) {
    fail(`expected HTTP ${wantStatus}, got ${res.status}`, { url, body });
  }
  if (wantContains && !body.includes(wantContains)) {
    fail(`response missing ${JSON.stringify(wantContains)}`, { url, status: res.status, body });
  }
  if (opts.out) writeFileSync(artifactPath(opts.out), body);
  return { ok: true, url, status: res.status, body };
}

async function cmdLaunch(opts) {
  mkdirSync(stateDir, { recursive: true });
  const existing = readState();
  if (existing && pidAlive(existing.pid)) {
    const doctor = await collectDoctor(existing);
    if (doctor.ok) {
      print({ ok: true, reused: true, ...doctor });
      return;
    }
    killPid(existing.pid);
  }

  const port = opts.port ? Number(opts.port) : await pickPort(DEFAULT_PORT);
  const url = `http://127.0.0.1:${port}`;
  const logPath = join(stateDir, 'astro.log');
  const logFd = openSync(logPath, 'w');
  const child = spawn(
    'npm',
    ['run', 'dev', '--', '--host', '127.0.0.1', '--port', String(port)],
    {
      cwd: repoRoot,
      env: {
        ...process.env,
        ASTRO_TELEMETRY_DISABLED: '1',
        BROWSER: 'none',
      },
      detached: true,
      stdio: ['ignore', logFd, logFd],
    },
  );
  child.unref();
  const state = {
    pid: child.pid,
    port,
    url,
    logPath,
    rev: currentRev(),
    startedAt: new Date().toISOString(),
  };
  writeState(state);
  await waitForHttp(`${url}/`);
  print({ ok: true, reused: false, ...state });
}

async function collectDoctor(state) {
  const pid = state?.pid;
  const alive = pidAlive(pid);
  const cmd = alive ? cmdlineOf(pid) : '';
  const owned =
    alive &&
    (cmd.includes('astro') ||
      cmd.includes(`--port ${state.port}`) ||
      cmd.includes(String(state.port)));
  let status = 0;
  let brand = false;
  let homeH1 = false;
  try {
    const res = await fetch(`${baseUrl(state)}/`, {
      headers: { 'user-agent': 'verify-miniatures/1.0' },
    });
    const html = await res.text();
    status = res.status;
    brand = html.includes(BRAND);
    homeH1 = html.includes(HOME_H1);
  } catch {
    status = 0;
  }
  const revNow = currentRev();
  const ok = Boolean(alive && owned && status === 200 && brand && homeH1);
  return {
    ok,
    url: state?.url || null,
    pid,
    port: state?.port || null,
    alive,
    ownedPort: owned,
    cmdline: cmd,
    status,
    brand,
    homeH1,
    rev: state?.rev || null,
    revNow,
    revMatch: Boolean(state?.rev && state.rev === revNow),
    resendKeyPresent: Boolean(process.env.RESEND_API_KEY),
    chromePid: state?.chromePid || null,
    cdpPort: state?.cdpPort || null,
  };
}

async function cmdDoctor() {
  const state = readState();
  if (!state) fail('no launch state; run launch first');
  const doctor = await collectDoctor(state);
  print(doctor);
  if (!doctor.ok) process.exitCode = 1;
}

async function cmdCleanup() {
  const state = readState();
  if (state?.chromePid) killPid(state.chromePid);
  if (state?.pid) killPid(state.pid);
  await sleep(300);
  if (state?.chromePid && pidAlive(state.chromePid)) {
    try {
      process.kill(state.chromePid, 'SIGKILL');
    } catch {
    }
  }
  if (state?.pid && pidAlive(state.pid)) {
    try {
      process.kill(state.pid, 'SIGKILL');
    } catch {
    }
  }
  const leftover = {
    astroAlive: state?.pid ? pidAlive(state.pid) : false,
    chromeAlive: state?.chromePid ? pidAlive(state.chromePid) : false,
  };
  if (existsSync(statePath)) rmSync(statePath);
  print({
    ok: !leftover.astroAlive && !leftover.chromeAlive,
    killed: { pid: state?.pid || null, chromePid: state?.chromePid || null },
    artifactsDir,
    artifactsKept: existsSync(artifactsDir),
    ...leftover,
  });
}

class Cdp {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.id = 0;
    this.pending = new Map();
  }

  async connect() {
    this.ws = new WebSocket(this.wsUrl);
    await new Promise((resolve, reject) => {
      this.ws.addEventListener('open', resolve, { once: true });
      this.ws.addEventListener('error', reject, { once: true });
    });
    this.ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(String(ev.data));
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message || JSON.stringify(msg.error)));
        else resolve(msg.result);
      }
    });
  }

  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`CDP timeout ${method}`));
      }, 20000);
      this.pending.set(id, {
        resolve: (value) => {
          clearTimeout(timer);
          resolve(value);
        },
        reject: (err) => {
          clearTimeout(timer);
          reject(err);
        },
      });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    try {
      this.ws.close();
    } catch {
    }
  }
}

async function jsonGet(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} HTTP ${res.status}`);
  return res.json();
}

async function waitForCdp(cdpPort, timeoutMs = 20000) {
  const start = Date.now();
  let last = '';
  while (Date.now() - start < timeoutMs) {
    try {
      const version = await jsonGet(`http://127.0.0.1:${cdpPort}/json/version`);
      if (version.webSocketDebuggerUrl) return version;
    } catch (err) {
      last = String(err.message || err);
    }
    await sleep(200);
  }
  fail(`chrome CDP not ready on ${cdpPort}`, { last });
}

async function pageWsUrl(cdpPort, appOrigin) {
  const start = Date.now();
  let created = false;
  while (Date.now() - start < 10000) {
    const list = await jsonGet(`http://127.0.0.1:${cdpPort}/json/list`);
    const pages = list.filter((t) => t.type === 'page' && t.webSocketDebuggerUrl);
    const appPage = appOrigin
      ? pages.find((t) => typeof t.url === 'string' && t.url.startsWith(appOrigin))
      : null;
    const page = appPage || pages[0];
    if (page) return page.webSocketDebuggerUrl;
    if (!created) {
      created = true;
      try {
        await fetch(`http://127.0.0.1:${cdpPort}/json/new?about:blank`);
      } catch {
      }
    }
    await sleep(200);
  }
  fail('chrome has no page target');
}

async function connectPage(state) {
  if (!state?.cdpPort) fail('browser is not started; run browser start');
  const origin = state.url ? String(state.url).replace(/\/$/, '') : '';
  const wsUrl = await pageWsUrl(state.cdpPort, origin);
  const cdp = new Cdp(wsUrl);
  await cdp.connect();
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  return cdp;
}

async function cmdBrowserStart(opts) {
  const state = readState();
  if (!state) fail('no launch state; run launch first');
  if (state.chromePid && pidAlive(state.chromePid)) {
    print({ ok: true, reused: true, chromePid: state.chromePid, cdpPort: state.cdpPort });
    return;
  }
  const width = Number(opts.width || 1280);
  const height = Number(opts.height || 800);
  const cdpPort = await pickPort(DEFAULT_CDP);
  const profile = join(stateDir, `chrome-profile-${cdpPort}`);
  mkdirSync(profile, { recursive: true });
  const logPath = join(stateDir, 'chrome.log');
  const logFd = openSync(logPath, 'w');
  const child = spawn(
    CHROME,
    [
      `--remote-debugging-port=${cdpPort}`,
      `--user-data-dir=${profile}`,
      `--window-size=${width},${height}`,
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--no-first-run',
      '--no-default-browser-check',
      'about:blank',
    ],
    {
      detached: true,
      stdio: ['ignore', logFd, logFd],
    },
  );
  child.unref();
  state.chromePid = child.pid;
  state.cdpPort = cdpPort;
  state.viewport = { width, height };
  writeState(state);
  await waitForCdp(cdpPort);
  const cdp = await connectPage(state);
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width < 768,
  });
  cdp.close();
  print({ ok: true, reused: false, chromePid: child.pid, cdpPort, width, height });
}

async function evaluate(cdp, expression) {
  const result = await cdp.send('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (result.exceptionDetails) {
    const text =
      result.exceptionDetails.text ||
      result.exceptionDetails.exception?.description ||
      'evaluate failed';
    fail(text);
  }
  return result.result?.value;
}

const SNAPSHOT_JS = `(() => {
  const text = (el) => (el.innerText || el.textContent || '').replace(/\\s+/g, ' ').trim();
  const headings = [...document.querySelectorAll('h1,h2,h3')].map((el) => ({
    tag: el.tagName,
    text: text(el),
  }));
  const links = [...document.querySelectorAll('a')]
    .map((a) => ({ name: text(a) || a.getAttribute('aria-label') || '', href: a.getAttribute('href') }))
    .filter((a) => a.name)
    .slice(0, 60);
  const buttons = [...document.querySelectorAll('button')].map((b) => ({
    name: text(b) || b.getAttribute('aria-label') || '',
  }));
  const fields = [...document.querySelectorAll('input,textarea,select')].map((el) => ({
    tag: el.tagName.toLowerCase(),
    id: el.id,
    name: el.name,
    type: el.type || '',
    placeholder: el.placeholder || '',
  }));
  return {
    title: document.title,
    url: location.href,
    dark: document.documentElement.classList.contains('dark'),
    headings,
    links,
    buttons,
    fields,
  };
})()`;

const FIND_JS = `(role, name, selector) => {
  const want = (name || '').replace(/\\s+/g, ' ').trim().toLowerCase();
  const textOf = (el) =>
    (el.getAttribute('aria-label') || el.innerText || el.textContent || '')
      .replace(/\\s+/g, ' ')
      .trim()
      .toLowerCase();
  if (selector) return document.querySelector(selector);
  if (role === 'textbox' || role === 'searchbox') {
    const labels = [...document.querySelectorAll('label')];
    const label = labels.find((l) => textOf(l) === want || textOf(l).includes(want));
    if (label && label.htmlFor) return document.getElementById(label.htmlFor);
    return [...document.querySelectorAll('input,textarea')].find((el) => {
      const hay = [el.placeholder, el.getAttribute('aria-label'), el.name, el.id]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return hay.includes(want);
    });
  }
  const map = { link: 'a', button: 'button', combobox: 'select' };
  const nodes = [...document.querySelectorAll(map[role] || 'a,button')];
  return nodes.find((el) => {
    const n = textOf(el);
    return n === want || n.includes(want);
  });
}`;

async function cmdBrowserGoto(path, opts = {}) {
  const state = readState();
  const url = path.startsWith('http') ? path : `${baseUrl(state)}${path.startsWith('/') ? path : `/${path}`}`;
  const cdp = await connectPage(state);
  await cdp.send('Page.navigate', { url });
  const timeout = Number(opts.timeout || 15000);
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const href = await evaluate(cdp, 'location.href');
    const ready = await evaluate(cdp, 'document.readyState');
    if (href.startsWith(url.split('#')[0]) && ready === 'complete') break;
    await sleep(200);
  }
  const snap = await evaluate(cdp, SNAPSHOT_JS);
  cdp.close();
  printSnap(snap, opts);
}

async function cmdBrowserClick(opts) {
  const state = readState();
  const cdp = await connectPage(state);
  const role = opts.role || '';
  const name = opts.name || '';
  const selector = opts.selector || '';
  const found = await evaluate(
    cdp,
    `(${FIND_JS})(${JSON.stringify(role)}, ${JSON.stringify(name)}, ${JSON.stringify(selector)}) ? true : false`,
  );
  if (!found) {
    cdp.close();
    fail(`no match role=${role} name=${JSON.stringify(name)} selector=${JSON.stringify(selector)}`);
  }
  await evaluate(
    cdp,
    `(() => { const el = (${FIND_JS})(${JSON.stringify(role)}, ${JSON.stringify(name)}, ${JSON.stringify(selector)}); el.click(); return true; })()`,
  );
  if (opts.wait) {
    const timeout = Number(opts.timeout || 15000);
    const start = Date.now();
    let hit = false;
    while (Date.now() - start < timeout) {
      const html = await evaluate(cdp, 'document.body && document.body.innerText || ""');
      if (html.includes(opts.wait)) {
        hit = true;
        break;
      }
      await sleep(200);
    }
    if (!hit) {
      cdp.close();
      fail(`after click, page never showed ${JSON.stringify(opts.wait)}`);
    }
  }
  const snap = await evaluate(cdp, SNAPSHOT_JS);
  cdp.close();
  if (opts.full) print({ ok: true, clicked: { role, name, selector }, ...snap });
  else print({ ok: true, clicked: { role, name, selector }, title: snap.title, url: snap.url, h1: (snap.headings || []).filter((h) => h.tag === 'H1').map((h) => h.text) });
}

async function cmdBrowserFill(opts) {
  const state = readState();
  const cdp = await connectPage(state);
  const role = opts.role || 'textbox';
  const name = opts.name || '';
  const selector = opts.selector || '';
  const value = opts.value ?? '';
  const ok = await evaluate(
    cdp,
    `(() => {
      const el = (${FIND_JS})(${JSON.stringify(role)}, ${JSON.stringify(name)}, ${JSON.stringify(selector)});
      if (!el) return false;
      el.focus();
      const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      const desc = Object.getOwnPropertyDescriptor(proto, 'value');
      if (desc && desc.set) desc.set.call(el, ${JSON.stringify(value)});
      else el.value = ${JSON.stringify(value)};
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    })()`,
  );
  cdp.close();
  if (!ok) fail(`no field role=${role} name=${JSON.stringify(name)} selector=${JSON.stringify(selector)}`);
  print({ ok: true, filled: { role, name, selector, value } });
}

async function cmdBrowserSnapshot(opts) {
  const state = readState();
  const cdp = await connectPage(state);
  const snap = await evaluate(cdp, SNAPSHOT_JS);
  cdp.close();
  if (opts.path) writeFileSync(artifactPath(opts.path), `${JSON.stringify(snap, null, 2)}\n`);
  print({ ok: true, path: opts.path || null, ...snap });
}

async function cmdBrowserScreenshot(opts) {
  const state = readState();
  if (!opts.path) fail('browser screenshot requires --path');
  const cdp = await connectPage(state);
  const result = await cdp.send('Page.captureScreenshot', { format: 'png' });
  cdp.close();
  const out = artifactPath(opts.path);
  writeFileSync(out, Buffer.from(result.data, 'base64'));
  print({ ok: true, path: out, bytes: Buffer.from(result.data, 'base64').length });
}

async function cmdBrowserEval(expression) {
  const state = readState();
  const cdp = await connectPage(state);
  const value = await evaluate(cdp, expression);
  cdp.close();
  print({ ok: true, value });
}

function headingHas(snap, needle) {
  return (snap.headings || []).some((h) => h.text.includes(needle));
}

async function proveHome() {
  mkdirSync(join(artifactsDir, 'home'), { recursive: true });
  await cmdLaunch({});
  const doctor = await collectDoctor(readState());
  writeFileSync(artifactPath('home/doctor.json'), `${JSON.stringify(doctor, null, 2)}\n`);
  if (!doctor.ok) fail('doctor failed', doctor);
  const homeHttp = await httpGet('/', {
    'assert-status': '200',
    'assert-contains': HOME_H1,
    out: 'home/http-home.html',
  });
  await cmdBrowserStart({});
  await cmdBrowserGoto('/');
  await cmdBrowserScreenshot({ path: 'home/01-home.png' });
  const before = await (async () => {
    const state = readState();
    const cdp = await connectPage(state);
    const snap = await evaluate(cdp, SNAPSHOT_JS);
    cdp.close();
    writeFileSync(artifactPath('home/01-home.json'), `${JSON.stringify(snap, null, 2)}\n`);
    return snap;
  })();
  if (!headingHas(before, HOME_H1)) fail('home snapshot missing hero heading', before);
  await cmdBrowserClick({
    role: 'link',
    name: 'Explore the Gallery',
    wait: 'The Collection',
  });
  await cmdBrowserScreenshot({ path: 'home/02-gallery.png' });
  const after = await (async () => {
    const state = readState();
    const cdp = await connectPage(state);
    const snap = await evaluate(cdp, SNAPSHOT_JS);
    cdp.close();
    writeFileSync(artifactPath('home/02-gallery.json'), `${JSON.stringify(snap, null, 2)}\n`);
    return snap;
  })();
  if (!headingHas(after, 'The Collection')) fail('gallery heading missing after click', after);
  if (!headingHas(after, 'Simon Willard Tall Case Clock Style')) {
    fail('gallery missing tall-case clock title', after);
  }
  await httpGet('/gallery', {
    'assert-status': '200',
    'assert-contains': 'The Collection',
    out: 'home/http-gallery.html',
  });
  const proof = {
    ok: true,
    feature: 'home',
    doctor,
    homeHttp: { status: homeHttp.status, url: homeHttp.url },
    beforeHeadings: before.headings,
    afterHeadings: after.headings,
    screenshots: ['home/01-home.png', 'home/02-gallery.png'],
    provenAt: new Date().toISOString(),
  };
  writeFileSync(artifactPath('home/result.json'), `${JSON.stringify(proof, null, 2)}\n`);
  print(proof);
}

async function cmdProve(feature) {
  if (feature !== 'home') fail(`prove supports home only, got ${feature}`);
  try {
    await proveHome();
  } finally {
    await cmdCleanup();
  }
  const resultPath = join(artifactsDir, 'home/result.json');
  const shot = join(artifactsDir, 'home/02-gallery.png');
  if (!existsSync(resultPath) || !existsSync(shot)) {
    fail('cleanup removed proof artifacts');
  }
  print({
    ok: true,
    evidenceSurvivedCleanup: true,
    resultPath,
    screenshot: shot,
  });
}

const args = parseArgs(process.argv.slice(2));
const [cmd, sub, ...rest] = args._;

try {
  if (cmd === 'launch') await cmdLaunch(args);
  else if (cmd === 'doctor') await cmdDoctor();
  else if (cmd === 'cleanup') await cmdCleanup();
  else if (cmd === 'get') {
    const result = await httpGet(sub || '/', args);
    print({ ok: true, url: result.url, status: result.status, bytes: result.bytes, out: args.out || null });
  } else if (cmd === 'post') {
    const result = await httpPost(sub || '/api/contact', args);
    print(result);
  } else if (cmd === 'prove') await cmdProve(sub);
  else if (cmd === 'browser' && sub === 'start') await cmdBrowserStart(args);
  else if (cmd === 'browser' && sub === 'goto') await cmdBrowserGoto(rest[0] || args.path || '/', args);
  else if (cmd === 'browser' && sub === 'click') await cmdBrowserClick(args);
  else if (cmd === 'browser' && sub === 'fill') await cmdBrowserFill(args);
  else if (cmd === 'browser' && sub === 'snapshot') await cmdBrowserSnapshot(args);
  else if (cmd === 'browser' && sub === 'screenshot') await cmdBrowserScreenshot(args);
  else if (cmd === 'browser' && sub === 'eval') await cmdBrowserEval(rest.join(' ') || args.expression);
  else {
    fail(
      'usage: launch | doctor | cleanup | get <path> | post <path> | prove home | browser start|goto|click|fill|snapshot|screenshot|eval',
    );
  }
} catch (err) {
  if (process.exitCode !== 1) {
    print({ ok: false, error: String(err.message || err) });
    process.exitCode = 1;
  }
}
