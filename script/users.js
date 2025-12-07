auth.onAuthStateChanged(async u=>{
    if(!u||u.isAnonymous) location.href="login.html";
    const d=await db.collection("users").doc(u.uid).get();
    if(!d.exists||d.data().role!=="admin") location.href="billing.html";
    load();
});

function load(){
    db.collection("users").onSnapshot(s=>{
        let h="";
        s.forEach(x=>{
            let d=x.data();
            h+=`<li>${d.email} (${d.role})
            <button onclick="make('${x.id}')">Admin</button>
            <button onclick="del('${x.id}')">Block</button></li>`;
        });
        uList.innerHTML=h;
    });
}

function addU(){
    auth.createUserWithEmailAndPassword(uemail.value,upass.value).then(u=>{
        db.collection("users").doc(u.user.uid).set({email:uemail.value,role:urole.value,pin:"301017"});
    });
}
function make(id){ db.collection("users").doc(id).update({role:"admin"}); }
function del(id){ db.collection("users").doc(id).delete(); }
function logout(){ auth.signOut(); }
