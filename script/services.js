auth.onAuthStateChanged(async (u)=>{
  if(!u) return location.href="login.html";

  const role = (await db.collection("users").doc(u.uid).get()).data().role;
  if(role !== "admin"){
    document.getElementById("addBox").style.display="none";
  }
  loadServices();
});

async function loadServices(){
  let snap = await db.collection("services").get();
  let html="";
  snap.forEach(s=>{
    html += `<tr><td>${s.data().name}</td><td>₹${s.data().price}</td></tr>`;
  });
  document.getElementById("serviceTable").innerHTML = html;
}
