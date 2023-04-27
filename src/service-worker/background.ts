import { MESSAGE_TYPES } from "src/lib/helpers/messages.helper";
import * as sessionHandlers from "src/service-worker/handlers/session-handler";
import * as noteHandlers from "src/service-worker/handlers/note-handler";
import { promiseTuplify } from "src/lib/utils/promise.utils";
import { fetchExtensionRefreshToken, USERS_API_URL } from "src/lib/apis/user-api";

const handlers = new Map<string, (data: any, cb: (result: any) => void) => void>();

function setupHandlers() {
  // ? Session handlers
  handlers.set(MESSAGE_TYPES.LOGGED_IN, sessionHandlers.handleLogin);
  handlers.set(MESSAGE_TYPES.FETCH_SELF, sessionHandlers.handleFetchSession);

  // ? Note handlers
  handlers.set(MESSAGE_TYPES.FIND_ONE_NOTE, noteHandlers.handleFetchOneNote);
  handlers.set(MESSAGE_TYPES.FIND_NOTES, noteHandlers.handleFetchNotes);
  handlers.set(MESSAGE_TYPES.SEARCH_NOTES, noteHandlers.handleSearchNotes);
}

chrome.runtime.onInstalled.addListener(async () => {
  const { ctnn_refresh_token } = await chrome.storage.local.get(["ctnn_refresh_token"]);

  if (!ctnn_refresh_token) {
    return;
  }

  const [res, error] = await promiseTuplify(
    fetchExtensionRefreshToken(USERS_API_URL, ctnn_refresh_token)
  );

  if (error) {
    return;
  }

  // ? Callback is not used
  const handler = handlers.get(MESSAGE_TYPES.LOGGED_IN);

  if (handler instanceof Function) {
    handler(res, () => null);
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { type, data } = message ?? {};

  console.log("MESSAGE TYPE", type);

  const handler = handlers.get(type);

  console.log("handler", handler);

  if (!(handler instanceof Function)) {
    throw new Error(`Unrecognized message type ${type}`);
  }

  handler(data, sendResponse);

  return true;
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "init-refresh-token") {
    sessionHandlers.handleRefreshTokenAlarm();
  }
});

(async () => {
  setupHandlers();
})();
