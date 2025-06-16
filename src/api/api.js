const BASE_URL = "http://localhost:4000"; 

// Login
export async function loginUser(credentials) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  return res.json();
}

// Register
export async function registerUser(userData) {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...userData,
      profileImage: userData.profileImage || "https://i.pravatar.cc/150?img=3", // Default image
      role: "user",
      isActive: true,
    }),
  });

  if (!res.ok) {
    throw new Error("Registration failed");
  }

  return res.json();
}

// Get all posts
export async function getPosts() {
  const res = await fetch(`${BASE_URL}/posts`);
  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }
  return res.json();
}

// Add a new post
export async function addPost(postData, token) {
  const res = await fetch(`${BASE_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(postData),
  });

  if (!res.ok) throw new Error("Failed to add post");
  return res.json();
}

// Update a post
export async function updatePost(id, data, token) {
  const res = await fetch(`${BASE_URL}/posts/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to update post");
  return res.json();
}

// Delete a post
export async function deletePost(id, token) {
  const res = await fetch(`${BASE_URL}/posts/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to delete post");
}

// Error handling for fetching posts
export async function getUserPosts(username) {
  const res = await fetch(
    `${BASE_URL}/posts?author.name=${encodeURIComponent(username)}`
  );
  if (!res.ok) {
    throw new Error("Failed to fetch user posts");
  }
  return res.json();
}

// Update profile image
export async function updateUserProfileImage(userId, newImage, token) {
  const res = await fetch(`${BASE_URL}/users/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ profileImage: newImage }),
  });

  if (!res.ok) {
    throw new Error("Failed to update profile image");
  }

  return res.json();
}

// Get user by ID
export async function getUserById(userId, token) {
  const res = await fetch(`${BASE_URL}/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user data");
  }

  return res.json();
}
