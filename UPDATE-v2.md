# Update your existing site

This version adds Amplify Curse to the priority/APL spell picker and adds **Open in 3D** beside **Copy build code** in the main build editor. Both interfaces use the updated shared engine.

1. Unzip `WarlockSIM-with-3D-v2.zip` and open the `WarlockSIM` folder inside it.
2. In GitHub Desktop, select your EXISTING simulator repository and choose **Repository → Show in Finder**.
3. Copy the contents of the new `WarlockSIM` folder into that existing repository folder, replacing the corresponding project files and folders. Keep the existing hidden `.git` folder; it is your connection to GitHub and is not included in the ZIP. If you have edited source files yourself since the first upload, preserve those changes before replacing their files.
4. Return to GitHub Desktop. Commit the changes with a summary such as **Add Amplify Curse APL and direct 3D build transfer**, then click **Push origin**.
5. Wait for the repository's **Actions → pages build and deployment** to show a green check. Open your existing site and refresh it with **Command–Shift–R** to load the updated files.

Keep using the same repository address and browser. Saved builds remain in that browser's storage; they are not stored inside this download. Do not clear the site's browsing data while updating.

## Play the custom build you already made

On the main simulator page, open **Build editor**, find your build under **Your builds**, and click **Edit**. Then click **Open in 3D**. The 3D room opens with your talents, pet, rotation, race and current gear/fight settings.

The manual route also works in the original package: **Edit → Copy build code**, then in the 3D room choose **Import**, paste into **Build code**, and click **Apply**. The `WFB1:` prefix is part of the generated code; you do not add it yourself. A saved build name, settings code or Wowhead talent link is not that full build code.

## Amplify Curse

In **Advanced (APL)** choose **New APL line → Amplify Curse (talent)**. Give it any desired conditions and put it above the Bane of Agony entry it should empower. It is also available in the simple priority list.

An explicit Amplify Curse priority/APL entry controls its use and disables the old automatic use. Its next Bane of Agony must be cast within 30 seconds. The cooldown is 180 seconds and it spends no global cooldown. Existing builds that do not include an explicit entry retain automatic Amplify Curse with Bane of Agony.

Verified: 2,813 browser checks passed with no failures; the three original warnings are missing private raw-data archives. The 3D casting engine matched the simulator in 560 replayed fights, including explicit and grouped Amplify Curse rules. A saved named custom build was transferred through the new button and loaded in the 3D interface.
