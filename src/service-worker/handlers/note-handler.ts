import { fetchFindOneNote, fetchSearchNotes, fetchFindNotes } from "src/lib/apis/notes-api";
import { FindNotesDto } from "src/lib/types/notes.model";
import { CALLBACK } from "src/service-worker/handlers/types";

export async function handleFetchOneNote(params: { note_id: string }, cb: CALLBACK) {
  try {
    const { note_id } = params;
    const { ctnn_access_token } = (await chrome.storage.session.get([
      "ctnn_access_token",
    ])) as Record<string, string>;

    const data = await fetchFindOneNote(note_id, ctnn_access_token);

    return cb(data);
  } catch (error) {
    console.log("Error in handle fetch session", error);
    cb(null);
  }
}

export async function handleSearchNotes(params: FindNotesDto, cb: CALLBACK) {
  try {
    const { ctnn_access_token } = (await chrome.storage.session.get([
      "ctnn_access_token",
    ])) as Record<string, string>;

    const data = await fetchSearchNotes(params, ctnn_access_token);
  } catch (error) {
    console.log("Error in handle fetch session", error);
    cb(null);
  }
}

export async function handleFetchNotes(params: FindNotesDto, cb: CALLBACK) {
  try {
    const { ctnn_access_token } = await chrome.storage.session.get(["ctnn_access_token"]);

    const data = (await fetchFindNotes(params, ctnn_access_token)) as Record<string, string>;

    return cb(data);
  } catch (error) {
    console.log("Error in handle fetch session", error);
    cb(null);
  }
}
