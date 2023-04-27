import { CONFIG } from "src/lib/configs/config";
import { ApiResponse, MessagingResponse } from "src/lib/types/api.model";
import { CreateNoteDto, FindNotesDto, Note } from "src/lib/types/notes.model";
import { PaginatedData } from "src/lib/types/pagination.model";
import { CustomError } from "src/lib/utils/CustomError";

export const NOTES_API_URL = `${CONFIG.API_URL}/notes`;

export async function fetchCreateNote(
  note: CreateNoteDto,
  access_token: string
): Promise<MessagingResponse<Note>> {
  try {
    const res = await fetch(NOTES_API_URL, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(note),
    });

    const { errors, data }: ApiResponse<Note> = await res.json();

    if (res.status !== 200) {
      const error = new CustomError(res.status, errors as string[]);

      throw error;
    }

    return [data, null];
  } catch (error) {
    return [null, error as CustomError];
  }
}

export async function fetchFindOneNote(
  note_id: string,
  access_token: string
): Promise<MessagingResponse<Note>> {
  try {
    const res = await fetch(`${NOTES_API_URL}/${note_id}`, {
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
    throw [null, error];
  }
}

export async function fetchSearchNotes(
  params: FindNotesDto & Record<string, any>,
  access_token: string
): Promise<MessagingResponse<PaginatedData<Note>>> {
  try {
    const searchParams = new URLSearchParams(params);

    const res = await fetch(`${NOTES_API_URL}/search/?${searchParams.toString()}`, {
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
    throw [null, error];
  }
}

export async function fetchFindNotes(
  params: FindNotesDto & Record<string, any>,
  access_token: string
): Promise<MessagingResponse<PaginatedData<Note>>> {
  try {
    const searchParams = new URLSearchParams(params);

    const res = await fetch(`${NOTES_API_URL}/?${searchParams.toString()}`, {
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
    throw [null, error];
  }
}
