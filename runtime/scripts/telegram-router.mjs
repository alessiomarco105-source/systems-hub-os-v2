#!/usr/bin/env node

import https from "node:https";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { credential, telegramChannels } from "./lib/telegram-config.mjs";

const scriptPath = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(scriptPath), "../..");
const envelopeDir = resolve(repoRoot, "operations/approvals/telegram");

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
  const options = { createEnvelope: false, dryRun: false, limit: 5 };
  for (let index = 0; index < args.length; index += 1) {
    const value = args[index];
    if (value === "--create-envelope") {
      options.createEnvelope = true;
      continue;
    }
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

function safeText(value) {
  return String(value || "")
    .replace(/\r/g, "")
    .slice(0, 4000);
}

function envelopeName(message, route) {
  const updateTime = message.date
    ? new Date(message.date * 1000).toISOString().replace(/[:.]/g, "-")
    : new Date().toISOString().replace(/[:.]/g, "-");
  const chat = String(message.chat?.id || "unknown").replace(/[^a-zA-Z0-9_-]/g, "");
  const id = String(message.message_id || "unknown").replace(/[^a-zA-Z0-9_-]/g, "");
  return `${updateTime}-${chat}-${id}-${route}.json`;
}

async function writeEnvelope(message, route) {
  await mkdir(envelopeDir, { recursive: true });
  const envelope = {
    schema: "systems_hub.telegram_task_envelope/v1",
    status: "pending_marco_approval",
    created_at: new Date().toISOString(),
    source: {
      channel: "interactive",
      bot: telegramChannels.interactive.bot,
      chat_id: String(message.chat?.id || ""),
      message_id: message.message_id || null,
      from: {
        username: message.from?.username || null,
        first_name: message.from?.first_name || null
      },
      date: message.date ? new Date(message.date * 1000).toISOString() : null
    },
    route: {
      proposed_agent: route,
      routed_by: "runtime/scripts/telegram-router.mjs",
      confidence: route === "harness-orchestrator" ? "default" : "keyword"
    },
    request: {
      text: safeText(message.text),
      attachments: []
    },
    permissions: {
      may_run_model: false,
      may_write_files: false,
      may_send_replies: false,
      may_execute_commands: false,
      may_commit: false,
      may_publish_or_pay: false
    },
    approval: {
      required: true,
      syntax: `approved: telegram envelope ${envelopeName(message, route).replace(/\.json$/, "")}`,
      notes: "Envelope capture only. Running the routed agent requires a separate approved command."
    }
  };
  const path = resolve(envelopeDir, envelopeName(message, route));
  try {
    await writeFile(path, `${JSON.stringify(envelope, null, 2)}\n`, { flag: "wx", mode: 0o600 });
    return { path, created: true };
  } catch (error) {
    if (error.code === "EEXIST") return { path, created: false };
    throw error;
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const config = telegramChannels.interactive;

  if (options.dryRun) {
    console.log("Interactive router dry-run");
    console.log(`Bot: ${config.bot}`);
    console.log("No Telegram updates were fetched and no replies were sent.");
    console.log("Default route: harness-orchestrator");
    console.log("Envelope creation: pass --create-envelope during a real router run.");
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
    const route = routeMessage(text);
    console.log([
      `update_chat_id=${message.chat?.id || "unknown"}`,
      `from=${message.from?.username || message.from?.first_name || "unknown"}`,
      `route=${route}`,
      `text=${text.slice(0, 160)}`
    ].join(" | "));
    if (options.createEnvelope) {
      const envelope = await writeEnvelope(message, route);
      console.log(`envelope=${envelope.path}${envelope.created ? "" : " already_exists"}`);
    }
  }
}

main().catch(error => {
  process.stderr.write(`error: ${error.message}\n`);
  process.exitCode = 1;
});
