const listPosts = document.getElementById('postList');
const postForm = document.getElementById('postForm');
const postInput = document.getElementById('postInput');
const postImage = document.getElementById('postImage');

async function getAllPosts() {
    try {
        const response = await fetch('/api/posts');
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();

        listPosts.innerHTML = "";
        data.forEach((post) => {
            const div = document.createElement('div');
            div.classList.add("post-card");
            div.innerHTML = `
                ${post.image ? `<img src="${post.image}" alt="Post image" class="post-image"/>` : ""}
                <p class="post-text">${post.text}</p>
                <p class="post-user">${post.user_id.name}</p>
                <p class="post-timestamp">${new Date(post.timestamp).toLocaleString()}</p>
            `;
            listPosts.appendChild(div);
        });
    } catch (error) {
        console.error("Fejl ved hentning af posts:", error);
    }
}

postForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = postInput.value.trim();
    if (!text) return alert("Post kan ikke være tom!");

    const formData = new FormData();
    formData.append("text", text);
    if (postImage.files.length > 0) formData.append("image", postImage.files[0]);

    try {
        await createPost(formData);
    } catch (error) {
        console.error("Fejl ved oprettelse af post:", error);
        alert(error.message);
    }
});
async function createPost(formData) {
    const token = localStorage.getItem("token");
    if (!token) return alert("Hvor er token?");

    const response = await fetch("/api/users/posts", {
        method: "POST",
        headers: { "Authorization": "Bearer " + token },
        body: formData
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Fejl ved oprettelse af post");
    }

    const data = await response.json();
    console.log("Post oprettet", data);
    postInput.value = "";
    postImage.value = "";
    getAllPosts();
}

getAllPosts();