import { fetchFindOneNote, fetchSearchNotes, fetchFindNotes } from "src/lib/apis/notes-api";
import { FindNotesDto } from "src/lib/types/notes.model";
import { CustomError } from "src/lib/utils/CustomError";
import { CALLBACK } from "src/service-worker/handlers/types";

export async function handleFetchOneNote(params: { note_id: string }, cb: CALLBACK) {
  try {
    const { note_id } = params;
    const { ctnn_access_token } = (await chrome.storage.session.get([
      "ctnn_access_token",
    ])) as Record<string, string>;

    if (!ctnn_access_token) {
      cb([null, new CustomError(401, ["you are not logged in"])]);
    }

    const data = await fetchFindOneNote(note_id, ctnn_access_token);

    return cb(data);
  } catch (error) {
    cb([null, error]);
  }
}

export async function handleSearchNotes(params: FindNotesDto, cb: CALLBACK) {
  try {
    const { ctnn_access_token } = (await chrome.storage.session.get([
      "ctnn_access_token",
    ])) as Record<string, string>;

    if (!ctnn_access_token) {
      cb([null, new CustomError(401, ["you are not logged in"])]);
    }

    const data = await fetchSearchNotes(params, ctnn_access_token);

    cb(data);
  } catch (error) {
    cb([null, error]);
  }
}

export async function handleFetchNotes(params: FindNotesDto, cb: CALLBACK) {
  try {
    const { ctnn_access_token } = await chrome.storage.session.get(["ctnn_access_token"]);

    if (!ctnn_access_token) {
      cb([null, new CustomError(401, ["you are not logged in"])]);
    }

    const data = await fetchFindNotes(params, ctnn_access_token);

    return cb(data);
  } catch (error) {
    cb([null, error]);
  }
}
