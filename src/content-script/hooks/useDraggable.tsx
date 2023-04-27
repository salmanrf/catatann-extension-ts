import { useState } from "preact/hooks";

interface DraggableState {
  position: { top: number; left: number };
  onMouseDown(e: MouseEvent): void;
}

export function useDraggable(): DraggableState {
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);
  const [position, setPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  function onMouseMove(e: MouseEvent) {
    if (e.buttons === 0) {
      window.removeEventListener("mousemove", onMouseMove);

      setLastX(0);
      setLastY(0);

      return;
    }

    const distX = e.clientX - lastX;
    const distY = e.clientY - lastY;

    setLastX(e.clientX);
    setLastY(e.clientY);

    setPosition(() => ({
      top: distY,
      left: distX,
    }));
  }

  function onMouseDown(e: MouseEvent) {
    e.preventDefault();

    if (e.button === 0) {
      setLastX(e.clientX);
      setLastY(e.clientY);

      window.addEventListener("mousemove", onMouseMove);
    }
  }

  return { position, onMouseDown };
}
