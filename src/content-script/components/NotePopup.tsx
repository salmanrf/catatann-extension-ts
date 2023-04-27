import { useEffect, useState } from "preact/hooks";
import Markdown from "preact-markdown";
import { Popup } from "src/content-script/containers/Popup";
import { MESSAGE_TYPES } from "src/lib/helpers/messages.helper";
import { MessagingResponse } from "src/lib/types/api.model";
import { Note } from "src/lib/types/notes.model";

interface Props {
  onClose(): void;
  note_id: string;
}

export function NotePopup({ note_id, onClose }: Props) {
  const [errorMessages, setErrorMessages] = useState("");
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState<Note | null>(null);

  useEffect(() => {
    fetchNote(note_id);
  }, [note_id]);

  async function fetchNote(note_id: string) {
    try {
      const [note, error]: MessagingResponse<Note> = await chrome.runtime.sendMessage({
        type: MESSAGE_TYPES.FIND_ONE_NOTE,
        data: { note_id },
      });

      if (error) {
        setErrorMessages(error.errors ? error.errors[0] : error.message);
        return;
      } else {
        setErrorMessages("");
      }

      if (!note) {
        setErrorMessages("Can't find note.");

        return;
      }

      setNote(note);
    } catch (error) {
      setErrorMessages((error as Error).message);
    }
  }

  return (
    <Popup onClose={onClose} title={loading ? "Loading..." : (note || { title: "" }).title}>
      <div className="ctnn-note">
        {note && (
          // @ts-ignore
          <Markdown markdown={note.content} />
        )}
        {errorMessages && <div className="ctnn-err-msg-container">{errorMessages}</div>}
      </div>
    </Popup>
  );
}
