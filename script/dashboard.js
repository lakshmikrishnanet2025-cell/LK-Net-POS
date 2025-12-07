auth.onAuthStateChanged(async (user) => {
  if (!user) return window.location = "login.html";

  const userDoc = await db.collection("users").doc(user.uid).get();
  const role = userDoc.data().role;

  document.getElementById("roleName").innerHTML = role;

  if (role !== "admin") {
    document.getElementById("resetBtn").style.display = "none";
    document.getElementById("usersMenu").style.display = "none";
    document.getElementById("servicesMenu").style.display = "none";
  }

  loadDashboard();
});

async function loadDashboard(){
  let today = new Date().toISOString().slice(0,10);

  let billsSnap = await db.collection("billing").where("date","==",today).get();
  document.getElementById("todayBills").innerHTML = billsSnap.size;

  let total = 0, top = {};
  billsSnap.forEach(d => {
    total += d.data().total;
    d.data().items.forEach(i=>{
      top[i.name] = (top[i.name]||0)+1;
    });
  });

  document.getElementById("todayEarnings").innerHTML = "₹" + total;
  document.getElementById("topService").innerHTML = Object.keys(top)[0] || "---";

  drawGraph(total);
}

// Graph using ChartJS
function drawGraph(total){
  new Chart(document.getElementById("chart"), {
    type:"bar",
    data:{
      labels:["Today"],
      datasets:[{label:"Earnings", data:[total]}]
    },
    options:{responsive:true}
  });
}

// Reset Data (Admin Only)
async function resetData(){
  if(!confirm("Reset All Bill Data?")) return;
  const snap = await db.collection("billing").get();
  snap.forEach(d => d.ref.delete());
  alert("Reset Complete");
  loadDashboard();
}
