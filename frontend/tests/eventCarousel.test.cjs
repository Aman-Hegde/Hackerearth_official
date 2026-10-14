const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
const { create, act } = require('react-test-renderer');

const code = ts.transpileModule(fs.readFileSync(path.join(__dirname, '../src/components/EventCarousel.tsx'), 'utf8'), {
  compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;

function mount(imageUrls, reducedMotion = false, cinematic = false) {
  const timers = new Map();
  let timerId = 0;
  const output = { exports: {} };
  vm.runInNewContext(code, {
    exports: output.exports,
    require: (name) => name.endsWith('.css') ? {} : name === 'framer-motion' ? { useReducedMotion: () => reducedMotion } : require(name),
    window: {
      setInterval: (callback, delay) => { assert.equal(delay, cinematic ? 2500 : 4500); timers.set(++timerId, callback); return timerId; },
      clearInterval: (id) => timers.delete(id),
    },
  });
  const event = { title: 'PROJECT DOOMSDAY: SAVE THE TIMELINE', tagline: 'Three rounds. One mission.',
    description: 'A three-round technical challenge.', rounds: ['MCQ Challenge', 'Pattern Printing', 'DSA Challenge'],
    eventDateTime: '2026-10-10T03:30:00Z', status: 'past', posterUrl: '/events/poster.webp', imageUrls };
  let renderer;
  act(() => { renderer = create(React.createElement(output.exports.default, { event, cinematic })); });
  const root = renderer.root;
  const visible = () => root.findAllByType('img').filter((img) => !img.props['aria-hidden']).map((img) => img.props.src);
  const click = (label) => act(() => root.findAllByType('button').find((button) => button.props['aria-label'] === label || button.children.join('') === label).props.onClick());
  return { root, timers, visible, click, renderer, tick: () => act(() => [...timers.values()].forEach((fn) => fn())), unmount: () => act(() => renderer.unmount()) };
}

test('single image and legacy poster are static without controls or timers', () => {
  for (const images of [undefined, ['/events/one.webp']]) {
    const c = mount(images);
    assert.equal(c.root.findAllByType('img').length, 1);
    assert.equal(c.root.findAllByType('button').length, 0);
    assert.equal(c.timers.size, 0);
    assert.match(c.root.findByType('time').children.join(''), /10 October 2026.*9:00 AM IST/);
    c.unmount();
  }
});

test('eight photos rotate at 4.5 seconds and loop while overlay remains mounted', () => {
  const images = Array.from({ length: 8 }, (_, i) => `/events/project-doomsday/doomsday-0${i + 1}.webp`);
  const c = mount(images);
  const heading = c.root.findByType('h3');
  assert.equal(c.timers.size, 1);
  for (let i = 0; i < 9; i++) {
    assert.deepEqual(c.visible(), [images[i % 8]]);
    assert.equal(c.root.findByType('h3'), heading);
    c.tick();
  }
  c.click('Pause slideshow'); assert.equal(c.timers.size, 0);
  c.click('Next photograph'); assert.deepEqual(c.visible(), [images[2]]);
  c.click('Previous photograph'); assert.deepEqual(c.visible(), [images[1]]);
  c.click('Play slideshow'); assert.equal(c.timers.size, 1);
  const region = c.root.findByProps({ role: 'region' });
  act(() => region.props.onMouseEnter()); assert.equal(c.timers.size, 0);
  act(() => region.props.onMouseLeave()); assert.equal(c.timers.size, 1);
  act(() => region.props.onFocusCapture()); assert.equal(c.timers.size, 0);
  act(() => region.props.onBlurCapture({ currentTarget: { contains: () => false }, relatedTarget: null }));
  assert.equal(c.timers.size, 1);
  c.unmount(); assert.equal(c.timers.size, 0);
});

test('reduced motion disables autoplay while retaining manual navigation', () => {
  const c = mount(['/events/one.webp', '/events/two.webp'], true);
  assert.equal(c.timers.size, 0);
  assert.equal(c.root.findAllByType('button').length, 2);
  c.click('Next photograph'); assert.deepEqual(c.visible(), ['/events/two.webp']);
  assert.match(c.root.findAllByType('img')[0].props.className, /motion-reduce:transition-none/);
  c.unmount();
});

test('failed images are skipped, with static and empty fallback states', () => {
  const c = mount(['/events/missing.webp', '/events/working.webp']);
  act(() => c.root.findAllByType('img')[0].props.onError());
  assert.deepEqual(c.visible(), ['/events/working.webp']);
  assert.equal(c.timers.size, 0);
  assert.equal(c.root.findAllByType('button').length, 0);
  act(() => c.root.findByType('img').props.onError());
  assert.equal(c.root.findAllByType('img').length, 0);
  assert.ok(JSON.stringify(c.renderer.toJSON()).includes('Photographs are currently unavailable.'));
  c.unmount();
});


test('cinematic photos use 2.5 seconds, reset after navigation, and keep explicit pause', () => {
  const c = mount(['/events/one.webp', '/events/two.webp'], false, true);
  const firstTimer = [...c.timers.keys()][0];
  c.click('Next photograph');
  assert.deepEqual(c.visible(), ['/events/two.webp']);
  assert.equal(c.timers.size, 1);
  assert.notEqual([...c.timers.keys()][0], firstTimer);
  assert.match(c.root.findAllByType('img')[0].props.className, /duration-\[400ms\]/);
  const region = c.root.findByProps({ role: 'region' });
  act(() => region.props.onMouseEnter());
  act(() => region.props.onFocusCapture());
  assert.equal(c.timers.size, 1);
  c.tick(); assert.deepEqual(c.visible(), ['/events/one.webp']);
  c.click('Pause slideshow'); assert.equal(c.timers.size, 0);
  c.click('Next photograph'); assert.equal(c.timers.size, 0);
  c.click('Play slideshow'); assert.equal(c.timers.size, 1);
  c.unmount(); assert.equal(c.timers.size, 0);
});

test('cinematic single photo stays static and reduced motion allows only manual navigation', () => {
  const single = mount(['/events/one.webp'], false, true);
  assert.equal(single.timers.size, 0);
  assert.equal(single.root.findAllByType('button').length, 0);
  single.unmount();
  const reduced = mount(['/events/one.webp', '/events/two.webp'], true, true);
  assert.equal(reduced.timers.size, 0);
  reduced.click('Next photograph'); assert.deepEqual(reduced.visible(), ['/events/two.webp']);
  reduced.unmount();
});
