import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPost, updatePost } from "../api/posts";
import { useAuth } from "../context/AuthContext";
import { useNotify } from "../context/NotifyContext";
import PostEditor from "../components/editor/PostEditor";
import PageMeta from "../components/PageMeta";
import { PageLoader } from "../components/RouteGuards";

function EditPost() {
  const { id } = useParams();
  const { user } = useAuth();
  const notify = useNotify();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  useEffect(() => {
    let ignore = false;
    getPost(id)
      .then((data) => {
        if (ignore) return;
        if (data.user_id !== user.id) {
          notify("You can only edit your own stories", "warning");
          navigate("/explore", { replace: true });
          return;
        }
        setPost(data);
      })
      .catch(() => {
        if (ignore) return;
        notify("Story not found", "error");
        navigate("/dashboard", { replace: true });
      });
    return () => {
      ignore = true;
    };
  }, [id, user.id, navigate, notify]);

  const handleSave = async (values, status) => {
    try {
      await updatePost(id, { ...values, status });
      setPost((prev) => ({ ...prev, ...values, status }));
      if (status === "published") {
        notify(post.status === "published" ? "Story updated" : "Your story is live!");
        navigate(`/posts/${id}`);
      } else {
        notify(post.status === "published" ? "Moved back to drafts" : "Draft saved");
      }
    } catch (err) {
      notify(err.message || "Couldn't save changes", "error");
    }
  };

  if (!post) return <PageLoader />;

  return (
    <>
      <PageMeta title={`Editing: ${post.title}`} />
      <PostEditor
        key={post.id}
        initialValues={{ title: post.title, content: post.content, image: post.image ?? "", tags: post.tags ?? [] }}
        currentStatus={post.status}
        onSave={handleSave}
        onCancel={() => navigate(-1)}
      />
    </>
  );
}

export default EditPost;
