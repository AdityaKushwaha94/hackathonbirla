document.addEventListener("DOMContentLoaded", () => {
    const sendOtpButton = document.getElementById("sendOtpButton");
    const registerButton = document.getElementById("registerButton");

    // Send OTP Handler
    sendOtpButton.addEventListener("click", () => {
        const email = document.getElementById("email").value.trim();

        if (!email) {
            alert("Please enter your email before sending OTP.");
            return;
        }

        // Send OTP to the backend
        fetch("/send-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    alert("OTP sent to your email.");
                } else {
                    alert(data.message || "Failed to send OTP. Try again.");
                }
            })
            .catch((error) => console.error("Error sending OTP:", error));
    });

    // Register Button Handler
    registerButton.addEventListener("click", () => {
        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const otp = document.getElementById("otp").value.trim();

        if (!username || !email || !password || !otp) {
            alert("Please fill out all fields.");
            return;
        }

        // Verify OTP and register user
        fetch("/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password, otp }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Server Response:", data); // Debugging

                if (data.success) {
                    alert("Registration successful! Redirecting...");
                    setTimeout(() => {
                        window.location.href = "dashboard.html"; // Redirect to dashboard.html
                    }, 1000); // 1 second delay
                } else {
                    alert(data.message || "Registration failed. Try again.");
                }
            })
            .catch((error) => console.error("Error during registration:", error));
    });
});
