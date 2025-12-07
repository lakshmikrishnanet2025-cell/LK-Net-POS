auth.onAuthStateChanged(u=>{ if(!u||u.isAnonymous) location.href="login.html"; });

function logout(){ auth.signOut().then(()=>location.href="login.html"); }

let today=new Date().toISOString().split("T")[0];

db.collection("billing").onSnapshot(s=>{
    let T=0,C=0,MT=0,S={};
    s.forEach(x=>{
        let d=x.data();
        if(d.date===today){ T+=d.total; C++; }
        if(d.date.startsWith(today.slice(0,7))) MT+=d.total;
        d.services.forEach(a=> S[a]=(S[a]||0)+1 );
    });
    document.getElementById("todayEarn").innerText=T;
    document.getElementById("todayBills").innerText=C;
    document.getElementById("monthEarn").innerText=MT;
    document.getElementById("bestService").innerText=Object.keys(S)[0]||"---";
});
