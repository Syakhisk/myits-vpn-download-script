#!/bin/env bash

VPN_PATH="$HOME/VPNs/MYITS-OPENVPN"
VPN_CONFIG="$VPN_PATH/its-onefile-1.ovpn"

EXPIRED_FILE="$HOME/VPNs/expired.txt"
EXPIRED_DATE="$(cat "$EXPIRED_FILE" | grep "Expired:" | awk -F'Expired:' '{print $2}')"

if [ -n "$TMUX" ]; then
  tmux rename-window "VPN"

  # tmux split-window -h 'sleep 5 && mtr --displaymode 2 -i 5 10.15.40'
fi

if ! $(node -e "(new Date('$EXPIRED_DATE').getTime() < new Date().getTime()) ? process.exit(1) : process.exit(0)"); then
  echo "--Expired--"
  exit 1
fi

cd "$VPN_PATH"

if [[ "$1" == "no-route" ]]; then
  echo "--Tunneling without route--"
  sudo openvpn --config "$VPN_CONFIG"
  exit 0
fi

  # --route 10.15.40.0 255.255.255.0
sudo openvpn \
  --config "$VPN_CONFIG" \
  --route-nopull \
  --route 10.15.40.20 255.255.255.255
