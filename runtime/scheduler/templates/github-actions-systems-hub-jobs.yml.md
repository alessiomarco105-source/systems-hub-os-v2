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
  # schedule:
  #   # GitHub cron is UTC. 00:00 UTC approximates 20:00 New York during EDT.
  #   - cron: "0 0 * * *"       # daily-agent-recap
  #   # 12:00 UTC approximates 08:00 New York during EDT.
  #   - cron: "0 12 * * 1"      # weekly-business-review
  #   # 23:00 UTC approximates 19:00 New York during EDT.
  #   - cron: "0 23 * * 0"      # social-kpi-report

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
        run: |
          echo "Install Pi CLI using the approved project install method."
          echo "Do not proceed until this command is verified in a manual dispatch."
          exit 1

      - name: Link hub
        run: |
          mkdir -p "$HOME/.local/bin"
          ln -sf "$GITHUB_WORKSPACE/bin/hub" "$HOME/.local/bin/hub"
          echo "$HOME/.local/bin" >> "$GITHUB_PATH"

      - name: Verify CLI
        run: |
          hub status
          hub telegram health
          hub job "${{ github.event.inputs.job_id }}" --dry-run

      - name: Run selected job
        run: |
          hub job "${{ github.event.inputs.job_id }}" --notify

      - name: Upload run receipts
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: systems-hub-run-receipts
          path: operations/runs/usage/**
```

## Notes

- The `Install Pi` step intentionally fails until the cloud-safe Pi install command is approved.
- `permissions.contents` is `read` for the first test so the workflow cannot commit receipts back.
- Receipt preservation starts as workflow artifacts. Commit-back can be added later after approval.
- Scheduled cron times are UTC; verify daylight-saving behavior before activation.
