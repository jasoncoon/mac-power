# MacBook Power Details

Use your MacBook as a USB-PD tester, view detailed battery information, etc.

Tested only on a MacBook Pro with M4 Pro chip, running MacOS Sequoia 15.7.1. It may run and work on other hardware, but you may need to run or compile using [Bun](https://bun.com) (a fast all-in-one JavaScript runtime). It does require MacOS 13 or higher.

![Web Page Screensot](images/screenshot.png)

## Installation:

Download and open the `MacPower.dmg` file for your MacBook's processor:

- [M1 or newer](builds/dmg/apple/MacPower.dmg)
- [Intel](builds/dmg/intel/MacPower.dmg)

In the window that opens drag and drop the `MacPower` file into the `Applications` folder.

Eject the `MacPower` drive.

Run the `MacPower` app.

Your default browser should automatically open the web UI at http://localhost:3000

## If the app opens as a text file, it opens in a text editor:

Make it executable by running: `chmod +x ./MacPower`

## Security Errors

You may see the following warning:

![not opened warning](images/not-opened.png)

Click `Done`, then open MacOS `System Settings` and then choose the `Privacy & Security` section in the left pane.

Scroll to the bottom to the `Security` section, then click `Open Anyway` next to `"MacPower" was blocked to protect your Mac.`:

![not opened warning](images/open-anyway.png)

If it still won't open, run the following command to remove it from MacOS quarantine:

`xattr -d com.apple.quarantine ./MacPower`

## To make the Terminal window close automatically:

In the Terminal app menu bar, click Preferences > Profiles.

Click Basic profile, then the Shell tab.

For `When the shell exits` choose `Close if the shell exited cleanly`.

## Development

Install [Bun](https://bun.com)

Install dependencies:

```bash
bun install
```

Start a development server:

```bash
bun dev
```

Run for production:

```bash
bun start
```

Compile to single-file executable:

```bash
bun run compile:apple
```

or

```bash
bun run compile:intel
```

Build executable & dmg files:

Requires `create-dmg`: https://github.com/create-dmg/create-dmg

```bash
bun run build
```
