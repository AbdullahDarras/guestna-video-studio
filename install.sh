#!/usr/bin/env bash
# One-command installer for teammates WITHOUT a GitHub account (macOS / Linux).
#   T=<access-code>; curl -fsSL -H "Authorization: token $T" \
#     https://raw.githubusercontent.com/AbdullahDarras/guestna-video-studio/main/install.sh | GUESTNA_TOKEN=$T bash
# GUESTNA_TOKEN is a read-only GitHub token for the two private repos. It is stored only in your own git config,
# scoped to github.com/AbdullahDarras/ (so it is used for these repos and nothing else).
# Without GUESTNA_TOKEN the script relies on git credentials you already have.
set -euo pipefail

HOME_DIR="${GUESTNA_HOME:-$HOME/GuestNa}"
STUDIO_URL="${GUESTNA_STUDIO_URL:-https://github.com/AbdullahDarras/guestna-video-studio.git}"

if ! command -v git >/dev/null 2>&1; then
  echo "Git is not installed. On a Mac run: xcode-select --install   then run this command again."
  exit 1
fi

if [ -n "${GUESTNA_TOKEN:-}" ]; then
  basic=$(printf 'x-access-token:%s' "$GUESTNA_TOKEN" | base64 | tr -d '\n')
  git config --global "http.https://github.com/AbdullahDarras/.extraHeader" "Authorization: Basic $basic"
  echo "Access code saved for the GuestNa repos."
fi

export GIT_TERMINAL_PROMPT=0
mkdir -p "$HOME_DIR"
cd "$HOME_DIR"
if [ -d guestna-video-studio/.git ]; then
  echo "Studio already installed. Updating..."
  git -C guestna-video-studio pull --ff-only
else
  git clone "$STUDIO_URL" guestna-video-studio || {
    echo "Could not download the studio. The access code may be wrong or expired. Ask for a new one."
    exit 1
  }
fi

cd guestna-video-studio
./setup.sh

echo
echo "Done. Open this folder in Claude Code:  $HOME_DIR/guestna-video-studio"
