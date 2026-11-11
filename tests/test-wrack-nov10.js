// November 10: exact tick times and damage, independent of the replay/parity checks.
(function () {
  function clone(x) { return JSON.parse(JSON.stringify(x)); }
  function cfg() {
    var c = clone(WL.DEFAULT_CONFIG);
    c.combat.baseHitPct = c.combat.maxHitPct = 100; c.combat.baseCritPct = 0;
    c.gear.hitPct = c.gear.critPct = c.gear.pierce = 0;
    c.options.includePetDamage = c.options.useCurseOfElements = c.options.dotEndCheck = false;
    c.combat.levelResist.on = false; c.fight.durationVarPct = 0;
    ['buffs', 'debuffs', 'consumables'].forEach(function (g) { Object.keys(c[g]).forEach(function (k) { c[g][k].on = false; }); });
    return c;
  }
  function build(rot) { return { key: 'nov10', name: 'Nov 10 test', talents: { wrack: 1, siphonLife: 1, improvedCorruption: 5 }, pet: null, sacrifice: null, oil: 'none', rotation: rot || ['shadowBolt'] }; }
  function run(b, c, duration) { return WL.simulateOnce(b, 'human', c || cfg(), { seed: 2, duration: duration || 35, log: true }); }
  function ticks(r, key) { return r.log.filter(function (e) { return e.type === 'tick' && e.spell === key; }); }
  T.run('November 10 Wrack and Soul Siphon', function () {
    T.group('Wrack: tick progress, expiry, damage and exclusions');
    var b = build(); b.timeline = [{ t: 0, k: 'corruption' }, { t: 1.5, k: 'wrack' }];
    var r = run(b), times = ticks(r, 'corruption').map(function (e) { return e.t; });
    T.eq(times.join(','), '2.25,3.75,5.25,6.75,9,12,15,18', 'one full Wrack: twice-fast ticks, banked progress after 7.5 s, normal 18 s expiry');
    var plain = build(); plain.timeline = [{ t: 0, k: 'corruption' }];
    T.eq(ticks(r, 'corruption')[0].dmg, ticks(run(plain), 'corruption')[0].dmg, 'Wrack changes frequency, not individual DoT damage');
    var clip = build(['wrack']); clip.timeline = [{ t: 0, k: 'corruption' }, { t: 2.5, k: 'lifeTap' }];
    // Stop choosing Wrack after the one-second channel; the timeline interrupts it at its first tick.
    clip.actWhen = { wrack: { t: 'fight', what: 'elapsed', op: '<', v: 2 } };
    T.eq(ticks(run(clip), 'corruption').map(function (e) { return e.t; }).join(','), '2.25,5,8,11,14,17', 'clipped Wrack retains fractional progress and does not extend Corruption');
    ['siphonLife', 'baneOfAgony'].forEach(function (key) {
      var x = build(['wrack']); x.timeline = [{ t: 0, k: key }];
      var rr = run(x), tt = ticks(rr, key), expiry = WL.SPELLS[key].duration;
      T.ok(tt.length > expiry / WL.SPELLS[key].tickEvery, key + ': more ticks within original duration');
      T.ok(tt.every(function (e) { return e.t <= expiry; }) && rr.auras['dot:' + key][0][1] === expiry, key + ': original expiry remains exact');
      T.ok(isFinite(rr.total) && tt.every(function (e) { return isFinite(e.dmg); }), key + ': added ticks have finite damage');
    });
    var doom = build(['wrack']); doom.timeline = [{ t: 0, k: 'baneOfDoom' }];
    T.eq(ticks(run(doom, cfg(), 65), 'baneOfDoom').map(function (e) { return e.t; }).join(','), '60', 'Bane of Doom is not accelerated');
    var fire = build(['wrack']); fire.timeline = [{ t: 0, k: 'immolate' }];
    T.eq(ticks(run(fire), 'immolate').map(function (e) { return e.t; }).join(','), '5,8,11,14,17', 'Immolate is not accelerated');
    T.group('Soul Siphon: named effects only, ranks and live expiry');
    T.eq(WL.SOUL_SIPHON_EFFECTS.slice().sort().join(','), 'baneOfAgony,corruption,siphonLife', 'only the three named effects count');
    ['wrack', 'drainLife', 'drainSoul'].forEach(function (drain) {
      for (var rank = 1; rank <= 3; rank++) {
        var x = build(); x.talents.soulSiphon = rank;
        x.timeline = [{ t: 0, k: 'corruption' }, { t: 1.5, k: 'siphonLife' }, { t: 3, k: 'baneOfAgony' }, { t: 4.5, k: drain }];
        var rr = run(x), no = clone(x); delete no.talents.soulSiphon;
        var base = run(no).bySpell[drain].dmg;
        // Drain Soul's fifth tick is at 19.5 s, after Corruption expires at 18: four ticks have 3 stacks, one has 2.
        var gain = rank * (drain === 'drainSoul' ? 0.112 : 0.12);
        T.near(rr.bySpell[drain].dmg / base, 1 + gain, 1e-9, drain + ': rank ' + rank + ' uses three stacks, then drops expired effects live');
      }
    });
    var x = build(['wrack']); x.talents.soulSiphon = 3;
    x.timeline = [{ t: 0, k: 'curseOfElements' }, { t: 1.5, k: 'baneOfDoom' }];
    var no = clone(x); delete no.talents.soulSiphon;
    T.near(run(x).bySpell.wrack.dmg, run(no).bySpell.wrack.dmg, 1e-9, 'CoE, Doom and Wrack itself give no Soul Siphon stacks');
  });
})();
