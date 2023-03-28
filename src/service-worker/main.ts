import { MESSAGE_TYPES } from "src/lib/helpers/messages.helper";
import { handleTest } from "src/service-worker/handlers/test.handlers";

const handlers = new Map<string, (data: any, cb: (result: any) => void) => void>();

function setupHandlers() {
  handlers.set(MESSAGE_TYPES.TEST, handleTest);
}

chrome.runtime.onInstalled.addListener(() => {
  setupHandlers();
});

chrome.runtime.onMessage.addListener((message, sender, cb) => {
  const { type, data } = message;

  const handler = handlers.get(type);

  if (!(handler instanceof Function)) {
    (cb as any)({
      errors: ["Unrecognized message type"],
      data: null,
    });
  }

  handler(data, cb);

  return true;
});
