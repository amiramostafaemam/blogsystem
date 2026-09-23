import { useNavigate } from "react-router-dom";
import { createPost } from "../api/posts";
import { useNotify } from "../context/NotifyContext";
import PostEditor from "../components/editor/PostEditor";
import PageMeta from "../components/PageMeta";

function WritePost() {
  const notify = useNotify();
  const navigate = useNavigate();

  const handleSave = async (values, status) => {
    try {
      const { id } = await createPost({ ...values, status });
      if (status === "published") {
        notify("Your story is live!");
        navigate(`/posts/${id}`);
      } else {
        notify("Draft saved");
        navigate(`/edit/${id}`, { replace: true });
      }
    } catch (err) {
      notify(err.message || "Couldn't save your story", "error");
    }
  };

  return (
    <>
      <PageMeta title="Write a story" />
      <PostEditor onSave={handleSave} onCancel={() => navigate(-1)} />
    </>
  );
}

export default WritePost;
