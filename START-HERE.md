# Your Warlock simulator and 3D practice room

This package contains both original interfaces by XNWLK, connected as one site:

- `index.html`: the normal WarlockSIM interface.
- `practice/index.html`: the Forever Warlocking 3D practice interface.
- The main page's **Forever Warlocking** link opens your own practice room. The practice room's **Warlock SIM → Open** button returns to your main simulator.
- Sharing a setup from your main simulator creates a link to your own hosted copy.

Both use the confirmed November 2, 2026 Wrack changes: 86 base damage per second at level 60, a 0.286 spell-power coefficient per one-second tick, and no Improved Drains damage bonus. The other November 2 class changes have not been added. Supplied builds and rotations have not been re-optimized for the buff.

Original projects and credits:

- https://github.com/XNWLK/WarlockSIM — base commit `278f7a5`.
- https://github.com/XNWLK/ForeverWarlocking — base commit `3d685c5`.

The original READMEs, copyright notices, source links and credits are preserved. Both original projects state that they have no open-source license. WarlockSIM's README asks for the author's permission for copying, modifying or redistributing the work outside the GitHub viewing/forking allowance. Obtain the author's permission before republishing a modified version; this package does not grant a license.

## Put it on your GitHub without using a terminal

GitHub Desktop is the easiest way to upload all the folders, including hidden files, in one go.

1. Unzip this download. Open the `WarlockSIM` folder: you should see `index.html`, `data`, `engine`, `app`, and `practice` directly inside it.
2. Install GitHub Desktop from https://desktop.github.com/ and sign in to your GitHub account.
3. In GitHub Desktop choose **File → New repository**. Use the name `WarlockSIM` (or any other name), choose a folder outside the unzipped folder as its local location, and create the repository. Do not select a license for code you do not own.
4. In Finder, copy the CONTENTS of the unzipped `WarlockSIM` folder into the new repository folder. Do not put the outer `WarlockSIM` folder inside it. On Mac, press **Command–Shift–.** to show hidden files, then include `.nojekyll` and `.gitignore` when copying. If an existing README needs replacing, use the README from this package.
5. Return to GitHub Desktop, enter a summary such as **Add Warlock simulator and 3D practice room**, and click **Commit to main**. The initial branch may have a different name; use the branch shown by Desktop.
6. Click **Publish repository**. For GitHub Free hosting, publish a public repository after obtaining the author's permission. You can keep it private while preparing it; Pages from private repositories needs a qualifying GitHub plan.
7. Open the repository on GitHub. Go to **Settings → Pages**. Set **Source: Deploy from a branch**, **Branch: main** (or the branch you committed to), and **Folder: /(root)**. Click **Save**.
8. Wait for GitHub's Pages deployment to finish. The Pages settings show the live address. An ordinary project repository named `WarlockSIM` uses:
   - `https://YOUR-USERNAME.github.io/WarlockSIM/` for the normal interface.
   - `https://YOUR-USERNAME.github.io/WarlockSIM/practice/` for the 3D interface.

You do not upload the ZIP itself. GitHub Pages needs the extracted files, with `index.html` at the repository root. You do not need Node, a paid application server, or a build command to publish this prepared package.

If you already have a repository, clone it with GitHub Desktop and copy the package into that local folder before committing. Start with an empty repository so you do not overwrite unrelated work.

## Test after publishing

1. Open the main address and check that the build ranking appears. Run **Sim!** and open **Wrack Succubus** to inspect its spell details. Wrack's base tick formula should be `86 + 0.286 × Shadow spell power` before modifiers.
2. Click **Forever Warlocking**. The 3D room, character and spell bar should appear. Choose a build and cast on a dummy.
3. Use the practice room's **Warlock SIM → Open** button to return to your simulator.
4. Create a share link from the main page and verify it starts with your own site address.

The 3D room uses Three.js 0.180.0 from jsDelivr, as the original does. It needs internet access and a browser with WebGL graphics enabled. Simply double-clicking the HTML file on disk does not reliably run its module scripts or either app's background workers; use the hosted site or a local web server.

## Optional local preview

On Mac, if Python 3 is installed, open Terminal in this folder and run:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Open `http://127.0.0.1:8765/` and `http://127.0.0.1:8765/practice/`. Press Control-C in Terminal to stop the server.

## Future changes

Edit the main simulator's data and engine first. After a mechanics change, with Node installed, run:

```sh
node tools/gen-default-results.js
node tools/gen-length-table.js
node tools/sync-practice.js
node practice/tools/check-vendor.js
node practice/tools/check-combat.mjs
```

The first two refresh the main simulator's cached numbers and documentation. The sync command copies its 17 shared files and build ranking into the 3D app and refreshes the 3D app's cache versions. Use this combined package's sync command rather than the original PowerShell sync, which expects a different directory layout.

The main simulator's full browser test suite is at `/tests/` on a local server. Missing private Wowhead raw-data archives produce three expected warnings in the original tests. Such archives are not included in the original public repository.

## How much work is this?

Allow about 15–30 minutes for a first GitHub Desktop upload and Pages setup. Both apps are static browser apps, and the 3D graphics, models and controls are already written. Adding the prepared 3D room does not require creating a game engine. Reworking the graphics or keeping all future game balance changes current would be a separate development task.
