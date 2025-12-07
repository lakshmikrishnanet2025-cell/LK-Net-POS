// --------------------- LOGIN WITH EMAIL ---------------------
function login(){
    const email = document.getElementById("email").value;
    const pass  = document.getElementById("password").value;

    if(!email || !pass) return showMsg("Enter email & password");

    auth.signInWithEmailAndPassword(email, pass)
    .then(async (userCredential) => {
        const uid = userCredential.user.uid;

        const userDoc = await db.collection("users").doc(uid).get();

        // If user not created in DB yet = add as staff
        if (!userDoc.exists) {
            await db.collection("users").doc(uid).set({
                email: email,
                name: email.split("@")[0],
                role: "staff",
                pin: "301017"
            });
        }

        redirectUser(uid);
    })
    .catch(error => showMsg(error.message));
}

// --------------------- PIN LOGIN (Common PIN) ---------------------
function pinLogin(){
    let entered = document.getElementById("pinBox").value;
    if(entered !== "301017") return showMsg("❌ Wrong PIN");

    // Find admin or staff with same PIN
    db.collection("users").where("pin","==","301017").limit(1).get().then(snap=>{
        if(snap.empty) return showMsg("PIN not configured!");

        let user = snap.docs[0].data();
        // Anonymous login, but assign role & redirect
        auth.signInAnonymously().then(()=>{
            if(user.role === "admin") window.location.href = "index.html";
            else window.location.href = "billing.html";
        });
    });
}

// --------------------- REDIRECT BASED ON ROLE ---------------------
function redirectUser(uid){
    db.collection("users").doc(uid).get().then(doc=>{
        const role = doc.data().role;
        if(role === "admin") window.location.href = "index.html";
        else window.location.href = "billing.html";
    });
}

// --------------------- LOGOUT ---------------------
function logout(){
    auth.signOut();
    window.location.href = "login.html";
}

// -------------------- MESSAGE FUNCTION ---------------------
function showMsg(txt){
    document.getElementById("msg").innerText = txt;
}
