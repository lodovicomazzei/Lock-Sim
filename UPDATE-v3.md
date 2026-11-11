# Update your existing Lock-Sim site

This package updates **both the main simulator and the 3D room** for the November 10 Wrack / Soul Siphon hotfix. It retains the Amplify Curse picker and **Open in 3D** button.

1. Unzip **WarlockSIM-with-3D-v3.zip** and open the `WarlockSIM` folder inside it.
2. In GitHub Desktop select **Lock-Sim**, then **Repository → Show in Finder**.
3. Copy the contents of the new `WarlockSIM` folder into your existing repository folder, replacing the corresponding project files and folders. Keep the hidden `.git` folder. The package contains no `.git` folder. If you have made your own code changes, preserve those before replacing their files.
4. In GitHub Desktop commit with **Update Wrack and Soul Siphon for November 10**, then click **Push origin**.
5. Wait for **Actions → pages build and deployment** to turn green. Open your usual site and press **Command–Shift–R**. The main page should say **Wrack / Soul Siphon: 10 Nov 2026** near the top.

GitHub Pages deploys automatically after the push. Keep the same repository and site address. Saved builds stay in the browser; do not clear site data. No Mac software installation or build command is needed for this upload.

## Confirmed changes

- Soul Siphon counts only your **Corruption, Siphon Life and Bane of Agony**, with 4/8/12% per active effect and the existing 12/24/36% rank caps.
- Wrack's own damage is reduced by 30%. The level-60 formula is **60.2 + 0.2002 × Shadow spell power** per one-second tick, before other modifiers. Its displayed base damage rounds to 60.
- Wrack no longer multiplies periodic damage by 1.10.
- While Wrack channels, those three DoTs progress toward their next tick at twice normal speed on its actual target. Their expiry times stay unchanged. Partial tick progress is retained when the channel ends, is cancelled, is shortened by pushback, or is interrupted by movement.
- Bane of Doom and Immolate are not accelerated. CoE, Doom and Wrack itself give no Soul Siphon stacks. Improved Drains still does not increase Wrack.

Sources: [Blizzard's November 10 hotfix notes](https://us.forums.blizzard.com/en/wow/t/wow-forever-hotfixes-november-10-2026/2403040) describe the reduction, named effects, unchanged durations and retained progress. [Wrack spell details](https://www.wowhead.com/forever/spell=1316697/wrack) show the new 0.2002 coefficient and rounded level-60 tooltip. The unrounded base is the previous level-60 86 multiplied by 0.7.

## Files changed

- `data/spells.js`: Wrack values, accelerated DoT list, Soul Siphon list.
- `engine/sim.js`: tick scheduling, interruptions, expiry and the end-of-fight DoT value estimate.
- `practice/js/combat.js`: the same timing rules, separately tracked for each target.
- `engine/explain.js`, `data/tooltips.js`, `tools/gen-tooltips.ps1`, `tools/gen-mechanics.js`, `MECHANICS.md`: updated descriptions and formulas.
- `data/default-results.js`, `data/length-table.js`, `practice/data/build-order.js`: regenerated results.
- `practice/vendor/warlock-sim/`: synchronized shared data/engine; `practice/index.html`: refreshed asset versions.
- `index.html`, `app/app.js`, `app/sim-pool.js`, `engine/worker.js`: update label, variable tick-count log labels and fresh cache versions.
- `tests/` and `practice/tools/`: updated old expectations and added regression checks.

## Modelling notes

The old Bane of Agony damage ramp is retained by tick number: first four half damage, next four normal, later ticks 1.5×. Extra ticks remain at the final tier. The hotfix notes do not spell out its internal ramp script; this is a modelling assumption to verify against a game log. No partial tick is added at expiry. The simulator's existing end-of-fight DoT comparison remains an estimate of future filler use; actual fight ticks follow the exact channel timing. Supplied builds have not been re-optimized, and unrelated class/pet changes are outside this update.

## Validation — November 11, 2026

- Browser suite: **2,835 passed, 0 failed**. Three existing warnings report private archived Wowhead data absent from the public project.
- **640** main-engine fights replayed through 3D combat with identical damage, mana, health and threat. Includes sustained Wrack / three-DoT rotations, multiple targets, movement and pushback.
- Separate 3D checks verify exact tick times, cancellation between ticks, movement interruption, per-target isolation, refresh and unchanged expiration.
- The 17 bundled shared source files match the main simulator byte for byte. The main ranking and the 3D room both load in a Mac browser.
- Your public repository was checked at commit `357ad43` (**Update ampl curse**) before preparing this package. No changes were pushed to GitHub.

For future code work, run the following from the project folder after modifying shared mechanics:

```text
node tools/gen-default-results.js
node tools/gen-length-table.js
node tools/sync-practice.js
node practice/tools/check-vendor.js
node practice/tools/check-wrack-nov10.mjs
node practice/tools/check-combat.mjs
```

Then serve the folder and open `/tests/` for the browser suite. Version changed main-page scripts/worker imports on the next release as well; the 3D synchronizer stamps its own assets.
