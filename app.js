alert("TechDesk Hub działa");

/*. 
TechDesk Hub
app.js v0.2.2
*/


// ==========================
// BAZA LOKALNA
// ==========================

let database = {

    repairs: [],
    inventory: [],
    receipts: [],
    notes: []

};



// ==========================
// ZAPIS / ODCZYT
// ==========================


function loadDatabase(){

    let saved = localStorage.getItem("techdesk_database");


    if(saved){

        database = JSON.parse(saved);

    }

}



function saveDatabase(){

    localStorage.setItem(
        "techdesk_database",
        JSON.stringify(database)
    );

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
    .forEach(item=>{

        item.classList.remove("active");

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


    let repair = {


        device:
        document.getElementById("device").value,


        client:
        document.getElementById("client").value,


        problem:
        document.getElementById("problem").value,


        status:
        document.getElementById("repairStatus").value,


        cost:
        document.getElementById("repairCost").value,


        note:
        document.getElementById("repairNote").value


    };



    database.repairs.push(repair);



    saveDatabase();

    showRepairs();

    updateDashboard();


}





function showRepairs(){


    let list =
    document.getElementById("repairList");



    list.innerHTML="";



    database.repairs.forEach((r,index)=>{


        list.innerHTML += `

        <div class="item">

        <b>${r.device}</b><br>

        Klient: ${r.client}<br>

        Problem: ${r.problem}<br>

        Status: ${r.status}<br>

        Koszt: ${r.cost} zł<br>

        ${r.note}

        <br>

        <button onclick="deleteRepair(${index})">
        ❌ Usuń
        </button>

        </div>

        `;


    });


}



function deleteRepair(index){


    database.repairs.splice(index,1);


    saveDatabase();

    showRepairs();

    updateDashboard();


}



// ==========================
// MAGAZYN
// ==========================


function addPart(){


    let part = {


        name:
        document.getElementById("partName").value,


        count:
        document.getElementById("partCount").value


    };


    database.inventory.push(part);


    saveDatabase();


    showInventory();

    updateDashboard();


}





function showInventory(){


    let list =
    document.getElementById("inventoryList");


    list.innerHTML="";



    database.inventory.forEach((p,index)=>{


        list.innerHTML += `

        <div class="item">

        📦 ${p.name}

        Ilość: ${p.count}


        <button onclick="deletePart(${index})">
        ❌
        </button>


        </div>

        `;


    });


}



function deletePart(index){


    database.inventory.splice(index,1);


    saveDatabase();

    showInventory();

    updateDashboard();


}



// ==========================
// PARAGONY
// ==========================


function addReceipt(){


    let receipt = {


        client:
        document.getElementById("receiptClient").value,


        service:
        document.getElementById("receiptService").value,


        price:
        document.getElementById("receiptPrice").value


    };



    database.receipts.push(receipt);



    saveDatabase();


    showReceipts();

    updateDashboard();


}




function showReceipts(){


    let list =
    document.getElementById("receiptList");


    list.innerHTML="";



    database.receipts.forEach((r,index)=>{


        list.innerHTML += `

        <div class="item">

        Klient: ${r.client}<br>

        Usługa: ${r.service}<br>

        Cena: ${r.price} zł


        <button onclick="deleteReceipt(${index})">
        ❌
        </button>


        </div>

        `;


    });


}




function deleteReceipt(index){


    database.receipts.splice(index,1);


    saveDatabase();

    showReceipts();

    updateDashboard();


}



// ==========================
// NOTATKI
// ==========================


function addNote(){


    let text =
    document.getElementById("noteText").value;



    if(text==="") return;



    database.notes.push(text);



    saveDatabase();



    showNotes();

    updateDashboard();


}





function showNotes(){


    let list =
    document.getElementById("notesList");


    list.innerHTML="";



    database.notes.forEach((n,index)=>{


        list.innerHTML += `

        <div class="item">

        📝 ${n}


        <button onclick="deleteNote(${index})">
        ❌
        </button>


        </div>

        `;


    });


}



function deleteNote(index){


    database.notes.splice(index,1);


    saveDatabase();

    showNotes();

    updateDashboard();


}



// ==========================
// START
// ==========================


loadDatabase();

updateDashboard();

showRepairs();

showInventory();

showReceipts();

showNotes();

// ==========================
// EKSPORT JSON
// ==========================

function exportJSON(){

    let data = JSON.stringify(
        database,
        null,
        4
    );


    let blob = new Blob(
        [data],
        {
            type: "application/json"
        }
    );


    let url = URL.createObjectURL(blob);


    let link = document.createElement("a");

    link.href = url;

    link.download =
    "TechDesk_Hub_backup.json";


    document.body.appendChild(link);


    link.click();


    document.body.removeChild(link);


    URL.revokeObjectURL(url);


}

// ==========================
// IMPORT JSON
// ==========================

function importJSON(event){


    let file =
    event.target.files[0];


    if(!file){
        return;
    }



    let reader =
    new FileReader();



    reader.onload = function(e){


        try{


            let imported =
            JSON.parse(e.target.result);



            if(
                imported.repairs &&
                imported.inventory &&
                imported.receipts &&
                imported.notes
            ){


                database = imported;


                saveDatabase();


                updateDashboard();


                showRepairs();

                showInventory();

                showReceipts();

                showNotes();



                alert(
                "✅ Kopia TechDesk Hub została przywrócona!"
                );


            }
            else{


                alert(
                "❌ Nieprawidłowy plik kopii zapasowej"
                );


            }


        }
        catch(error){


            alert(
            "❌ Błąd odczytu pliku JSON"
            );


        }


    };



    reader.readAsText(file);


}

// ==========================
// DRUKOWANIE PARAGONÓW / PDF
// ==========================

function printReceipts(){

    if(database.receipts.length === 0){

        alert("Brak paragonów do wydruku");
        return;

    }


    let printWindow = window.open("", "_blank");


    let html = `

    <!DOCTYPE html>
    <html lang="pl">

    <head>

    <meta charset="UTF-8">

    <title>TechDesk Hub - Paragon</title>

    <style>

    body{
        font-family: Arial, sans-serif;
        padding: 30px;
    }

    h1{
        text-align:center;
    }

    .receipt{

        border:1px solid black;
        padding:20px;
        margin-bottom:20px;

    }

    </style>

    </head>


    <body>


    <h1>
    🔧 TechDesk Hub
    </h1>


    <h2>
    Paragony
    </h2>

    `;


    database.receipts.forEach((r,index)=>{


        html += `

        <div class="receipt">

        <h3>
        Paragon #${index + 1}
        </h3>


        <b>Klient:</b>
        ${r.client}
        <br><br>


        <b>Usługa:</b>
        ${r.service}
        <br><br>


        <b>Cena:</b>
        ${r.price} zł


        </div>


        `;


    });



    html += `

    </body>

    </html>

    `;



    printWindow.document.open();

    printWindow.document.write(html);

    printWindow.document.close();



    setTimeout(()=>{

        printWindow.print();

    },500);


}
