#!/usr/bin/env bash
# macOS / Linux bootstrap: makes sure Node 20+ exists (installs it with fnm if needed), then runs the setup.
set -euo pipefail
cd "$(dirname "$0")"

need_node=1
if command -v node >/dev/null 2>&1; then
  major=$(node -p "process.versions.node.split('.')[0]")
  if [ "$major" -ge 20 ]; then need_node=0; fi
fi

if [ "$need_node" = "1" ]; then
  echo "Node 20+ not found. Installing Node LTS with fnm (into your home folder, no admin needed)..."
  os=$(uname -s)
  case "$os" in
    Darwin) asset="fnm-macos.zip" ;;
    Linux)  asset="fnm-linux.zip" ;;
    *) echo "Unsupported OS: $os. Install Node 20+ from https://nodejs.org and run: npm run setup"; exit 1 ;;
  esac
  dir="$HOME/.local/share/fnm"
  mkdir -p "$dir"
  curl -fsSL -o "$dir/fnm.zip" "https://github.com/Schniz/fnm/releases/latest/download/$asset"
  (cd "$dir" && unzip -o -q fnm.zip && chmod +x fnm && rm fnm.zip)
  export PATH="$dir:$PATH"
  fnm install --lts
  eval "$(fnm env --shell bash)"
  fnm use lts-latest
  echo "Tip: add this to your shell profile so Node is always available:"
  echo "  export PATH=\"$dir:\$PATH\" && eval \"\$(fnm env --shell bash)\""
fi

node scripts/setup.mjs
