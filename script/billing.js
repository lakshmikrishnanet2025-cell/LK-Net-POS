auth.onAuthStateChanged(u=>{ if(!u) location.href="login.html"; });

db.collection("services").onSnapshot(s=>{
    let h="";
    s.forEach(d=>{
        let x = d.data();
        h+=`<li onclick="addItem('${x.name}',${x.price})">${x.name} - ₹${x.price}</li>`;
    });
    serviceList.innerHTML=h;
});

let items=[], total=0;
function addItem(n,p){
    items.push(n); total+=p;
    billItems.innerHTML+=`<li>${n} - ₹${p}</li>`;
    totalEl.innerText=total;
}

function saveBill(){
    if(total===0) return alert("No items!");
    db.collection("billing").add({
        services:items,total, date:new Date().toLocaleDateString("en-CA"),
        timestamp:Date.now(), userId: auth.currentUser.isAnonymous?"PIN":auth.currentUser.uid
    }).then(()=>{ alert("Saved!"); items=[]; total=0; billItems.innerHTML=""; totalEl.innerText=0; });
}

function logout(){ auth.signOut(); }
