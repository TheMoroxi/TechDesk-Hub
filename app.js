/*
TechDesk Hub
app.js v0.2.3
*/


// ==========================
// BAZA LOKALNA
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
// LOAD / SAVE
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


    if(database.settings.serviceName === ""){


        let name = prompt(
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


    document.getElementById("repairCount").innerText =
    database.repairs.length;


    document.getElementById("partsCount").innerText =
    database.inventory.length;


    document.getElementById("receiptCount").innerText =
    database.receipts.length;


    document.getElementById("noteCount").innerText =
    database.notes.length;


}



// ==========================
// NAWIGACJA
// ==========================


function showPage(page){


    document
    .querySelectorAll(".page")
    .forEach(p=>{

        p.classList.remove("active");

    });



    let selected =
    document.getElementById(page);


    if(selected){

        selected.classList.add("active");

    }

}



// ==========================
// NAPRAWY
// ==========================


function addRepair(){


    database.repairs.push({

        device:
        device.value,

        client:
        client.value,

        problem:
        problem.value,

        status:
        repairStatus.value,

        cost:
        repairCost.value,

        note:
        repairNote.value

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

        Klient: ${r.client}<br>

        Problem: ${r.problem}<br>

        Status: ${r.status}<br>

        Cena: ${r.cost} zł<br>


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

        name:
        partName.value,

        count:
        partCount.value

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
        Ilość: ${p.count}


        <button onclick="deletePart(${i})">
        ❌
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

        Klient:
        ${r.client}<br>

        Usługa:
        ${r.service}<br>

        Cena:
        ${r.price} zł


        <button onclick="deleteReceipt(${i})">
        ❌
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


        <button onclick="deleteNote(${i})">
        ❌
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
// DRUK PDF
// ==========================


function printReceipts(){


    if(database.receipts.length===0){

        alert("Brak paragonów");

        return;

    }



    let win =
    window.open("","_blank");



    let html = `

    <html>

    <head>

    <title>
    ${database.settings.serviceName}
    </title>


    <style>

    body{
        font-family:Arial;
        padding:30px;
    }


    .receipt{

        border:1px solid black;
        padding:20px;
        margin:20px;

    }

    </style>


    </head>


    <body>


    <h1>
    ${database.settings.serviceName}
    </h1>


    <h2>
    Paragony
    </h2>

    `;



    database.receipts.forEach((r,i)=>{


        html += `

        <div class="receipt">

        <h3>
        Paragon #${i+1}
        </h3>


        Klient:
        ${r.client}<br><br>


        Usługa:
        ${r.service}<br><br>


        Cena:
        ${r.price} zł


        </div>

        `;


    });



    html += `

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
// EKSPORT JSON
// ==========================


function exportJSON(){


    let blob =
    new Blob(
        [
            JSON.stringify(database,null,4)
        ],
        {
            type:"application/json"
        }
    );


    let link =
    document.createElement("a");


    link.href =
    URL.createObjectURL(blob);


    link.download =
    "TechDesk_Hub_backup.json";


    link.click();


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
