document.addEventListener("DOMContentLoaded", function () {
  const postsContainer = document.getElementById("posts-container");
  const paginationContainer = document.getElementById("pagination");
  const editModal = document.getElementById("edit-modal");
  const deleteModal = document.getElementById("delete-modal");
  const editTitle = document.getElementById("edit-title");
  const editBody = document.getElementById("edit-body");
  const saveButton = document.getElementById("save-button");
  const confirmDeleteButton = document.getElementById("confirm-delete-button");

  let posts = [];
  let selectedPost = null;
  let currentPage = 1;
  const postsPerPage = 5;

  // Fetch data from mock backend
  fetch("https://jsonplaceholder.typicode.com/posts")
    .then((response) => response.json())
    .then((data) => {
      posts = data;
      displayPosts();
      setupPagination();
    });

  // Display posts
  function displayPosts() {
    postsContainer.innerHTML = "";
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const currentPosts = posts.slice(startIndex, endIndex);

    currentPosts.forEach((post) => {
      const postElement = document.createElement("div");
      postElement.className = "post";
      postElement.innerHTML = `
        <h3>${post.title}</h3>
        <p>${post.body}</p>
        <button class="edit-button" onclick="editPost(${post.id})">Edit</button>
        <button class="delete-button" onclick="deletePost(${post.id})">Delete</button>
      `;
      postsContainer.appendChild(postElement);
    });
  }

  // Setup pagination
  function setupPagination() {
    paginationContainer.innerHTML = "";
    const totalPages = Math.ceil(posts.length / postsPerPage);

    for (let i = 1; i <= totalPages; i++) {
      const pageButton = document.createElement("button");
      pageButton.innerText = i;
      pageButton.className = i === currentPage ? "active" : "";
      pageButton.addEventListener("click", function () {
        currentPage = i;
        displayPosts();
        setupPagination();
      });
      paginationContainer.appendChild(pageButton);
    }
  }

  // Edit post
  window.editPost = function (postId) {
    selectedPost = posts.find((post) => post.id === postId);
    editTitle.value = selectedPost.title;
    editBody.value = selectedPost.body;
    openModal("edit-modal");
  };

  // Save changes
  saveButton.addEventListener("click", function () {
    if (selectedPost) {
      const updatedPost = {
        ...selectedPost,
        title: editTitle.value,
        body: editBody.value,
      };

      // Send updated data to mock backend
      fetch(`https://jsonplaceholder.typicode.com/posts/${selectedPost.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPost),
      })
        .then((response) => response.json())
        .then((data) => {
          // Update local posts array
          const index = posts.findIndex((post) => post.id === selectedPost.id);
          posts[index] = data;
          displayPosts();
          setupPagination();
          closeModal("edit-modal");
        });
    }
  });

  // Delete post
  window.deletePost = function (postId) {
    selectedPost = posts.find((post) => post.id === postId);
    openModal("delete-modal");
  };

  confirmDeleteButton.addEventListener("click", function () {
    if (selectedPost) {
      fetch(`https://jsonplaceholder.typicode.com/posts/${selectedPost.id}`, {
        method: "DELETE",
      }).then(() => {
        // Remove post from local posts array
        posts = posts.filter((post) => post.id !== selectedPost.id);
        displayPosts();
        setupPagination();
        closeModal("delete-modal");
      });
    }
  });

  // Open modal
  function openModal(modalId) {
    document.getElementById(modalId).style.display = "block";
  }

  // Close modal
  window.closeModal = function (modalId) {
    document.getElementById(modalId).style.display = "none";
  };
});
