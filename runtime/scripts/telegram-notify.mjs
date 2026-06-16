#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import https from "node:https";

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

function keychain(service) {
  try {
    return execFileSync("security", [
      "find-generic-password",
      "-a",
      process.env.USER || "",
      "-s",
      service,
      "-w"
    ], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return "";
  }
}

function credential(name, service) {
  return process.env[name] || keychain(service);
}

const channels = {
  operations: {
    tokenEnv: "SYSTEMS_HUB_TELEGRAM_OPERATIONS_BOT_TOKEN",
    tokenService: "systems-hub-telegram-operations-bot-token",
    chatEnv: "SYSTEMS_HUB_TELEGRAM_OPERATIONS_CHAT_ID",
    chatService: "systems-hub-telegram-operations-chat-id"
  },
  social: {
    tokenEnv: "SYSTEMS_HUB_TELEGRAM_SOCIAL_BOT_TOKEN",
    tokenService: "systems-hub-telegram-social-bot-token",
    chatEnv: "SYSTEMS_HUB_TELEGRAM_SOCIAL_CHAT_ID",
    chatService: "systems-hub-telegram-social-chat-id"
  },
  signup: {
    tokenEnv: "SYSTEMS_HUB_TELEGRAM_SIGNUP_BOT_TOKEN",
    tokenService: "systems-hub-telegram-signup-bot-token",
    chatEnv: "SYSTEMS_HUB_TELEGRAM_SIGNUP_CHAT_ID",
    chatService: "systems-hub-telegram-signup-chat-id"
  }
};

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
  const channel = options.channel || "operations";
  const text = options.text || "";
  const config = channels[channel];
  if (!config) fail(`unsupported Telegram channel=${channel}`);
  if (!text.trim()) fail("--text is required");
  if (text.length > 3500) fail("message exceeds 3500 characters");

  if (options.dryRun) {
    process.stdout.write(`Telegram dry-run channel=${channel}\n`);
    process.stdout.write(`${text}\n`);
    return;
  }

  const token = credential(config.tokenEnv, config.tokenService);
  const chatId = credential(config.chatEnv, config.chatService);
  if (!token) fail(`missing Telegram token for channel=${channel}`);
  if (!chatId) fail(`missing Telegram chat id for channel=${channel}`);
  await postTelegram(token, chatId, text);
  process.stdout.write(`Telegram sent channel=${channel}\n`);
}

main().catch(error => {
  process.stderr.write(`error: ${error.message}\n`);
  process.exitCode = 1;
});
