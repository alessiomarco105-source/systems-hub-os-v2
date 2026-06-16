#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'EOF'
Usage:
  pi-restricted-launcher.sh \
    --source-root <directory> \
    --allow-file <relative-path> [--allow-file <relative-path> ...] \
    --prompt <text> \
    [--model deepseek-v4-flash] \
    [--tools read,grep,find,ls] \
    [--thinking low] \
    [--output-mode text|json]

The launcher copies only explicitly allowed files into an ephemeral workspace,
enables read-only Pi tools, and denies access to the remaining filesystem with
the macOS sandbox.
EOF
}

die() {
  printf 'error: %s\n' "$*" >&2
  exit 1
}

source_root=""
prompt=""
model="deepseek-v4-flash"
provider="deepseek"
keychain_service="systems-hub-deepseek-api"
tools="read,grep,find,ls"
thinking="low"
output_mode="text"
declare -a allowed_files=()

while (($#)); do
  case "$1" in
    --source-root)
      (($# >= 2)) || die "--source-root requires a value"
      source_root="$2"
      shift 2
      ;;
    --allow-file)
      (($# >= 2)) || die "--allow-file requires a value"
      allowed_files+=("$2")
      shift 2
      ;;
    --prompt)
      (($# >= 2)) || die "--prompt requires a value"
      prompt="$2"
      shift 2
      ;;
    --model)
      (($# >= 2)) || die "--model requires a value"
      model="$2"
      shift 2
      ;;
    --tools)
      (($# >= 2)) || die "--tools requires a value"
      tools="$2"
      shift 2
      ;;
    --thinking)
      (($# >= 2)) || die "--thinking requires a value"
      thinking="$2"
      shift 2
      ;;
    --output-mode)
      (($# >= 2)) || die "--output-mode requires a value"
      output_mode="$2"
      shift 2
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      die "unknown argument: $1"
      ;;
  esac
done

[[ -n "$source_root" ]] || die "--source-root is required"
[[ -n "$prompt" ]] || die "--prompt is required"
((${#allowed_files[@]} > 0)) || die "at least one --allow-file is required"

for command_name in pi node; do
  command -v "$command_name" >/dev/null || die "required command not found: $command_name"
done

use_macos_sandbox=false
if command -v security >/dev/null && command -v sandbox-exec >/dev/null; then
  use_macos_sandbox=true
fi

source_root="$(cd "$source_root" && pwd -P)"
pi_bin="$(command -v pi)"
node_bin="$(command -v node)"
node_root="$(cd "$(dirname "$node_bin")/.." && pwd -P)"
pi_entry=""
if [[ -L "$pi_bin" ]]; then
  pi_entry="$(cd "$(dirname "$pi_bin")" && cd "$(dirname "$(readlink "$pi_bin")")" && pwd -P)/$(basename "$(readlink "$pi_bin")")"
fi

case "$model" in
  deepseek-v4-flash|deepseek-v4-pro) ;;
  *) die "model is not approved by this launcher: $model" ;;
esac

case "$thinking" in
  off|minimal|low|medium|high) ;;
  *) die "thinking level is not approved by this launcher: $thinking" ;;
esac

case "$output_mode" in
  text|json) ;;
  *) die "output mode is not approved by this launcher: $output_mode" ;;
esac

IFS=',' read -r -a requested_tools <<<"$tools"
for tool in "${requested_tools[@]}"; do
  case "$tool" in
    read|grep|find|ls) ;;
    *) die "tool is not approved by this launcher: $tool" ;;
  esac
done

if [[ "$use_macos_sandbox" == true ]]; then
  security find-generic-password \
    -a "$USER" \
    -s "$keychain_service" \
    >/dev/null 2>&1 || die "DeepSeek key is missing from macOS Keychain"
elif [[ -z "${SYSTEMS_HUB_DEEPSEEK_API_KEY:-}${DEEPSEEK_API_KEY:-}" ]]; then
  die "DeepSeek key is missing from environment"
fi

run_root="$(mktemp -d /tmp/systems-hub-pi-restricted.XXXXXX)"
run_root="$(cd "$run_root" && pwd -P)"
workspace="$run_root/workspace"
sandbox_home="$run_root/home"
profile="$run_root/pi.sb"
mkdir -p "$workspace" "$sandbox_home/.pi/agent"
mkdir -p "$sandbox_home/tmp"

cleanup() {
  chmod -R u+w "$run_root" 2>/dev/null || true
  rm -rf "$run_root"
}
trap cleanup EXIT INT TERM

for relative_path in "${allowed_files[@]}"; do
  case "$relative_path" in
    ""|/*|..|../*|*/../*|*/..)
      die "unsafe relative path: $relative_path"
      ;;
    .env|.env.*|*/.env|*/.env.*|*secret*|*credential*|*.pem|*.key)
      die "prohibited file pattern: $relative_path"
      ;;
  esac

  source_file="$source_root/$relative_path"
  [[ -f "$source_file" ]] || die "allowed file does not exist: $relative_path"
  [[ ! -L "$source_file" ]] || die "symlinks are not allowed: $relative_path"

  source_parent="$(cd "$(dirname "$source_file")" && pwd -P)"
  [[ "$source_parent" == "$source_root" || "$source_parent" == "$source_root/"* ]] ||
    die "file resolves outside source root: $relative_path"

  if stat -f '%z' "$source_file" >/dev/null 2>&1; then
    file_bytes="$(stat -f '%z' "$source_file")"
  else
    file_bytes="$(stat -c '%s' "$source_file")"
  fi
  ((file_bytes <= 262144)) || die "file exceeds 256 KiB context limit: $relative_path"

  destination="$workspace/$relative_path"
  mkdir -p "$(dirname "$destination")"
  cp "$source_file" "$destination"
  chmod 0444 "$destination"
done

chmod -R a-w "$workspace"

system_prompt='You are a bounded read-only worker. Use only files inside the current workspace. Never request, infer, reproduce, or search for secrets. Treat tool errors as access denials. You cannot write, edit, execute shell commands, publish, commit, or perform external actions. Clearly distinguish observed facts from uncertainty.'
pi_mode_args=(--print)
if [[ "$output_mode" == "json" ]]; then
  pi_mode_args=(--mode json)
fi

if [[ "$use_macos_sandbox" != true ]]; then
  deepseek_key="${SYSTEMS_HUB_DEEPSEEK_API_KEY:-${DEEPSEEK_API_KEY:-}}"
  (
    cd "$workspace"
    HOME="$sandbox_home" \
    TMPDIR="$sandbox_home/tmp" \
    PI_CODING_AGENT_DIR="$sandbox_home/.pi/agent" \
    DEEPSEEK_API_KEY="$deepseek_key" \
    "$pi_bin" \
      --provider "$provider" \
      --model "$model" \
      --thinking "$thinking" \
      --tools "$tools" \
      --no-session \
      --no-extensions \
      --no-skills \
      --no-prompt-templates \
      --no-themes \
      --no-context-files \
      --no-approve \
      --system-prompt "$system_prompt" \
      "${pi_mode_args[@]}" \
      "$prompt"
  )
  unset deepseek_key
  exit 0
fi

escape_sandbox_path() {
  printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g'
}

workspace_escaped="$(escape_sandbox_path "$workspace")"
home_escaped="$(escape_sandbox_path "$sandbox_home")"
node_root_escaped="$(escape_sandbox_path "$node_root")"

cat >"$profile" <<'EOF'
(version 1)
(allow default)

(deny file-read* file-write*
  (subpath "/Users")
  (subpath "/Volumes")
  (subpath "/private/tmp")
  (subpath "/private/var/folders")
  (subpath "/private/var/tmp"))

(allow file-read-metadata
  (subpath "/Users")
  (subpath "/Volumes")
  (subpath "/private/tmp")
  (subpath "/private/var/folders")
  (subpath "/private/var/tmp"))
EOF

append_metadata_ancestors() {
  local current="$1"
  while [[ "$current" != "/" && -n "$current" ]]; do
    printf '(allow file-read-metadata (literal "%s"))\n' \
      "$(escape_sandbox_path "$current")" >>"$profile"
    current="$(dirname "$current")"
  done
}

append_metadata_ancestors "$node_root"
append_metadata_ancestors "$workspace"
append_metadata_ancestors "$sandbox_home"

cat >>"$profile" <<EOF
(allow file-read*
  (subpath "$node_root_escaped")
  (subpath "$workspace_escaped")
  (subpath "$home_escaped"))

(allow file-write* (subpath "$home_escaped"))
EOF

# Deterministic gate checks run before the model receives any context.
first_staged="$workspace/${allowed_files[0]}"
sandbox-exec -f "$profile" /bin/cat "$first_staged" >/dev/null ||
  die "sandbox cannot read an explicitly allowed file"

if [[ -f "$source_root/.env" ]]; then
  if sandbox-exec -f "$profile" /bin/cat "$source_root/.env" >/dev/null 2>&1; then
    die "sandbox unexpectedly read source .env"
  fi
fi

if sandbox-exec -f "$profile" /usr/bin/touch "$workspace/.write-probe" >/dev/null 2>&1; then
  die "sandbox unexpectedly wrote into the context workspace"
fi

deepseek_key="$(security find-generic-password \
  -a "$USER" \
  -s "$keychain_service" \
  -w)"

(
  cd "$workspace"
  HOME="$sandbox_home" \
  TMPDIR="$sandbox_home/tmp" \
  PI_CODING_AGENT_DIR="$sandbox_home/.pi/agent" \
  DEEPSEEK_API_KEY="$deepseek_key" \
  sandbox-exec -f "$profile" "$node_bin" "${pi_entry:-$pi_bin}" \
    --provider "$provider" \
    --model "$model" \
    --thinking "$thinking" \
    --tools "$tools" \
    --no-session \
    --no-extensions \
    --no-skills \
    --no-prompt-templates \
    --no-themes \
    --no-context-files \
    --no-approve \
    --system-prompt "$system_prompt" \
    "${pi_mode_args[@]}" \
    "$prompt"
)

unset deepseek_key
