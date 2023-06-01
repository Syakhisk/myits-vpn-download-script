#!/bin/env bash

VPN_PATH="$HOME/VPNs/MYITS-OPENVPN"
VPN_CONFIG="$VPN_PATH/its-onefile-2.ovpn"

EXPIRED_FILE="$HOME/VPNs/expired.txt"
EXPIRED_DATE="$(cat "$EXPIRED_FILE" | grep "Expired:" | awk -F'Expired:' '{print $2}')"

if ! $(node -e "(new Date('$EXPIRED_DATE').getTime() < new Date().getTime()) ? process.exit(1) : process.exit(0)"); then
  echo "--Expired--"
  exit 1
fi

cd "$VPN_PATH"

sudo openvpn \
  --config "$VPN_CONFIG" \
  --route-nopull \
  --route 10.15.40.0 255.255.255.0

