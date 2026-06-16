import { execFileSync } from "node:child_process";

export const telegramChannels = {
  operations: {
    bot: "Systems Hub operations bot",
    use: "Daily recaps, weekly reviews, and agent operations alerts",
    tokenEnv: "SYSTEMS_HUB_TELEGRAM_OPERATIONS_BOT_TOKEN",
    tokenService: "systems-hub-telegram-operations-bot-token",
    chatEnv: "SYSTEMS_HUB_TELEGRAM_OPERATIONS_CHAT_ID",
    chatService: "systems-hub-telegram-operations-chat-id",
    direction: "outbound"
  },
  social: {
    bot: "Systems Hub social KPI bot",
    use: "Social media performance reports and content KPI alerts",
    tokenEnv: "SYSTEMS_HUB_TELEGRAM_SOCIAL_BOT_TOKEN",
    tokenService: "systems-hub-telegram-social-bot-token",
    chatEnv: "SYSTEMS_HUB_TELEGRAM_SOCIAL_CHAT_ID",
    chatService: "systems-hub-telegram-social-chat-id",
    direction: "outbound"
  },
  signup: {
    bot: "Trader'sHub_alerts_bot",
    use: "Trader's Hub beta/signup alerts that require Marco review",
    tokenEnv: "SYSTEMS_HUB_TELEGRAM_SIGNUP_BOT_TOKEN",
    tokenService: "systems-hub-telegram-signup-bot-token",
    chatEnv: "SYSTEMS_HUB_TELEGRAM_SIGNUP_CHAT_ID",
    chatService: "systems-hub-telegram-signup-chat-id",
    direction: "outbound"
  },
  interactive: {
    bot: "@Systemshub_bot",
    use: "Inbound owner messages routed into governed agent task envelopes",
    tokenEnv: "SYSTEMS_HUB_TELEGRAM_INTERACTIVE_BOT_TOKEN",
    tokenService: "systems-hub-telegram-interactive-bot-token",
    chatEnv: "SYSTEMS_HUB_TELEGRAM_INTERACTIVE_CHAT_ID",
    chatService: "systems-hub-telegram-interactive-chat-id",
    direction: "inbound"
  }
};

export function keychain(service) {
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

export function credential(name, service) {
  return process.env[name] || keychain(service);
}

export function credentialStatus(channel) {
  const config = telegramChannels[channel];
  if (!config) throw new Error(`unsupported Telegram channel=${channel}`);
  return {
    token: Boolean(credential(config.tokenEnv, config.tokenService)),
    chatId: Boolean(credential(config.chatEnv, config.chatService))
  };
}
