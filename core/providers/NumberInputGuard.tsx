'use client';

import { useEffect } from 'react';

export function NumberInputGuard() {
  useEffect(() => {
    function handleWheel(e: Event) {
      const target = e.currentTarget as HTMLInputElement;
      target.blur();
    }

    function onFocus(e: FocusEvent) {
      const el = e.target as HTMLElement;
      if (el instanceof HTMLInputElement && el.type === 'number') {
        el.addEventListener('wheel', handleWheel);
      }
    }

    function onBlur(e: FocusEvent) {
      const el = e.target as HTMLElement;
      if (el instanceof HTMLInputElement && el.type === 'number') {
        el.removeEventListener('wheel', handleWheel);
      }
    }

    document.addEventListener('focus', onFocus, true);
    document.addEventListener('blur', onBlur, true);
    return () => {
      document.removeEventListener('focus', onFocus, true);
      document.removeEventListener('blur', onBlur, true);
    };
  }, []);

  return null;
}
