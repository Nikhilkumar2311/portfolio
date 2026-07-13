import { useEffect, useCallback } from 'react';

/**
 * Hook to handle clipboard paste events for image files.
 * Calls the provided callback with pasted image files.
 */
export function useClipboardPaste(onPaste: (files: File[]) => void, enabled = true) {
  const handlePaste = useCallback(
    (e: ClipboardEvent) => {
      if (!enabled) return;
      const items = e.clipboardData?.items;
      if (!items) return;

      const files: File[] = [];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === 'file') {
          const file = item.getAsFile();
          if (file) files.push(file);
        }
      }

      if (files.length > 0) {
        e.preventDefault();
        onPaste(files);
      }
    },
    [onPaste, enabled]
  );

  useEffect(() => {
    if (!enabled) return;
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [handlePaste, enabled]);
}
