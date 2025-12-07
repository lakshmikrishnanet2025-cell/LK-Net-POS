// EMAIL LOGIN
function login() {
    const email = document.getElementById("email").value;
    const pass  = document.getElementById("password").value;

    auth.signInWithEmailAndPassword(email, pass)
    .then(() => {
        location.href = "index.html";
    })
    .catch(err => {
        document.getElementById("msg").innerText = err.message;
    });
}

// PIN LOGIN (Only for Billing Page Access)
function pinLogin() {
    const pin = document.getElementById("pinBox").value;

    if (pin === "301017") {
        auth.signInAnonymously()
        .then(() => location.href = "billing.html")
        .catch(err => {
            document.getElementById("msg").innerText = err.message;
        });
    } else {
        document.getElementById("msg").innerText = "Invalid PIN";
    }
}
