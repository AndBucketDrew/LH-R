import { useEffect } from 'react';

/**
 * Executes a callback whenever Enter is pressed anywhere in the window
 * @param callback Function to execute on Enter key press
 */
const useEnter = (callback: () => void) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [callback]);
};

export default useEnter;