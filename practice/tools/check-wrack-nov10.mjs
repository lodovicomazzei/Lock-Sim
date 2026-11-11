import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createCombat } from '../js/combat.js';
const require = createRequire(import.meta.url);
const WL = require('./load-sim.js').load();
const clone = x => JSON.parse(JSON.stringify(x));
function make(targets = 1) {
  const cfg = clone(WL.DEFAULT_CONFIG);
  cfg.combat.baseHitPct = cfg.combat.maxHitPct = 100; cfg.combat.baseCritPct = 0;
  cfg.gear.hitPct = cfg.gear.critPct = cfg.gear.pierce = 0;
  cfg.options.includePetDamage = cfg.options.useCurseOfElements = false;
  cfg.combat.levelResist.on = false;
  for (const g of ['buffs', 'debuffs', 'consumables']) for (const k in cfg[g]) cfg[g][k].on = false;
  const build = { key: 'nov10', talents: { wrack: 1, siphonLife: 1, improvedCorruption: 5 }, pet: null, sacrifice: null, oil: 'none', rotation: ['wrack'] };
  const log = [];
  const c = createCombat({ WL, build, raceKey: 'human', config: cfg, seed: 2, targets, linearDuration: 120,
    onEvent: e => { if (e.type === 'tick') log.push({ ...e, t: +c.state.t.toFixed(6) }); } });
  function cast(at, key, ti = 1) { c.update(at); c.setTarget(ti); assert.equal(c.press(key).ok, true, key + ' at ' + at); }
  return { c, log, cast };
}
function times(log, key, ti = 1) { return log.filter(e => e.key === key && e.target === ti).map(e => e.t); }

// A short channel earns half a second of extra progress even though no DoT tick occurred inside it.
{
  const { c, log, cast } = make(); cast(0, 'corruption'); cast(1.5, 'wrack'); c.update(2); c.cancel(); c.update(19);
  assert.deepEqual(times(log, 'corruption'), [2.5, 5.5, 8.5, 11.5, 14.5, 17.5]);
  assert.equal(c.dotLeft('corruption'), 0);
}
// Full channel, then normal speed: expiration is 18 s, not 9 s.
{
  const { c, log, cast } = make(); cast(0, 'corruption'); cast(1.5, 'wrack'); c.update(19);
  assert.deepEqual(times(log, 'corruption'), [2.25, 3.75, 5.25, 6.75, 9, 12, 15, 18]);
}
// Each target keeps its own progress. Changing your selection does not move an existing channel.
{
  const { c, log, cast } = make(2); cast(0, 'corruption'); cast(1.5, 'corruption', 2); cast(3, 'wrack', 2);
  c.setTarget(1); c.update(4); c.cancel(); c.update(10);
  assert.deepEqual(times(log, 'corruption', 1), [3, 6, 9]);
  assert.deepEqual(times(log, 'corruption', 2), [3.75, 6.5, 9.5]);
}
// Movement can cancel between ticks; saved progress is still retained.
{
  const { c, log, cast } = make(); cast(0, 'corruption'); cast(1.5, 'wrack'); c.update(2, { moving: true }); c.update(6, { moving: false });
  assert.deepEqual(times(log, 'corruption'), [2.5, 5.5]);
}
// Refreshing the DoT invalidates every queued tick and expiry belonging to the old application.
{
  const { c, log, cast } = make(); cast(0, 'corruption'); cast(1.5, 'wrack'); c.update(3.1); c.cancel(); cast(3.1, 'corruption'); c.update(22);
  assert.deepEqual(times(log, 'corruption'), [2.25, 6.1, 9.1, 12.1, 15.1, 18.1, 21.1]);
}
console.log('OK: 3D Wrack exact tick times, fractional interruption, movement, target isolation, refresh and expiry');
