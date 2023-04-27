import { useEffect, useState } from "preact/hooks";
import { MainMenuPopup } from "src/content-script/components/MainMenuPopup";
import { NotePopup } from "src/content-script/components/NotePopup";
import "src/content-script/styles/content.scss";
import { Popup } from "src/lib/types/popup.model";

function ContentPopup() {
  const [showMainMenu, setShowMainMenu] = useState(false);
  const [popups, setPopups] = useState<Popup<{ note_id: string }>[]>([]);

  useEffect(() => {
    document.addEventListener("keydown", toggleMainMenu);

    return () => {
      document.removeEventListener("keydown", toggleMainMenu);
    };
  }, []);

  function toggleMainMenu(event: KeyboardEvent) {
    if (event.ctrlKey && event.altKey && event.key === "n") {
      setShowMainMenu((prev) => !prev);
    }
  }

  function openNotePopup(note_id: string) {
    setPopups((prev) => [
      ...prev,
      {
        popup_id: note_id + `${Math.floor(Math.random() * 1000)}`,
        type: "note",
        parameter: { note_id },
      },
    ]);
  }

  function closeNotePopup(popup_id: string) {
    setPopups((prev) => {
      const temp = [...prev].filter((popup) => popup.popup_id != popup_id);

      return temp;
    });
  }

  return (
    <div id={"ctnn-popup-container"}>
      {showMainMenu && (
        <MainMenuPopup onClose={() => setShowMainMenu(false)} openNotePopup={openNotePopup} />
      )}
      {popups.map(({ popup_id, parameter }) => (
        <NotePopup
          onClose={() => closeNotePopup(popup_id)}
          key={popup_id}
          note_id={parameter.note_id}
        />
      ))}
    </div>
  );
}

export const ContentPopupContainer = <ContentPopup />;
