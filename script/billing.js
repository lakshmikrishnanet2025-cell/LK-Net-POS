// --------------------- CHECK LOGIN ---------------------
auth.onAuthStateChanged(user => {
    if (!user) location.href = "login.html";
});

// --------------------- LOAD SERVICES ---------------------
db.collection("services").onSnapshot(snapshot => {
    let list = "";
    snapshot.forEach(doc => {
        const s = doc.data();
        list += `<li onclick="addItem('${s.name}',${s.price})">${s.name} - ₹${s.price}</li>`;
    });
    document.getElementById("serviceList").innerHTML = list;
});

// --------------------- BILLING DATA ---------------------
let items = [];  // names only
let total = 0;

// ADD ITEM TO BILL
function addItem(name, price){
    items.push(name);
    total += price;

    document.getElementById("billItems").innerHTML += `<li>${name} - ₹${price}</li>`;
    document.getElementById("total").innerText = total;
}

// --------------------- SAVE BILL ---------------------
function saveBill(){
    if(total === 0) return alert("No items in bill!");

    db.collection("billing").add({
        services: items,
        total: total,
        date: new Date().toISOString().split("T")[0],
        timestamp: Date.now(),
        userId: auth.currentUser.isAnonymous ? "PINLogin" : auth.currentUser.uid
    })
    .then(() => {
        alert("✔ Bill Saved Successfully");
        clearBill();
    })
    .catch(err => alert(err.message));
}

function clearBill(){
    items = [];
    total = 0;
    document.getElementById("billItems").innerHTML = "";
    document.getElementById("total").innerText = 0;
}

// --------------------- LOGOUT ---------------------
function logout(){
    auth.signOut();
}

// --------------------- CALCULATOR (AUTO BUILD) ---------------------
const calcBtns = ["7","8","9","4","5","6","1","2","3","0","+","-","*","/","C","="];
let display = document.getElementById("calc-display");
calcBtns.forEach(b=>{
    let btn = document.createElement("button");
    btn.innerText = b;
    btn.onclick = ()=> calcPress(b);
    document.getElementById("calc-buttons").appendChild(btn);
});
function calcPress(val){
    if(val === "C") display.value = "";
    else if(val === "=") display.value = eval(display.value);
    else display.value += val;
}
