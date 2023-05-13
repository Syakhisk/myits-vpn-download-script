## MyITS VPN Download Script

## Installation
```
git clone https://github.com/syakhisk/myits-download-vpn-script
cd myits-download-vpn-script
npm install
```

## Usage
Copy `.env.example` to `.env` and fill the required fields.

```
# .env
USERNAME=yourusername
PASSWORD=yourpassword
CHROME_PATH=/path/to/chrome
```

Run the script

```
npm start
```

or 

```
node index.js
```

## Tips

By default, this script can only be run inside the git directory, to make it easier you can make a shell alias or create desktop shortcut.

Linux:

```
# ~/.bashrc or ~/.zshrc or other
alias myitsvpn="node /path/to/myits-download-vpn-script/index.js"
```

Windows:

idk, probably [this](https://www.makeuseof.com/run-command-prompt-commands-desktop-shortcut/)



