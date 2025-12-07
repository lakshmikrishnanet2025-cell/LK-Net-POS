auth.onAuthStateChanged(async (u)=>{
  if(!u) return location.href="login.html";

  const role = (await db.collection("users").doc(u.uid).get()).data().role;
  if(role !== "admin"){
    document.getElementById("addUserBox").style.display="none";
  }
});
