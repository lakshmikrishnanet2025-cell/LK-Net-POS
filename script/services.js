auth.onAuthStateChanged(async user => {
    if(!user) location.href = "login.html";

    const userDoc = await db.collection("users").doc(user.uid).get();
    if(userDoc.data().role !== "admin"){
        document.getElementById("adminTools").style.display = "none";
    }

    loadServices();
});

function logout(){ auth.signOut(); }

// Add service
function addService(){
    let name = sname.value;
    let price = parseFloat(sprice.value);
    let cat = scategory.value;

    if(!name || !price) return alert("Enter name and price!");

    db.collection("services").add({ name, price, category: cat })
    .then(()=> alert("Service Added!"));
}

// Load list
function loadServices(){
    db.collection("services").onSnapshot(snapshot=>{
        let list = "";
        snapshot.forEach(doc=>{
            let d = doc.data();
            list += `<li data-cat="${d.category}">
                ${d.name} - ₹${d.price} <span>[${d.category}]</span>
                <div>
                    <button class="editBtn" onclick="editService('${doc.id}','${d.name}',${d.price},'${d.category}')">✏️</button>
                    <button class="deleteBtn" onclick="deleteService('${doc.id}')">🗑️</button>
                </div>
            </li>`;
        });
        document.getElementById("serviceTable").innerHTML = list;
    });
}

// Delete service
function deleteService(id){
    if(confirm("Delete this service?"))
        db.collection("services").doc(id).delete();
}

// Edit service
function editService(id,name,price,cat){
    let newName = prompt("New Name:", name);
    let newPrice = prompt("New Price:", price);
    if(newName && newPrice){
        db.collection("services").doc(id).update({
            name:newName, price:parseFloat(newPrice), category:cat
        });
    }
}

// Filtering + Search
function filterList(){
    let cat = filterCat.value;
    let search = searchService.value.toLowerCase();
    document.querySelectorAll("#serviceTable li").forEach(li=>{
        let matchCat = (cat==="All" || li.getAttribute("data-cat") === cat);
        let matchText = li.innerText.toLowerCase().includes(search);
        li.style.display = (matchCat && matchText) ? "flex" : "none";
    });
}
