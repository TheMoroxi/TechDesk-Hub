/*
TechDesk Hub
app.js v0.2.3
*/


// ==========================
// BAZA
// ==========================

let database = {

    settings:{
        serviceName:""
    },

    repairs:[],
    inventory:[],
    receipts:[],
    notes:[]

};



// ==========================
// ZAPIS / ODCZYT
// ==========================


function loadDatabase(){

    let saved =
    localStorage.getItem("techdesk_database");


    if(saved){

        database = JSON.parse(saved);

    }


    if(!database.settings){

        database.settings={
            serviceName:""
        };

    }

}



function saveDatabase(){

    localStorage.setItem(
        "techdesk_database",
        JSON.stringify(database)
    );

}



// ==========================
// NAZWA SERWISU
// ==========================


function checkServiceName(){

    if(database.settings.serviceName===""){


        let name =
        prompt(
            "Podaj nazwę serwisu:"
        );


        if(name){

            database.settings.serviceName =
            name;


            saveDatabase();

        }

    }

}



// ==========================
// DASHBOARD
// ==========================


function updateDashboard(){


    repairCount.innerText =
    database.repairs.length;


    partsCount.innerText =
    database.inventory.length;


    receiptCount.innerText =
    database.receipts.length;


    noteCount.innerText =
    database.notes.length;


}



// ==========================
// STRONY
// ==========================


function showPage(page){


    document
    .querySelectorAll(".page")
    .forEach(p=>{

        p.classList.remove("active");

    });



    let element =
    document.getElementById(page);


    if(element){

        element.classList.add("active");

    }


}



// ==========================
// NAPRAWY
// ==========================


function addRepair(){


    database.repairs.push({

        device:device.value,

        client:client.value,

        problem:problem.value,

        status:repairStatus.value,

        cost:repairCost.value,

        note:repairNote.value

    });



    saveDatabase();

    showRepairs();

    updateDashboard();


}



function showRepairs(){


    repairList.innerHTML="";


    database.repairs.forEach((r,i)=>{


        repairList.innerHTML += `

        <div class="item">


        <b>${r.device}</b><br>

        Klient:
        ${r.client}<br>

        Problem:
        ${r.problem}<br>

        Status:
        ${r.status}<br>

        Cena:
        ${r.cost} zł


        <br>


        <button onclick="deleteRepair(${i})">

        ❌ Usuń

        </button>


        </div>

        `;


    });


}



function deleteRepair(i){


    database.repairs.splice(i,1);


    saveDatabase();

    showRepairs();

    updateDashboard();


}
// ==========================
// MAGAZYN
// ==========================


function addPart(){


    database.inventory.push({

        name:partName.value,

        count:partCount.value

    });


    saveDatabase();

    showInventory();

    updateDashboard();


}



function showInventory(){


    inventoryList.innerHTML="";


    database.inventory.forEach((p,i)=>{


        inventoryList.innerHTML += `

        <div class="item">

        📦 ${p.name}

        <br>

        Ilość:
        ${p.count}


        <br>


        <button onclick="deletePart(${i})">
        ❌ Usuń
        </button>


        </div>

        `;


    });


}



function deletePart(i){


    database.inventory.splice(i,1);


    saveDatabase();

    showInventory();

    updateDashboard();


}





// ==========================
// PARAGONY
// ==========================


function addReceipt(){


    database.receipts.push({

        client:
        receiptClient.value,

        service:
        receiptService.value,

        price:
        receiptPrice.value


    });



    saveDatabase();

    showReceipts();

    updateDashboard();


}





function showReceipts(){


    receiptList.innerHTML="";


    database.receipts.forEach((r,i)=>{


        receiptList.innerHTML += `


        <div class="item">


        🧾 Paragon #${i+1}

        <br>


        Klient:
        ${r.client}

        <br>


        Usługa:
        ${r.service}

        <br>


        Cena:
        ${r.price} zł


        <br>


        <button onclick="deleteReceipt(${i})">

        ❌ Usuń

        </button>


        </div>


        `;


    });


}




function deleteReceipt(i){


    database.receipts.splice(i,1);


    saveDatabase();

    showReceipts();

    updateDashboard();


}





// ==========================
// NOTATKI
// ==========================


function addNote(){


    if(noteText.value==="")
    return;



    database.notes.push(
        noteText.value
    );


    saveDatabase();

    showNotes();

    updateDashboard();


}




function showNotes(){


    notesList.innerHTML="";


    database.notes.forEach((n,i)=>{


        notesList.innerHTML += `


        <div class="item">


        📝 ${n}


        <br>


        <button onclick="deleteNote(${i})">

        ❌ Usuń

        </button>


        </div>


        `;


    });


}




function deleteNote(i){


    database.notes.splice(i,1);


    saveDatabase();

    showNotes();

    updateDashboard();


}





// ==========================
// EKSPORT JSON
// ==========================


function exportJSON(){


    let file =
    new Blob(
        [
        JSON.stringify(
            database,
            null,
            4
        )
        ],
        {
            type:"application/json"
        }
    );



    let link =
    document.createElement("a");



    link.href =
    URL.createObjectURL(file);



    link.download =
    "TechDesk_Hub_backup.json";



    link.click();


}





// ==========================
// IMPORT JSON
// ==========================


function importJSON(event){


    let file =
    event.target.files[0];


    if(!file)
    return;



    let reader =
    new FileReader();



    reader.onload=function(e){


        let data =
        JSON.parse(e.target.result);



        database=data;



        if(!database.settings){

            database.settings={
                serviceName:""
            };

        }



        saveDatabase();


        updateDashboard();

        showRepairs();

        showInventory();

        showReceipts();

        showNotes();



        alert(
        "✅ Przywrócono kopię TechDesk Hub"
        );


    };



    reader.readAsText(file);


}





// ==========================
// PARAGON PDF / DRUK
// ==========================


function printReceipts(){


    if(database.receipts.length===0){


        alert(
        "Brak paragonów"
        );


        return;

    }



    let win =
    window.open(
        "",
        "_blank"
    );



    let date =
    new Date()
    .toLocaleString("pl-PL");



    let html=`


<!DOCTYPE html>

<html>

<head>


<meta charset="UTF-8">


<title>
Paragon
</title>


<style>


body{

font-family:monospace;

width:80mm;

margin:auto;

padding:10px;

}


.center{

text-align:center;

}


.line{

border-top:1px dashed black;

margin:10px 0;

}


</style>


</head>


<body>


<div class="center">


<h2>

${database.settings.serviceName}

</h2>


Serwis elektroniki


</div>



<div class="line"></div>


Data:
${date}


<div class="line"></div>


`;



let total=0;



database.receipts.forEach((r,i)=>{


let price =
Number(r.price)||0;


total+=price;



html+=`

PARAGON #${i+1}

<br>


Klient:
${r.client}


<br>


Usługa:
${r.service}


<br>


Cena:
${price.toFixed(2)} zł


<div class="line"></div>

`;



});



html+=`


<b>

RAZEM:
${total.toFixed(2)} zł

</b>


<div class="line"></div>


<div class="center">

Dziękujemy!


<br><br>


${database.settings.serviceName}

</div>


</body>

</html>


`;



win.document.write(html);

win.document.close();



setTimeout(()=>{

win.print();

},500);


}





// ==========================
// START
// ==========================


loadDatabase();


checkServiceName();


updateDashboard();


showRepairs();

showInventory();

showReceipts();

showNotes();
