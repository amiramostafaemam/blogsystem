import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getBookmarkedPostIds, getLikedPostIds } from "../api/social";

const EMPTY = { liked: new Set(), bookmarked: new Set(), ready: false };

// Which of these posts the signed-in user has liked / bookmarked
export function usePostReactions(posts) {
  const { user } = useAuth();
  const [state, setState] = useState(EMPTY);
  const ids = posts.map((p) => p.id);
  const idsKey = ids.join(",");

  useEffect(() => {
    if (!user) {
      setState({ ...EMPTY, ready: true });
      return;
    }
    let ignore = false;
    const postIds = idsKey ? idsKey.split(",").map(Number) : [];
    Promise.all([getLikedPostIds(user.id, postIds), getBookmarkedPostIds(user.id, postIds)])
      .then(([liked, bookmarked]) => !ignore && setState({ liked, bookmarked, ready: true }))
      .catch(() => !ignore && setState({ ...EMPTY, ready: true }));
    return () => {
      ignore = true;
    };
  }, [user, idsKey]);

  return state;
}
