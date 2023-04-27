import { JSX } from "preact";
import { useEffect, useState } from "preact/hooks";
import { PopupHeader } from "src/content-script/components/PopupHeader";
import { useDraggable } from "src/content-script/hooks/useDraggable";

interface Props {
  onClose(e: MouseEvent): void;
  title: string;
  children: JSX.Element;
}

const initialStyles = {
  top: "50%",
  left: "50%",
};

export function Popup(props: Props) {
  const { position, onMouseDown } = useDraggable();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    return () => {
      setIsMounted(false);
    };
  }, []);

  function onReset() {
    console.log("RESET");
  }

  function onMaximize() {
    console.log("MAXIMIZE");
  }

  return (
    <div
      className="ctnn-popup"
      style={{
        top: position.top ? `${position.top}px` : initialStyles.top,
        left: position.left ? `${position.left}px` : initialStyles.left,
        transform:
          position.top || position.left
            ? `translate(-50%, -50%) scale(${isMounted ? 1 : 0})`
            : `translate(-50%, -50%) scale(${isMounted ? 1 : 0})`,
      }}
    >
      <PopupHeader
        onClose={props.onClose}
        onReset={onReset}
        onMaximize={onMaximize}
        onMouseDown={onMouseDown}
        title={props.title}
      />
      <main>{props.children}</main>
    </div>
  );
}
