const registerForm = document.getElementById('registerForm');
const registerBtn = document.getElementById("registerBtn");
const btnText = document.getElementById("btnText");
const btnLoader = document.getElementById("btnLoader");
const errorMessage = document.getElementById("errorMessage");

function showLoading(){
    registerBtn.disabled = true;
    btnText.classList.add("hidden");
    btnLoader.classList.remove("hidden");
}

function hideLoading(){
    registerBtn.disabled = false;
    btnText.classList.remove("hidden");
    btnLoader.classList.add("hidden");
}

function showError(message){
    errorMessage.textContent = message;
    errorMessage.classList.remove("hidden");
    errorMessage.className = "error";
}

function hideError(){
    errorMessage.classList.add("hidden");
}

registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideError();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (name.length < 2) return alert("skal være mere end 2 tegn");
    if (password.length < 6) return alert("skal være mere end 6 tegn");

    showLoading();

    try {
        const response = await fetch("/api/users", {
            method: "POST",
            headers: {"content-type": "application/json"},
            body: JSON.stringify({name, email, password})
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Could not create user");
        }

        // const data = await response.json();

        errorMessage.textContent = "User created :)"
        errorMessage.className = "success"
        errorMessage.classList.remove("hidden");

        setTimeout(() => {
            window.location.href = "/login";
        }, 1000);

    } catch (error) {
        showError(error.message);
        hideLoading();
    }
});