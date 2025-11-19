const loginForm = document.getElementById('loginForm');
const loginBtn = document.getElementById("loginBtn");
const btnText = document.getElementById("btnText");
const btnLoader = document.getElementById("btnLoader");
const errorMessage = document.getElementById("errorMessage");

function showLoading() {
    loginBtn.disabled = true;
    btnText.classList.add("hidden");
    btnLoader.classList.remove("hidden");
}

function hideLoading() {
    loginBtn.disabled = false;
    btnText.classList.remove("hidden");
    btnLoader.classList.add("hidden");
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove("hidden");
}

function hideError() {
    errorMessage.classList.add("hidden");
}

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideError()

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({email, password})
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Login failed");
        }

        const data = await response.json();
        localStorage.setItem("token",data.token);
        localStorage.setItem("userId", data.user._id);
        window.location.href = "/"

    } catch (error) {
        showError(error.message);
        hideLoading();
    }
});