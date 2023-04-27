import { CONFIG } from "src/lib/configs/config";
import { MessagingResponse } from "src/lib/types/api.model";
import { ExtensionLoginResponse, User } from "src/lib/types/users.model";
import { CustomError } from "src/lib/utils/CustomError";

// ! Content script functions can't refer to variables outside of it's scope
export const USERS_API_URL = `${CONFIG.API_URL}/users`;

export async function fetchExtensionLogin(base_url: string): Promise<MessagingResponse<User>> {
  try {
    const url = `${base_url}/extension-signin`;

    const res = await fetch(url, {
      credentials: "include",
    });

    const { errors = [], data } = await res.json();

    if (res.status !== 200) {
      // ? This function is called from content script, therefore has no reference to CustomError class
      return [null, { name: "custom", code: res.status, errors, message: "" }];
    }

    return [data, null];
  } catch (error) {
    throw error;
  }
}

export async function fetchExtensionRefreshToken(
  base_url: string,
  refresh_token: string
): Promise<MessagingResponse<ExtensionLoginResponse>> {
  try {
    const url = `${base_url}/extension-refresh`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh_token,
      }),
    });

    const { errors, data } = await res.json();

    if (res.status !== 200) {
      const error = new CustomError(res.status, errors);

      throw error;
    }

    return [data, null];
  } catch (error) {
    return [null, error as CustomError];
  }
}

export async function fetchSelf(
  base_url: string,
  access_token: string
): Promise<MessagingResponse<User>> {
  const url = `${base_url}/self`;

  try {
    const res = await fetch(url, {
      credentials: "omit",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const { errors, data } = await res.json();

    if (res.status !== 200) {
      const error = new CustomError(res.status, errors);

      throw error;
    }

    return [data, null];
  } catch (error) {
    return [null, error as CustomError];
  }
}
