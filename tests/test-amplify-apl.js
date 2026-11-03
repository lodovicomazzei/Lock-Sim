// Explicit Amplify Curse must control the buff without spending a GCD or changing existing automatic rotations.
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
  function build() { return { key: 'amptest', short: 'Amp test', talents: { amplifyCurse: 1 }, pet: null, sacrifice: null, oil: 'none', rotation: ['baneOfAgony', 'shadowBolt'] }; }
  function run(b, duration) { return WL.simulateOnce(b, 'human', cfg(), { seed: 2, duration: duration || 60, log: true }); }
  function casts(r, key) { return r.log.filter(function (e) { return e.type === 'cast' && e.spell === key; }); }
  function ticks(r) { return r.log.filter(function (e) { return e.type === 'tick' && e.spell === 'baneOfAgony'; }); }
  T.run('Amplify Curse: explicit APL control', function () {
    T.group('explicit use, automatic fallback, buff consumption and expiry');
    var auto = build(), manual = clone(auto); manual.rotation.unshift('amplifyCurse');
    var a = run(auto), m = run(manual);
    T.eq(JSON.stringify(casts(m, 'baneOfAgony').map(function (e) { return e.t; })), JSON.stringify(casts(a, 'baneOfAgony').map(function (e) { return e.t; })), 'off-GCD use does not delay Bane of Agony');
    T.near(m.bySpell.baneOfAgony.dmg, a.bySpell.baneOfAgony.dmg, 1e-9, 'explicit use at the first Bane deals the same damage as automatic use');
    T.eq(casts(m, 'amplifyCurse')[0].gcd, 0, 'Amplify Curse spends no GCD');
    T.eq(casts(run(manual, 400), 'amplifyCurse').length, 3, '180 s cooldown: three explicit uses in 400 s');
    var held = clone(manual); held.actWhen = { amplifyCurse: { t: 'fight', what: 'elapsed', op: '>=', v: 25 } };
    var h = run(held), plain = build(); delete plain.talents.amplifyCurse; var n = run(plain);
    T.ok(casts(h, 'amplifyCurse')[0].t >= 25, 'the APL condition holds Amplify Curse until the requested time');
    T.eq(ticks(h)[0].dmg, ticks(n)[0].dmg, 'explicit control disables the old automatic first-Bane amplification');
    var expiry = build(); expiry.rotation.unshift('amplifyCurse');
    expiry.actWhen = { baneOfAgony: { t: 'fight', what: 'elapsed', op: '>=', v: 35 } };
    var ex = run(expiry), np = clone(expiry); delete np.talents.amplifyCurse; np.rotation.shift();
    T.eq(ticks(ex)[0].dmg, ticks(run(np))[0].dmg, 'an unused buff expires after 30 s');
    var grouped = clone(auto); grouped.rules = [{ spell: 'amplifyCurse', when: { t: 'fight', what: 'elapsed', op: '>=', v: 10 } }];
    grouped.groups = { cooldowns: ['rule:0'] }; grouped.rotation.unshift('group:cooldowns');
    T.ok(WL.manualAmplify(grouped) && casts(run(grouped), 'amplifyCurse')[0].t >= 10, 'explicit rules inside groups control the buff');
    var unused = clone(auto); unused.rules = [{ spell: 'amplifyCurse' }];
    T.ok(!WL.manualAmplify(unused), 'an unused rule does not disable automatic use');
    var timeline = clone(auto); timeline.timeline = [{ t: 10, k: 'amplifyCurse' }];
    T.ok(casts(run(timeline), 'amplifyCurse')[0].t >= 10, 'a fight-timeline entry can activate Amplify Curse');
    T.eq(WL.timelineSpan(manual, cfg(), 'amplifyCurse').span, 0, 'the fight timeline also assigns no GCD');
    var legal = clone(WL.BUILDS.filter(function (b) { return b.key === 'wrack_succubus'; })[0]);
    legal.rotation.unshift('amplifyCurse');
    T.eq(WL.validateBuild(legal).join(' | '), '', 'an explicit Amplify Curse action is a valid complete build');
    T.ok(WL.manualAmplify(WL.decodeBuild(WL.encodeBuild(legal))), 'export and import preserve explicit Amplify Curse');
    legal.rules = [{ spell: 'amplifyCurse' }]; legal.rotation[0] = 'rule:0';
    T.eq(WL.validateBuild(legal).join(' | '), '', 'an unconditional off-GCD rule does not hide the rest of the priority');
  });
})();
