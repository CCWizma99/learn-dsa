import { useEffect, useCallback } from 'react';

export function useKeyboard(keyMap) {
  const handleKeyDown = useCallback(
    (event) => {
      const key = event.key;
      const isMod = event.metaKey || event.ctrlKey;

      for (const [combo, handler] of Object.entries(keyMap)) {
        if (combo === 'ArrowLeft' && key === 'ArrowLeft' && !isMod) {
          event.preventDefault();
          handler();
          return;
        }
        if (combo === 'ArrowRight' && key === 'ArrowRight' && !isMod) {
          event.preventDefault();
          handler();
          return;
        }
        if (combo === 'Mod+k' && key === 'k' && isMod) {
          event.preventDefault();
          handler();
          return;
        }
        if (combo === 'Escape' && key === 'Escape') {
          event.preventDefault();
          handler();
          return;
        }
        if (combo === 'Enter' && key === 'Enter') {
          handler();
          return;
        }
        if (combo === 'ArrowUp' && key === 'ArrowUp') {
          event.preventDefault();
          handler();
          return;
        }
        if (combo === 'ArrowDown' && key === 'ArrowDown') {
          event.preventDefault();
          handler();
          return;
        }
      }
    },
    [keyMap]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
