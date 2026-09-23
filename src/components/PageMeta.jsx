import { useEffect } from "react";

const SITE = "Crema";
const DEFAULT_DESCRIPTION = "Crema is a calm place to write, read and share stories.";

// Sets the tab title and meta description for the current page
function PageMeta({ title, description = DEFAULT_DESCRIPTION }) {
  useEffect(() => {
    document.title = title ? `${title} · ${SITE}` : `${SITE} — stories brewed slowly`;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
  }, [title, description]);

  return null;
}

export default PageMeta;
