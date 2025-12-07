function login(){
    const email = document.getElementById("email").value;
    const pass  = document.getElementById("password").value;
    if(!email||!pass) return showMsg("Enter email & password");

    auth.signInWithEmailAndPassword(email,pass)
    .then(async u=>{
        const doc = await db.collection("users").doc(u.user.uid).get();
        if(!doc.exists){
            db.collection("users").doc(u.user.uid).set({
                email, role:"staff", pin:"301017"
            });
        }
        redirect(u.user.uid);
    })
    .catch(e=>showMsg(e.message));
}

function pinLogin(){
    let p = document.getElementById("pinBox").value;
    if(p!=="301017") return showMsg("Wrong PIN!");

    db.collection("users").where("pin","==","301017").limit(1).get().then(s=>{
        if(s.empty) return showMsg("PIN not set!");
        let d = s.docs[0].data();
        auth.signInAnonymously().then(()=>{
            if(d.role==="admin") location.href="index.html";
            else location.href="billing.html";
        });
    });
}

function redirect(uid){
    db.collection("users").doc(uid).get().then(d=>{
        if(d.data().role==="admin") location.href="index.html";
        else location.href="billing.html";
    });
}

function showMsg(t){ document.getElementById("msg").innerText=t; }
