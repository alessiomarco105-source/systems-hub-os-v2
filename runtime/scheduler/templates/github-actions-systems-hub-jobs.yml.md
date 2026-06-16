# GitHub Actions Workflow Template

Copy this into `.github/workflows/systems-hub-jobs.yml` only after Marco approves cloud activation.

Keep `schedule` commented for the first test. Start with manual `workflow_dispatch`.

```yaml
name: Systems Hub Jobs

on:
  workflow_dispatch:
    inputs:
      job_id:
        description: "Systems Hub job id"
        required: true
        default: "daily-agent-recap"
        type: choice
        options:
          - daily-agent-recap
          - weekly-business-review
          - social-kpi-report
          - security-exposure-review
  schedule:
    # GitHub cron is UTC. 00:00 UTC approximates 20:00 New York during EDT.
    - cron: "0 0 * * *"       # daily-agent-recap
    # 12:00 UTC approximates 08:00 New York during EDT.
    - cron: "0 12 * * 1"      # weekly-business-review
    # 23:00 UTC approximates 19:00 New York during EDT.
    - cron: "0 23 * * 0"      # social-kpi-report
    # Every third UTC day at 14:00 UTC. Calendar-month reset is acceptable for v1.
    - cron: "0 14 */3 * *"    # security-exposure-review

permissions:
  contents: read

concurrency:
  group: systems-hub-${{ github.event.inputs.job_id || github.event.schedule || github.run_id }}
  cancel-in-progress: false

jobs:
  run-systems-hub-job:
    runs-on: ubuntu-latest
    timeout-minutes: 20
    env:
      SYSTEMS_HUB_DEEPSEEK_API_KEY: ${{ secrets.SYSTEMS_HUB_DEEPSEEK_API_KEY }}
      SYSTEMS_HUB_TELEGRAM_OPERATIONS_BOT_TOKEN: ${{ secrets.SYSTEMS_HUB_TELEGRAM_OPERATIONS_BOT_TOKEN }}
      SYSTEMS_HUB_TELEGRAM_OPERATIONS_CHAT_ID: ${{ secrets.SYSTEMS_HUB_TELEGRAM_OPERATIONS_CHAT_ID }}
      SYSTEMS_HUB_TELEGRAM_SOCIAL_BOT_TOKEN: ${{ secrets.SYSTEMS_HUB_TELEGRAM_SOCIAL_BOT_TOKEN }}
      SYSTEMS_HUB_TELEGRAM_SOCIAL_CHAT_ID: ${{ secrets.SYSTEMS_HUB_TELEGRAM_SOCIAL_CHAT_ID }}

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "24"

      - name: Install Pi
        run: npm install -g @earendil-works/pi-coding-agent@0.79.4

      - name: Link hub
        run: |
          mkdir -p "$HOME/.local/bin"
          ln -sf "$GITHUB_WORKSPACE/bin/hub" "$HOME/.local/bin/hub"
          echo "$HOME/.local/bin" >> "$GITHUB_PATH"

      - name: Select job
        run: |
          if [ "${{ github.event_name }}" = "workflow_dispatch" ]; then
            job_id="${{ github.event.inputs.job_id }}"
          else
            case "${{ github.event.schedule }}" in
              "0 0 * * *") job_id="daily-agent-recap" ;;
              "0 12 * * 1") job_id="weekly-business-review" ;;
              "0 23 * * 0") job_id="social-kpi-report" ;;
              "0 14 */3 * *") job_id="security-exposure-review" ;;
              *) echo "Unsupported schedule: ${{ github.event.schedule }}" >&2; exit 1 ;;
            esac
          fi
          echo "SYSTEMS_HUB_JOB_ID=$job_id" >> "$GITHUB_ENV"
          echo "Selected Systems Hub job: $job_id"

      - name: Verify CLI
        run: |
          hub status
          hub telegram health
          hub job "$SYSTEMS_HUB_JOB_ID" --dry-run

      - name: Run selected job
        id: run_job
        run: |
          set -o pipefail
          hub job "$SYSTEMS_HUB_JOB_ID" --notify | tee /tmp/systems-hub-job.log
          receipt="$(awk -F': ' '/^Receipt: /{print $2}' /tmp/systems-hub-job.log | tail -1)"
          output="$(awk -F': ' '/^Output: /{print $2}' /tmp/systems-hub-job.log | tail -1)"
          manifest="${receipt%.json}.manifest.json"
          echo "receipt=$receipt" >> "$GITHUB_OUTPUT"
          echo "output=$output" >> "$GITHUB_OUTPUT"
          echo "manifest=$manifest" >> "$GITHUB_OUTPUT"

      - name: Upload run receipts
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: systems-hub-run-receipts
          path: |
            ${{ steps.run_job.outputs.receipt }}
            ${{ steps.run_job.outputs.output }}
            ${{ steps.run_job.outputs.manifest }}
```

## Notes

- The `Install Pi` step pins `@earendil-works/pi-coding-agent@0.79.4`, matching the local verified Pi version.
- `permissions.contents` is `read` for the first test so the workflow cannot commit receipts back.
- Receipt preservation starts as workflow artifacts. Commit-back can be added later after approval.
- Scheduled cron times are UTC; verify daylight-saving behavior before activation.
