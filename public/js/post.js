const listPosts = document.getElementById('postList');
const postForm = document.getElementById('postForm');
const postInput = document.getElementById('postInput');
const postImage = document.getElementById('postImage');
const messageBox = document.getElementById('postMessage');

//henter alle lavet posts
async function getAllPosts() {
    try {
        //linje der henter dem, GET route
        const response = await fetch('/api/posts');
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();

        //vigtig, rydder de gamle posts når der bliver tilføjet nye. Så man ikke får dobbelt op
        listPosts.innerHTML = "";

        //hvis der ikke er nogen posts
        if (data.length === 0) {
            messageBox.textContent = 'Ingen posts lavet endnu, vær den første!';
            return;
        }
        messageBox.textContent = "";

        const currentUserId = localStorage.getItem("userId");

        //loop
        data.forEach((post) => {

            //laver en div
            const div = document.createElement('div');
            //giver en class, så vi kan lave css med den
            div.classList.add("post-card");
            div.innerHTML = `
<!--            hvis billedet findes lav img alt og sådan, hvis ikke så bare tomt ""-->
<!--            ? hvis findes, : ellers-->
                ${post.image ? `<img src="${post.image}" alt="Post image" class="post-image"/>` : ""}
                <p class="post-text">${post.text}</p>
                <p class="post-user">${post.user_id.name}</p>
                <p class="post-timestamp">${new Date(post.timestamp).toLocaleString()}</p>
<!--            En delete knap man kun burde kunne se hvis det er ens egen post, gemmer også post id her, henter det herfra når vi skal slet posten-->
                ${post.user_id._id === currentUserId ? `<button class="delete-btn" data-id="${post._id}">Slet</button>` : ""}
                <button class="like-btn" data-id="${post._id}">Likes: ${post.likes}</button>
            `;
            // tilføjes DOM-element?? til HTML'en
            listPosts.appendChild(div);
        });
    } catch (error) {
        //consol besked og frontend besked
        console.error("Fejl ved hentning af posts:", error);
        messageBox.textContent = "Fejl ved hentning af posts.";
    }
}

postForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    //trimmer input og tjekker det ikke tomt
    const text = postInput.value.trim();
    if (!text) return alert("Post kan ikke være tom!");

    //Bruger formData da vi bruger både tekst og billede
    //bruger Multer til vores billede, Multer kan ikke arbejde med JSON. billede skulle konvertes til base64
    const formData = new FormData();
    formData.append("text", text);
    //tjekker lige vi har et billede
    if (postImage.files.length > 0) formData.append("image", postImage.files[0]);

    try {
        //prøver lavet et billede med hvad vi sender, kører function lige nede under
        await createPost(formData);
    } catch (error) {
        console.error("Fejl ved oprettelse af post:", error);
        //måske lav noget her der ikke bare er en alert
        alert(error.message);
    }
});


async function createPost(formData) {
    //henter den token der blev sat inde i login.js
    const token = localStorage.getItem("token");
    //burde nok fjerne den der alert xd og ændre til console.log nu
    if (!token) return alert("Hvor er token?");

    //POST request med vores token og formdata
    const response = await fetch("/api/users/posts", {
        method: "POST",
        headers: { "Authorization": "Bearer " + token },
        //ikke sætte content type når formdata, tænker fordi flere content types
        body: formData
    });


    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Fejl ved oprettelse af post");
    }

    const data = await response.json();
    console.log("Post oprettet", data);
    //ryder lige vores input felter
    postInput.value = "";
    postImage.value = "";
    //sørge for ny post bliver loaded
    getAllPosts();
}

//DETTE ER TIL LIKES
listPosts.addEventListener("click", async (e) => {
    if (!e.target.classList.contains("like-btn")) return;

    const postId = e.target.dataset.id;
    const token = localStorage.getItem("token");
    if (!token) return alert("Du skal være logget ind");

    try {
        const response = await fetch(`/api/posts/${postId}/like`, {
            method: "POST",
            headers: {"Authorization": "Bearer " + token },
        });
        const data = await response.json();
        getAllPosts();
    } catch (err) {
        console.error("Fejl ved like btn", err);
    }
})

//TIL AT SLETTE MED. DELETE KNAPPEN
listPosts.addEventListener("click", async (e) => {
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
        getAllPosts();
    } catch (error) {
        console.error(error);
        // alert(error.message);
    }
});

//sørger for posts altid loaded når man åbner siden
getAllPosts();