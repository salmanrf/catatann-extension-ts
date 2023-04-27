import { fetchExtensionLogin, USERS_API_URL } from "src/lib/apis/user-api";
import { CONFIG } from "src/lib/configs/config";
import { MESSAGE_TYPES } from "src/lib/helpers/messages.helper";
import { ExtensionLoginResponse, User } from "src/lib/types/users.model";
import { CustomError } from "src/lib/utils/CustomError";

export async function startAuthFlow(): Promise<User | null> {
  try {
    // ? Attempt to fetchSelf with previously stored tokens
    const fetchUserRes = await chrome.runtime.sendMessage({ type: MESSAGE_TYPES.FETCH_SELF });

    if (fetchUserRes) {
      const { user } = fetchUserRes;

      if (user && user.user_id) {
        return user;
      }
    }

    // ? Get the first open Client App tab
    const tab = await findClientAppTab();
    // ? Attempt to fetch new refresh token using refresh token stored in Client App
    const [res, error] = await authenticateFromClientApp(tab);

    // ? Unable to authenticate through Client App, finish
    if (error) {
      return null;
    }

    // ? Authentication through Client App success, emit login event, resulting in user
    const { user }: { user: User } = await chrome.runtime.sendMessage({
      type: MESSAGE_TYPES.LOGGED_IN,
      data: res,
    });

    return user;
  } catch (error) {
    throw error;
  }
}

export async function findClientAppTab() {
  const clientAppTabs = await chrome.tabs.query({
    url: [`${CONFIG.CLIENT_APP_URL}/*`],
  });

  if (clientAppTabs.length > 0) {
    return clientAppTabs[0];
  }

  return createClientAppTab();
}

export async function createClientAppTab(options = {}) {
  const tab = await chrome.tabs.create({
    active: false,
    url: CONFIG.CLIENT_APP_URL,
    ...options,
  });

  return tab;
}

async function authenticateFromClientApp(
  clientAppTab: chrome.tabs.Tab
): Promise<[ExtensionLoginResponse, CustomError]> {
  try {
    const res = await chrome.scripting.executeScript({
      target: { tabId: clientAppTab.id! },
      func: fetchExtensionLogin as any,
      args: [USERS_API_URL],
    });

    console.log("authenticate from client app result", res);

    return res[0].result;
  } catch (error) {
    console.log("error at authenticate", error);

    throw error;
  }
}
