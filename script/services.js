auth.onAuthStateChanged(async u=>{
    if(!u) location.href="login.html";
    const d = await db.collection("users").doc(u.uid).get();
    if(!d.exists||d.data().role!=="admin") adminTools.style.display="none";
    load();
});

function load(){
    db.collection("services").onSnapshot(s=>{
        let h="";
        s.forEach(x=>{
            let d=x.data();
            h+=`<li>${d.name} - ₹${d.price} [${d.category}]
            <button onclick="del('${x.id}')">❌</button></li>`;
        });
        serviceTable.innerHTML=h;
    });
}

function addService(){
    let n=sname.value, p=parseFloat(sprice.value), c=scategory.value;
    if(!n||!p) return alert("Enter details!");
    db.collection("services").add({name:n,price:p,category:c});
}
function del(id){ db.collection("services").doc(id).delete(); }
function logout(){ auth.signOut(); }
