let loginEmailInput = document.getElementById("exampleInputEmail");
let loginPasswordInput = document.getElementById("exampleInputPassword");
let loginBtn = document.getElementById("loginBtn");

async function signIn() {
    const loginEmail = loginEmailInput.value;
    const loginPassword = loginPasswordInput.value;

    if (!loginEmail || !loginPassword) {
        showMessage("Please fill in all fields");
        return;
    }

    try {
        const response = await fetch("https://wattwatch-backend.onrender.com/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: loginEmail, password: loginPassword })
        });

        const data = await response.json();

        if (response.ok) {
            setUserInfo({
                id: data.id,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                page: data.page
            });
            if (data.page)
                window.location.href = data.page;
        } else {
            showMessage(data.message || "Incorrect email or password");
        }
    } catch (err) {
        showMessage("Server error. Please try again later.");
        console.error(err);
    }
}

loginBtn.addEventListener("click", function () {
    signIn();
});
