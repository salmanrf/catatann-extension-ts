import { useState } from "preact/hooks";
import { SuggestedInput } from "src/content-script/components/SuggestedInput";
import { Popup } from "src/content-script/containers/Popup";
import { MESSAGE_TYPES } from "src/lib/helpers/messages.helper";
import { MessagingResponse } from "src/lib/types/api.model";
import { Note, SearchNotesDto } from "src/lib/types/notes.model";
import { PaginatedData } from "src/lib/types/pagination.model";

interface Props {
  onClose(): void;
  openNotePopup(note_id: string): void;
}

const searchParams: SearchNotesDto = {
  limit: 15,
  page: 1,
  sort_field: "title",
  sort_order: "ASC",
  keyword: "",
};

export function MainMenuPopup({ openNotePopup, onClose }: Props) {
  const [errorMessages, setErrorMessages] = useState("");

  async function genNoteOptionLoader(
    keyword: string,
    cb: (options: { label: string; value: string }[]) => void
  ) {
    try {
      const [res, error]: MessagingResponse<PaginatedData<Note>> = await chrome.runtime.sendMessage(
        {
          type: MESSAGE_TYPES.SEARCH_NOTES,
          data: { ...searchParams, keyword },
        }
      );

      console.log("res", res);
      console.log("error", error);

      if (error) {
        setErrorMessages(error.errors ? error.errors[0] : error.message);
        return cb([]);
      } else {
        setErrorMessages("");
      }

      const { items } = res!;

      if (!items) {
        return cb([]);
      }

      cb(items.map(({ note_id, title }) => ({ label: title, value: note_id })));
    } catch (error) {
      console.log("Couldn't fetch notes", error);
    }
  }

  function onNoteSelected(selected: { label: string; value: string }) {
    openNotePopup(selected.value);
  }

  return (
    <Popup onClose={onClose} title="My Notes">
      <div id="ctnn-main-menu">
        <SuggestedInput className="" loadOptions={genNoteOptionLoader} onSelect={onNoteSelected} />
        {errorMessages && <div className="ctnn-err-msg-container">{errorMessages}</div>}
      </div>
    </Popup>
  );
}
