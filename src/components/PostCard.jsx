// PostCard.jsx
import {
  Card,
  CardContent,
  Typography,
  CardMedia,
  IconButton,
  Stack,
  Avatar,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";


function PostCard({
  id,
  title,
  description,
  image,
  author,
  createdAt,
  onDelete = () => {},
  currentUser,
  darkMode,
}) {
  const navigate = useNavigate();

  const isAuthor =
    typeof author === "string"
      ? author === currentUser
      : author?.name === currentUser;

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

  // ثيم الألوان حسب الوضع
  const cardBg = darkMode ? "#6D2932" : "#fff";
  const cardText = darkMode ? "#E8D8C4" : "#561C24";
  const cardShadow = darkMode
    ? "0 4px 12px rgba(0,0,0,0.3)"
    : "0 4px 10px rgba(0,0,0,0.1)";
  const dateColor = darkMode ? "#C7B7A3" : "#6D2932";
  const iconColor = darkMode ? "#E8D8C4" : "#561C24";
  const iconHover = darkMode ? "#C7B7A3" : "#A57260";

  return (
    <Card
      sx={{
        backgroundColor: cardBg,
        color: cardText,
        borderRadius: 4,
        boxShadow: cardShadow,
        width: "100%",
        maxWidth: 600,
        mx: "auto",
        mb: 4,
        transition: "all 0.3s ease",
        overflow: "hidden",
      }}
    >
      {image && (
        <CardMedia
          component="img"
          height="250"
          image={image}
          alt={title}
          sx={{
            objectFit: "cover",
          }}
        />
      )}

      <CardContent>
        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
          <Avatar
            src={author?.profileImage || ""}
            alt={author?.name || "User"}
            sx={{ width: 45, height: 45 }}
          />
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              sx={{ wordBreak: "break-word" }}
            >
              {author?.name || "Anonymous"}
            </Typography>
            {formattedDate && (
              <Typography
                variant="caption"
                sx={{ color: dateColor, display: "block", opacity: 0.7 }}
              >
                {formattedDate}
              </Typography>
            )}
          </Box>
        </Stack>

        <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontWeight: "bold",
            letterSpacing: 0.5,
            mb: 1,
            color: cardText,
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            opacity: 0.9,
            lineHeight: 1.6,
            whiteSpace: "pre-line",
          }}
        >
          {description}
        </Typography>

        {isAuthor && (
          <Stack direction="row" spacing={1} mt={2}>
            <Tooltip title="Edit">
              <IconButton
                onClick={() => navigate(`/edit/${id}`)}
                sx={{
                  color: iconColor,
                  "&:hover": { color: iconHover },
                }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete">
              <IconButton
                onClick={() => onDelete(id)}
                sx={{
                  color: iconColor,
                  "&:hover": { color: iconHover },
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}

export default PostCard;
