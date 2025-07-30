import { useEffect } from "react";

export function usePageTitle(title: string) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;
    
    // Cleanup function to restore previous title if needed
    return () => {
      // Don't restore title on cleanup as we want the new title to persist
    };
  }, [title]);
}