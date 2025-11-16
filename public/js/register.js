document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (name.length < 2) return alert("skal være mere end 2 tegn");
    if (password.length < 6) return alert("skal være mere end 6 tegn");

    try {
        const reponse = await fetch("/api/users", {
            method: "POST",
            headers: {"content-type": "application/json"},
            body: JSON.stringify({name, email, password})
        });

        if (reponse.ok) {
            alert("bruger oprettet :)")
            window.location.href = "/login";
        } else {
            const error = await reponse.json();
            alert("no good" + error.error);
        }
    } catch (error) {
        alert(error.message);
    }
});