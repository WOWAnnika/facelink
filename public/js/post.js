const listPosts = document.getElementById('postList');
async function getAllPosts() {
    const response = await fetch('/api/posts');
    const data = await response.json();

    data.forEach((post) => {
        const div = document.createElement('div');
        div.classList.add("post-card");

        div.innerHTML = `
        <p>${post.text}</p>
        <p>${post.user_id.name}</p>
        <p>${new Date(post.timestamp).toLocaleString()}</p>
        
        `;
        listPosts.appendChild(div);
    });
}
getAllPosts();