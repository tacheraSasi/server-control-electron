import { useEffect } from "react";

export const setAppTitle = (newTitle = "ekilie") => {
    useEffect(() => {
      document.title = newTitle; // Update the page title
    }, [newTitle]); // The title will update whenever newTitle changes
    console(document.title)
};
  