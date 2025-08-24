import { useEffect } from "react";

export function useEscClose(onEscPress, isActive = true) {
  useEffect(() => {
    if (!isActive) return;

    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onEscPress();
      }
    };

    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onEscPress, isActive]);
}
