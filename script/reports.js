auth.onAuthStateChanged(u=>{ if(!u||u.isAnonymous) location.href="login.html"; });

let dump=[];
function daily(){
    let d=document.getElementById("reportDate").value;
    db.collection("billing").where("date","==",d).get().then(show);
}
function monthly(){
    let m=document.getElementById("reportMonth").value;
    db.collection("billing").get().then(s=>{
        show({docs:s.docs.filter(x=>x.data().date.startsWith(m))});
    });
}
function show(s){
    let h=""; dump=[];
    s.docs.forEach(x=>{
        let d=x.data();
        dump.push([d.date,d.services.join(", "),d.total]);
        h+=`<tr><td>${d.date}</td><td>${d.services.join(", ")}</td><td>₹${d.total}</td></tr>`;
    });
    repT.innerHTML=h;
}
function pdf(){
    const {jsPDF}=window.jspdf; const doc=new jsPDF();
    doc.autoTable({head:[["Date","Services","Total"]],body:dump});
    doc.save("Report.pdf");
}
function excel(){
    let wb=XLSX.utils.book_new();
    let ws=XLSX.utils.aoa_to_sheet([["Date","Services","Total"],...dump]);
    XLSX.utils.book_append_sheet(wb,ws,"Report");
    XLSX.writeFile(wb,"Report.xlsx");
}
function logout(){ auth.signOut(); }
