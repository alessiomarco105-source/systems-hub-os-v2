#!/usr/bin/env node

import https from "node:https";
import { credential, telegramChannels } from "./lib/telegram-config.mjs";

function fail(message) {
  throw new Error(message);
}

function parseArgs(args) {
  const options = { dryRun: false };
  for (let index = 0; index < args.length; index += 1) {
    const value = args[index];
    if (value === "--dry-run") {
      options.dryRun = true;
      continue;
    }
    if (!value.startsWith("--")) fail(`unsupported argument: ${value}`);
    const name = value.slice(2);
    const next = args[index + 1];
    if (!next || next.startsWith("--")) fail(`--${name} requires a value`);
    options[name] = next;
    index += 1;
  }
  return options;
}

function postTelegram(token, chatId, text) {
  const body = JSON.stringify({
    chat_id: chatId,
    text,
    disable_web_page_preview: true
  });
  return new Promise((resolvePromise, rejectPromise) => {
    const request = https.request({
      hostname: "api.telegram.org",
      path: `/bot${token}/sendMessage`,
      method: "POST",
      headers: {
        "content-type": "application/json",
        "content-length": Buffer.byteLength(body)
      }
    }, response => {
      let data = "";
      response.on("data", chunk => { data += chunk; });
      response.on("end", () => {
        if (response.statusCode >= 200 && response.statusCode < 300) resolvePromise(data);
        else rejectPromise(new Error(`Telegram API returned ${response.statusCode}: ${data}`));
      });
    });
    request.on("error", rejectPromise);
    request.end(body);
  });
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const chatId = String(options["chat-id"] || "").trim();
  const text = String(options.text || "").trim();
  if (!chatId) fail("--chat-id is required");
  if (!text) fail("--text is required");
  if (text.length > 3500) fail("message exceeds 3500 characters");

  if (options.dryRun) {
    process.stdout.write(`Telegram reply dry-run chat_id=${chatId}\n`);
    process.stdout.write(`${text}\n`);
    return;
  }

  const config = telegramChannels.interactive;
  const token = credential(config.tokenEnv, config.tokenService);
  if (!token) fail("missing interactive Telegram bot token");
  await postTelegram(token, chatId, text);
  process.stdout.write("Telegram reply sent channel=interactive\n");
}

main().catch(error => {
  const details = error.message || error.code || error.name || String(error);
  process.stderr.write(`error: ${details}\n`);
  process.exitCode = 1;
});
