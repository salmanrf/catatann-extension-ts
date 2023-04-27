import { fetchExtensionRefreshToken, USERS_API_URL, fetchSelf } from "src/lib/apis/user-api";
import { MESSAGE_TYPES } from "src/lib/helpers/messages.helper";
import { promiseTuplify } from "src/lib/utils/promise.utils";
import { CALLBACK } from "src/service-worker/handlers/types";

export async function handleFetchSession(_: any, cb: CALLBACK) {
  try {
    let { ctnn_access_token } = await chrome.storage.session.get(["ctnn_access_token"]);
    let { ctnn_refresh_token } = await chrome.storage.local.get(["ctnn_refresh_token"]);

    if (!ctnn_access_token) {
      if (!ctnn_refresh_token) {
        return cb(null);
      }

      const [res, error] = await fetchExtensionRefreshToken(USERS_API_URL, ctnn_refresh_token);

      // ? Refresh token failed, session has expired
      if (error) {
        return cb([null, error]);
      }

      if (!res) {
        return cb([null, error]);
      }

      ctnn_refresh_token = res.refresh_token;

      await chrome.storage.local.set({ refresh_token: ctnn_refresh_token });

      ctnn_access_token = res.access_token;
    }

    const userRes = await fetchSelf(USERS_API_URL, ctnn_access_token);

    return cb(userRes);
  } catch (error) {
    console.log("Error in handle fetch session", error);
    cb(null);
  }
}

export async function handleLogin(
  data: { access_token: string; refresh_token: string },
  cb: CALLBACK
) {
  try {
    const { access_token, refresh_token } = data;

    await chrome.storage.local.set({ ctnn_refresh_token: refresh_token });
    await chrome.storage.session.set({ ctnn_access_token: access_token });

    const [user, error] = await fetchSelf(USERS_API_URL, access_token);

    if (error) {
      return cb([null, error]);
    }

    const alarm = chrome.alarms.create("init-refresh-token", {
      when: Date.now() + 1000 * 60 * 9,
    });

    return cb([user, null]);
  } catch (error) {
    console.log("Error in handle login", error);
    cb(null);
  }
}

export async function handleRefreshTokenAlarm() {
  const { ctnn_refresh_token } = await chrome.storage.session.get(["ctnn_refresh_token"]);

  const [res, error] = await promiseTuplify(
    fetchExtensionRefreshToken(USERS_API_URL, ctnn_refresh_token)
  );

  if (error) {
    return;
  }

  chrome.runtime.sendMessage({ type: MESSAGE_TYPES.LOGGED_IN, data: res });
}
