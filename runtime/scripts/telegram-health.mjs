#!/usr/bin/env node

import { credentialStatus, telegramChannels } from "./lib/telegram-config.mjs";

function parseArgs(args) {
  const options = { verbose: false };
  for (const arg of args) {
    if (arg === "--verbose") options.verbose = true;
    else throw new Error(`unsupported option: ${arg}`);
  }
  return options;
}

function mark(value) {
  return value ? "present" : "missing";
}

function overall(status) {
  if (status.token && status.chatId) return "ready";
  if (status.token || status.chatId) return "partial";
  return "missing";
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  console.log("TELEGRAM CHANNEL          DIRECTION  STATUS    TOKEN    CHAT ID   BOT");
  for (const [channel, config] of Object.entries(telegramChannels)) {
    const status = credentialStatus(channel);
    console.log(
      `${channel.padEnd(25)} ${config.direction.padEnd(9)} ` +
      `${overall(status).padEnd(9)} ${mark(status.token).padEnd(8)} ` +
      `${mark(status.chatId).padEnd(9)} ${config.bot}`
    );
    if (options.verbose) {
      console.log(`  use: ${config.use}`);
      console.log(`  token: ${config.tokenEnv} or Keychain ${config.tokenService}`);
      console.log(`  chat:  ${config.chatEnv} or Keychain ${config.chatService}`);
    }
  }
  console.log("");
  console.log("Notes:");
  console.log("- ready means local credentials exist; it does not prove scheduled/cloud delivery.");
  console.log("- inbound interactive routing is separate from outbound notification sends.");
}

try {
  main();
} catch (error) {
  process.stderr.write(`error: ${error.message}\n`);
  process.exitCode = 1;
}
