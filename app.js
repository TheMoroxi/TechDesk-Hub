let repairs =
JSON.parse(
localStorage.getItem("repairs")
)
||
[];





function save(){

localStorage.setItem(
"repairs",
JSON.stringify(repairs)
);

}







function addRepair(){


let device =
document.getElementById("device").value;



let problem =
document.getElementById("problem").value;



let status =
document.getElementById("repairStatus").value;



if(device==="" || problem===""){

alert("Uzupełnij dane");

return;

}





let repair={


id:Date.now(),


device:device,


problem:problem,


status:status,


date:
new Date()
.toLocaleDateString()


};





repairs.push(repair);



save();



render();





document.getElementById("device").value="";

document.getElementById("problem").value="";


}







function removeRepair(id){


repairs =
repairs.filter(
item=>item.id!==id
);



save();


render();


}







function render(){


let list =
document.getElementById(
"repairList"
);



let counter =
document.getElementById(
"repairCount"
);



counter.innerHTML =
repairs.length+
" aktywnych";




list.innerHTML="";




repairs.forEach(item=>{


list.innerHTML += `

<div class="repair-item">


<h3>
🔧 ${item.device}
</h3>


<p>
<strong>Problem:</strong>
${item.problem}
</p>



<p>
<strong>Status:</strong>
${item.status}
</p>



<small>
${item.date}
</small>


<br><br>


<button 
class="delete"
onclick="removeRepair(${item.id})">

🗑 Usuń

</button>


</div>

`;


});


}






render();
