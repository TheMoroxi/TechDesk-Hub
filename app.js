let repairs =
JSON.parse(localStorage.getItem("repairs"))
||
[];




function saveData(){

localStorage.setItem(
"repairs",
JSON.stringify(repairs)
);

}







function addRepair(){


let repair = {


id: Date.now(),


device:
document.getElementById("device").value,


client:
document.getElementById("client").value,


phone:
document.getElementById("phone").value,


problem:
document.getElementById("problem").value,


status:
document.getElementById("status").value,


cost:
document.getElementById("cost").value,


note:
document.getElementById("note").value,


date:
new Date().toLocaleDateString()



};




if(!repair.device || !repair.problem){

alert("Podaj urządzenie i problem");

return;

}




repairs.push(repair);


saveData();


clearForm();


renderRepairs();


}







function clearForm(){


document.querySelectorAll(
".repair-form input, .repair-form textarea"
)
.forEach(
element=>element.value=""
);


}








function deleteRepair(id){


repairs =
repairs.filter(
repair=>repair.id!==id
);



saveData();


renderRepairs();


}








function renderRepairs(){


let list =
document.getElementById(
"repairList"
);



let search =
document.getElementById(
"search"
).value.toLowerCase();



list.innerHTML="";




let filtered =
repairs.filter(
repair=>

repair.device.toLowerCase()
.includes(search)

||
repair.client.toLowerCase()
.includes(search)

);





filtered.forEach(repair=>{



list.innerHTML += `


<div class="repair-item">


<h3>
📱 ${repair.device}
</h3>



<p>
👤 ${repair.client}
</p>



<p>
☎ ${repair.phone}
</p>



<p>
⚠ ${repair.problem}
</p>



<p>
Status:
<b>${repair.status}</b>
</p>



<p>
💰 ${repair.cost || 0} zł
</p>



<p>
📝 ${repair.note}
</p>



<small>
Dodano:
${repair.date}
</small>



<br><br>



<button 
class="delete"
onclick="deleteRepair(${repair.id})">

🗑 Usuń

</button>


</div>


`;



});




updateStats();


}









function updateStats(){


document.getElementById(
"repairCount"
).innerText =
repairs.length;



}





renderRepairs();
