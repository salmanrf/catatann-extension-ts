interface Props {
  title: string;
  onClose(e: MouseEvent): void;
  onReset(e: MouseEvent): void;
  onMaximize(e: MouseEvent): void;
  onMouseDown(e: MouseEvent): void;
}

export function PopupHeader({ title, onClose, onMouseDown }: Props) {
  return (
    <header onMouseDown={onMouseDown}>
      <div className="ctnn-header-buttons">
        <div className="ctnn-h-btn ctnn-h-btn-close" onClick={onClose}></div>
        <div className="ctnn-h-btn ctnn-h-btn-reset"></div>
        <div className="ctnn-h-btn ctnn-h-btn-maximize"></div>
      </div>
      <div className="ctnn-popup-title">{title}</div>
    </header>
  );
}
