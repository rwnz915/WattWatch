document.addEventListener('DOMContentLoaded', function () {
    // ------------------ INPUT SANITIZER ------------------
    const ids = ['exampleFirstName', 'exampleLastName'];
    const sanitize = s => s.replace(/[^A-Za-z\s]/g, ''); // allow letters + space only

    ids.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;

        // Add HTML5 attributes
        el.setAttribute('pattern', '[A-Za-z\\s]+');
        el.setAttribute('title', 'Only letters and spaces are allowed');

        // Block invalid keys
        el.addEventListener('keydown', function (e) {
            const allowedKeys = [
                'Backspace','Tab','Enter','Escape','ArrowLeft','ArrowRight','ArrowUp','ArrowDown',
                'Home','End','Delete'
            ];
            if (e.ctrlKey || e.metaKey) return;
            if (allowedKeys.includes(e.key)) return;
            if (e.key.length === 1 && !/^[A-Za-z\s]$/.test(e.key)) {
                e.preventDefault();
            }
        });

        // Sanitize on input
        el.addEventListener('input', function () {
            const before = this.value;
            const cleaned = sanitize(before);
            if (cleaned !== before) {
                const pos = this.selectionStart - (before.length - cleaned.length);
                this.value = cleaned;
                try { this.setSelectionRange(Math.max(0,pos), Math.max(0,pos)); } catch(err){}
            }
        });

        // Sanitize pasted text
        el.addEventListener('paste', function (e) {
            e.preventDefault();
            const text = (e.clipboardData || window.clipboardData).getData('text') || '';
            const cleaned = sanitize(text);
            const start = this.selectionStart;
            const end = this.selectionEnd;
            const val = this.value;
            this.value = val.slice(0, start) + cleaned + val.slice(end);
            const caret = start + cleaned.length;
            try { this.setSelectionRange(caret, caret); } catch(err){}
            this.dispatchEvent(new Event('input', { bubbles: true }));
        });
    });

    // ------------------ REGISTER FORM ------------------
    const passwordInput = document.getElementById('exampleInputPassword');
    const repeatPasswordInput = document.getElementById('exampleRepeatPassword');
    if (passwordInput) passwordInput.maxLength = 16;
    if (repeatPasswordInput) repeatPasswordInput.maxLength = 16;

    const registerBtn = document.getElementById('registerBtn');
    if (!registerBtn) return;

    registerBtn.addEventListener('click', async function (e) {
        e.preventDefault();

        const firstName = document.getElementById('exampleFirstName').value.trim();
        const lastName = document.getElementById('exampleLastName').value.trim();
        const email = document.getElementById('exampleInputEmail').value.trim();
        const password = passwordInput.value;
        const repeatPassword = repeatPasswordInput.value;

        if (!firstName || !lastName || !email || !password || !repeatPassword) {
            showMessage("Please fill in all fields.");
            return;
        }

        if (password.length > 12) {
            showMessage("Password must not exceed 12 characters.");
            return;
        }

        if (password !== repeatPassword) {
            showMessage("Passwords do not match.");
            return;
        }

        try {
            const response = await fetch("https://wattwatch-backend.onrender.com/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    password
                })
            });

            const data = await response.json();

            if (response.ok) {
                showMessage(data.message || "Registration successful!");

                const okBtn = document.getElementById('okBtn');
                okBtn.onclick = () => {
                    $('#errorModal').modal('hide');
                    window.location.href = "index.html";
                };
            } else {
                showMessage(data.message || "Registration failed!");
            }
        } catch (err) {
            console.error(err);
            showMessage("Server error. Please try again later.");
        }
    });
});
