document.addEventListener("DOMContentLoaded", function () {
  const postsContainer = document.getElementById("posts-container");
  const paginationContainer = document.getElementById("pagination");
  const editTitle = document.getElementById("edit-title");
  const editBody = document.getElementById("edit-body");
  const saveButton = document.getElementById("save-button");
  const confirmDeleteButton = document.getElementById("confirm-delete-button");
  const createPostButton = document.getElementById("create-post-button");

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
    console.log(postId);
    if (postId > 100) {
      alert(
        "You are not authorized to edit this post due to limitations in the mock backend environment. This restriction is part of the testing setup and does not reflect real-world permissions."
      );
    } else {
      selectedPost = posts.find((post) => post.id === postId);
      editTitle.value = selectedPost.title;
      editBody.value = selectedPost.body;
      openModal("edit-modal");
    }
  };

  // Save changes
  saveButton.addEventListener("click", function () {
    if (selectedPost) {
      // declare updated post
      let updatedPost;
      updatedPost = {
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

  // Create new post
  createPostButton.addEventListener("click", function () {
    openModal("create-modal");

    document.getElementById("add-post-button").addEventListener("click", () => {
      document.getElementById("add-post-button").disabled = true;
      const newPost = {
        title: document.getElementById("create-title").value,
        body: document.getElementById("create-body").value,
        userId: 1,
        uniqueId: Math.floor(Math.random() * 100000000000),
      };

      fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPost),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("could not create post due to error");
          } else {
            return response.json();
          }
        })
        .then((data) => {
          console.log(data);
          posts.unshift(data); // Add new post to the beginning of the array
        })
        .catch((error) => {
          console.error(error.message);
        })
        .finally(() => {
          // clear fields
          // closeModal("create-modal");
          document.getElementById("add-post-button").disabled = false;
          displayPosts();
          setupPagination();
        });
    });
  });

  // Open modal
  function openModal(modalId) {
    document.getElementById(modalId).style.display = "block";
  }

  // Close modal
  window.closeModal = function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
  };
});
