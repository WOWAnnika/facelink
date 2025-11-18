console.log("HER ER JAVASCRIPT")

document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({email, password})
        });

        if (response.ok) {
            console.log("test")

            const data = await response.json();
            localStorage.setItem("token",data.token);

            localStorage.setItem("userId", data.user._id);


            window.location.href = "/"
        } else {
            console.log("NOT GOOD");
        }
    } catch (error) {
        console.log("also no good");
    }
});