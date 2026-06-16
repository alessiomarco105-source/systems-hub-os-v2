#!/usr/bin/env node

import https from "node:https";
import { credential, telegramChannels } from "./lib/telegram-config.mjs";

const routes = [
  {
    agent: "traders-hub-engineer",
    patterns: [/\bbug\b/i, /\bcode\b/i, /\bdeploy\b/i, /\btrader'?s hub\b/i, /\bthetradersystem\b/i, /\bsupabase\b/i]
  },
  {
    agent: "security-officer",
    patterns: [/\bsecurity\b/i, /\bleak\b/i, /\bsecret\b/i, /\btoken\b/i, /\bmalware\b/i, /\brls\b/i]
  },
  {
    agent: "cmo",
    patterns: [/\bmarketing\b/i, /\bcontent\b/i, /\bpost\b/i, /\bsocial\b/i, /\bviral\b/i]
  },
  {
    agent: "content-producer",
    patterns: [/\bscript\b/i, /\bvideo\b/i, /\breel\b/i, /\btiktok\b/i, /\byoutube\b/i]
  },
  {
    agent: "chief-of-staff-business",
    patterns: [/\bexpense\b/i, /\brevenue\b/i, /\bokr\b/i, /\bpriority\b/i, /\bweekly review\b/i, /\bdecision\b/i]
  },
  {
    agent: "designer",
    patterns: [/\bdesign\b/i, /\bui\b/i, /\bux\b/i, /\blayout\b/i, /\bbrand\b/i]
  },
  {
    agent: "sales-specialist",
    patterns: [/\boutreach\b/i, /\bprospect\b/i, /\bsales\b/i, /\blead\b/i]
  }
];

function fail(message) {
  throw new Error(message);
}

function parseArgs(args) {
  const options = { dryRun: false, limit: 5 };
  for (let index = 0; index < args.length; index += 1) {
    const value = args[index];
    if (value === "--dry-run") {
      options.dryRun = true;
      continue;
    }
    if (value === "--limit") {
      const next = args[index + 1];
      if (!next || next.startsWith("--")) fail("--limit requires a value");
      options.limit = Number.parseInt(next, 10);
      if (!Number.isInteger(options.limit) || options.limit < 1 || options.limit > 20) {
        fail("--limit must be an integer from 1 to 20");
      }
      index += 1;
      continue;
    }
    fail(`unsupported argument: ${value}`);
  }
  return options;
}

function getTelegram(token, method) {
  return new Promise((resolvePromise, rejectPromise) => {
    https.get(`https://api.telegram.org/bot${token}/${method}`, response => {
      let data = "";
      response.on("data", chunk => { data += chunk; });
      response.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          if (!parsed.ok) rejectPromise(new Error(`Telegram API rejected ${method}`));
          else resolvePromise(parsed.result || []);
        } catch {
          rejectPromise(new Error(`Telegram API returned invalid JSON for ${method}`));
        }
      });
    }).on("error", rejectPromise);
  });
}

function routeMessage(text) {
  for (const route of routes) {
    if (route.patterns.some(pattern => pattern.test(text))) return route.agent;
  }
  return "harness-orchestrator";
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const config = telegramChannels.interactive;

  if (options.dryRun) {
    console.log("Interactive router dry-run");
    console.log(`Bot: ${config.bot}`);
    console.log("No Telegram updates were fetched and no replies were sent.");
    console.log("Default route: harness-orchestrator");
    return;
  }

  const token = credential(config.tokenEnv, config.tokenService);
  if (!token) fail("missing interactive Telegram bot token");

  const updates = await getTelegram(token, "getUpdates");
  const messages = updates
    .map(update => update.message || update.edited_message)
    .filter(Boolean)
    .slice(-options.limit);

  if (!messages.length) {
    console.log("No interactive Telegram messages found.");
    return;
  }

  for (const message of messages) {
    const text = String(message.text || "").trim();
    if (!text) continue;
    console.log([
      `update_chat_id=${message.chat?.id || "unknown"}`,
      `from=${message.from?.username || message.from?.first_name || "unknown"}`,
      `route=${routeMessage(text)}`,
      `text=${text.slice(0, 160)}`
    ].join(" | "));
  }
}

main().catch(error => {
  process.stderr.write(`error: ${error.message}\n`);
  process.exitCode = 1;
});
