const userName = document.getElementById("userName");
const postCount = document.getElementById("postCount");
const userPosts = document.getElementById("userPosts");
const errorMessage = document.getElementById("errorMessage");

const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");

if (!token || !userId) {
    window.location.href = "/login";
}

async function getUserProfile() {
    try {
        const response = await fetch(`/api/users/${userId}`);

        if (!response.ok) {
            throw new Error("Could not fetch user data");
        }

        const user = await response.json();

        userName.textContent = user.name;
        postCount.textContent = `${user.posts.length} posts`;

    } catch (error) {
        errorMessage.textContent = "Could not load profile";
    }
}

async function getUserPost() {
    try {
        const response = await fetch(`/api/users/${userId}/posts`);

        if (!response.ok) {
            throw new Error("Could not fetch posts");
        }

        const posts = await response.json();
        userPosts.innerHTML = "";

        if (posts.length === 0) {
            userPosts.innerHTML = '<p class="no-posts">No posts created</p>';
            return;
        }

        posts.forEach(post => {
            const div = document.createElement("div");
            div.classList.add("post-card");
            div.innerHTML = `
            ${post.image ? (`<img src="${post.image}" alt="image" class="post-image"/>`) : ("")}
            
            <p class="post-text">${post.text}</p>
            <p class="post-timestamp">${new Date(post.timestamp).toLocaleString()}</p>
            <button class="delete-btn" data-id="${post._id}">Slet</button>
            `;
            userPosts.appendChild(div);
        });
    } catch(error) {
        errorMessage.textContent = "Could not fetch posts";
    }
}

userPosts.addEventListener("click", async (e) => {
    //sørger for koden nedenunder kun bliver activeret af buttons der har class "delete-btn"
    if (!e.target.classList.contains("delete-btn")) return;

    //her henter vi id fra den button vi lige trykket på, og der har vi gemt vores posts id.
    const postId = e.target.dataset.id;

    //lil check for være sikker på folk er logget ind, men tbh burde de slet ikke kunne se nogen delete knapper hvis ikke logget ind
    const token = localStorage.getItem("token");
    if (!token) return alert("Du skal være logget ind");

    //sender vores request til backend
    try {
        const response = await fetch(`/api/posts/${postId}`, {
            method: "DELETE",
            //token sendt også for værer sikker på du faktisk ejer den post du prøver slette
            headers: { "Authorization": "Bearer " + token }
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error);
        }

        alert("Post slettet");

        //opdatere listen efter slettet
        getUserPost();
    } catch (error) {
        console.error(error);
        // alert(error.message);
    }
});

getUserProfile();
getUserPost();