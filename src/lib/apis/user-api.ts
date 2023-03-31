// ! This variable can't be referenced from content script

import { CONFIG } from "src/lib/configs/config";
import { CustomError } from "src/lib/utils/CustomError";

// ! Therefore content script functions need to be self contained
export const USERS_API_URL = `${CONFIG.API_URL}/users`;

export async function fetchExtensionLogin(base_url: string) {
  try {
    const url = `${base_url}/extension-signin`;

    const res = await fetch(url, {
      credentials: "include",
    });

    const { errors, data } = await res.json();

    if (res.status !== 200) {
      const error = new CustomError(res.status, errors);

      throw error;
    }

    return data;
  } catch (error) {
    console.log("Error authenticating extension", error);

    throw error;
  }
}

export async function fetchExtensionRefreshToken(base_url: string, refresh_token: string) {
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

    return data;
  } catch (error) {
    throw error;
  }
}

export async function fetchSelf(base_url: string, access_token: string) {
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

    return data;
  } catch (error) {
    throw error;
  }
}
