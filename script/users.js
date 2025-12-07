auth.onAuthStateChanged(async user=>{
    if(!user) location.href = "login.html";
    const doc = await db.collection("users").doc(user.uid).get();
    if(doc.data().role !== "admin") location.href = "billing.html";
    loadUsers();
});

function logout(){ auth.signOut(); }

// Add user
function createUser(){
    let email = uemail.value, pass = upass.value, role = urole.value;

    auth.createUserWithEmailAndPassword(email, pass)
    .then(async u=>{
        await db.collection("users").doc(u.user.uid).set({ email, role, pin:"301017" });
        alert("User Added!");
    })
    .catch(e=>alert(e.message));
}

// Load users
function loadUsers(){
    db.collection("users").onSnapshot(snap=>{
        let list="";
        snap.forEach(doc=>{
            let d=doc.data();
            list += `<li>${d.email} (${d.role})
                <div>
                <button class="btn adminBtn" onclick="makeAdmin('${doc.id}')">Admin</button>
                <button class="btn blockBtn" onclick="delUser('${doc.id}')">Block</button>
                </div>
            </li>`;
        });
        usersList.innerHTML=list;
    })
}

function makeAdmin(id){ db.collection("users").doc(id).update({role:"admin"}); }
function delUser(id){ if(confirm("Block user?")) db.collection("users").doc(id).delete(); }
