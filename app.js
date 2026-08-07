/*
TechDesk Hub
app.js v0.2.4
*/

// ==========================
// BAZA DANYCH
// ==========================

let database = {

    dbVersion:"0.2.4",

    settings:{
        serviceName:""
    },

    repairs:[],

    inventory:[],

    receipts:[],

    notes:[]

};


// ==========================
// POMOCNICZE DOM
// ==========================

function $(id){

    return document.getElementById(id);

}


// ==========================
// LOCAL STORAGE
// ==========================

function saveDatabase(){

    localStorage.setItem(
        "techdesk_database",
        JSON.stringify(database)
    );

}



function loadDatabase(){

    let saved =
    localStorage.getItem(
        "techdesk_database"
    );


    if(saved){

        try{

            database =
            JSON.parse(saved);

        }
        catch{

            database = {

                dbVersion:"0.2.4",

                settings:{
                    serviceName:""
                },

                repairs:[],
                inventory:[],
                receipts:[],
                notes:[]

            };

        }

    }


    // migracja starszych wersji

    if(!database.dbVersion){

        database.dbVersion="0.2.4";

    }


    if(!database.settings){

        database.settings={
            serviceName:""
        };

    }


    if(!database.repairs){

        database.repairs=[];

    }


    if(!database.inventory){

        database.inventory=[];

    }


    if(!database.receipts){

        database.receipts=[];

    }


    if(!database.notes){

        database.notes=[];

    }


    saveDatabase();

}



// ==========================
// NAZWA SERWISU
// ==========================

function checkServiceName(){


    let overlay =
    $("welcomeOverlay");


    if(!overlay)
    return;



    if(database.settings.serviceName===""){


        overlay.style.display="flex";


    }
    else{


        overlay.style.display="none";


    }


}




function createNewService(){


    let name =
    prompt(
        "Podaj nazwę serwisu:"
    );



    if(!name)
    return;



    database.settings.serviceName =
    name;



    saveDatabase();



    let overlay =
    $("welcomeOverlay");


    if(overlay){

        overlay.style.display="none";

    }



}




// ==========================
// IMPORT BACKUP
// ==========================

function openImport(){


    let input =
    $("importFile");


    if(input){

        input.click();

    }


}



// ==========================
// DASHBOARD
// ==========================

function updateDashboard(){


    let repairCount =
    $("repairCount");


    let partsCount =
    $("partsCount");


    let receiptCount =
    $("receiptCount");


    let noteCount =
    $("noteCount");



    if(repairCount){

        repairCount.innerText =
        database.repairs.length;

    }



    if(partsCount){

        partsCount.innerText =
        database.inventory.length;

    }



    if(receiptCount){

        receiptCount.innerText =
        database.receipts.length;

    }



    if(noteCount){

        noteCount.innerText =
        database.notes.length;

    }


}



// ==========================
// NAWIGACJA
// ==========================

function showPage(page){


    document
    .querySelectorAll(".page")
    .forEach(p=>{

        p.classList.remove(
            "active"
        );

    });



    let section =
    $(page);



    if(section){

        section.classList.add(
            "active"
        );

    }


}

/*
TechDesk Hub
app.js v0.2.4

Część 2/3
*/

// ==========================
// BEZPIECZNE TEKSTY
// ==========================

function escapeHTML(text){

    if(!text)
    return "";

    return String(text)
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#039;");

}


// ==========================
// NAPRAWY
// ==========================

function addRepair(){


    let device =
    $("device").value.trim();


    let client =
    $("client").value.trim();


    let problem =
    $("problem").value.trim();


    let status =
    $("repairStatus").value;


    let cost =
    $("repairCost").value;


    let note =
    $("repairNote").value.trim();



    if(device===""){

        alert(
            "Podaj urządzenie"
        );

        return;

    }



    let repair={

        id:Date.now(),

        device,

        client,

        problem,

        status,

        cost,

        note,

        date:
        new Date()
        .toLocaleString("pl-PL")

    };



    database.repairs.push(
        repair
    );


    saveDatabase();

    showRepairs();

    updateDashboard();

}




function showRepairs(){


    let list =
    $("repairList");


    if(!list)
    return;



    list.innerHTML="";



    database.repairs
    .forEach((r,i)=>{


        list.innerHTML += `

        <div class="item">

        <b>
        🔧 ${escapeHTML(r.device)}
        </b>

        <br>

        Klient:
        ${escapeHTML(r.client)}

        <br>

        Problem:
        ${escapeHTML(r.problem)}

        <br>

        Status:
        ${escapeHTML(r.status)}

        <br>

        Cena:
        ${escapeHTML(r.cost)} zł

        <br>

        Data:
        ${escapeHTML(r.date)}

        <br><br>


        <button onclick="deleteRepair(${i})">
        ❌ Usuń
        </button>


        </div>

        `;


    });


}




function deleteRepair(i){


    if(
    !confirm(
        "Usunąć naprawę?"
    )
    )
    return;



    database.repairs.splice(
        i,
        1
    );


    saveDatabase();

    showRepairs();

    updateDashboard();


}



// ==========================
// MAGAZYN
// ==========================

function addPart(){


    let name =
    $("partName").value.trim();


    let count =
    $("partCount").value;



    if(name===""){

        alert(
            "Podaj nazwę części"
        );

        return;

    }



    database.inventory.push({

        id:Date.now(),

        name,

        count

    });



    saveDatabase();

    showInventory();

    updateDashboard();


}




function showInventory(){


    let list =
    $("inventoryList");


    if(!list)
    return;



    list.innerHTML="";



    database.inventory
    .forEach((p,i)=>{


        list.innerHTML += `

        <div class="item">

        📦
        <b>
        ${escapeHTML(p.name)}
        </b>

        <br>

        Ilość:
        ${escapeHTML(p.count)}


        <br><br>


        <button onclick="deletePart(${i})">

        ❌ Usuń

        </button>


        </div>

        `;


    });


}




function deletePart(i){


    if(
    !confirm(
        "Usunąć część?"
    )
    )
    return;



    database.inventory.splice(
        i,
        1
    );


    saveDatabase();

    showInventory();

    updateDashboard();


}



// ==========================
// PARAGONY
// ==========================

function addReceipt(){


    let client =
    $("receiptClient").value.trim();


    let service =
    $("receiptService").value.trim();


    let price =
    $("receiptPrice").value;



    if(service===""){

        alert(
            "Podaj usługę"
        );

        return;

    }



    database.receipts.push({

        id:Date.now(),

        client,

        service,

        price,

        date:
        new Date()
        .toLocaleString("pl-PL")

    });



    saveDatabase();

    showReceipts();

    updateDashboard();


}




function showReceipts(){


    let list =
    $("receiptList");


    if(!list)
    return;



    list.innerHTML="";



    database.receipts
    .forEach((r,i)=>{


        list.innerHTML += `

        <div class="item">


        🧾 Paragon #${i+1}


        <br>

        Klient:
        ${escapeHTML(r.client)}


        <br>

        Usługa:
        ${escapeHTML(r.service)}


        <br>

        Cena:
        ${escapeHTML(r.price)} zł


        <br><br>


        <button onclick="printReceipt(${i})">

        🖨 Drukuj

        </button>


        <button onclick="deleteReceipt(${i})">

        ❌ Usuń

        </button>


        </div>


        `;


    });


}




function deleteReceipt(i){


    if(
    !confirm(
        "Usunąć paragon?"
    )
    )
    return;



    database.receipts.splice(
        i,
        1
    );


    saveDatabase();

    showReceipts();

    updateDashboard();


}



// ==========================
// DRUKOWANIE
// ==========================

function printReceipt(index){


    let r =
    database.receipts[index];



    let win =
    window.open(
        "",
        "_blank"
    );



    let html = `

    <html>

    <head>

    <title>
    Paragon
    </title>


    <style>

    body{

        font-family:monospace;
        width:300px;

    }

    </style>


    </head>


    <body>


    <h3>
    ${escapeHTML(database.settings.serviceName)}
    </h3>


    Serwis elektroniki

    <hr>


    Data:

    ${new Date()
    .toLocaleString("pl-PL")}


    <hr>


    Klient:

    ${escapeHTML(r.client)}


    <br><br>


    Usługa:

    ${escapeHTML(r.service)}


    <br><br>


    Cena:

    ${escapeHTML(r.price)}
    zł


    <hr>


    Dziękujemy!


    </body>


    </html>

    `;



    win.document.write(html);

    win.document.close();



    setTimeout(()=>{

        win.print();

    },500);


}
/*
TechDesk Hub
app.js v0.2.4

Część 3/3
*/


// ==========================
// NOTATKI
// ==========================

function addNote(){


    let text =
    $("noteText").value.trim();



    if(text===""){

        alert(
            "Wpisz notatkę"
        );

        return;

    }



    database.notes.push({

        id:Date.now(),

        text,

        date:
        new Date()
        .toLocaleString("pl-PL")

    });



    saveDatabase();

    showNotes();

    updateDashboard();


}





function showNotes(){


    let list =
    $("notesList");


    if(!list)
    return;



    list.innerHTML="";



    database.notes
    .forEach((n,i)=>{


        list.innerHTML += `


        <div class="item">


        📝

        ${escapeHTML(n.text)}


        <br>


        <small>
        ${escapeHTML(n.date)}
        </small>


        <br><br>


        <button onclick="deleteNote(${i})">

        ❌ Usuń

        </button>


        </div>


        `;


    });


}





function deleteNote(i){


    if(
    !confirm(
        "Usunąć notatkę?"
    )
    )
    return;



    database.notes.splice(
        i,
        1
    );


    saveDatabase();

    showNotes();

    updateDashboard();


}



// ==========================
// EXPORT BACKUP JSON
// ==========================

function exportJSON(){


    let blob =
    new Blob(

        [

        JSON.stringify(
            database,
            null,
            4
        )

        ],

        {

        type:
        "application/json"

        }

    );



    let link =
    document.createElement(
        "a"
    );



    link.href =
    URL.createObjectURL(
        blob
    );



    link.download =
    "TechDesk_Hub_backup.json";



    link.click();



}





// ==========================
// IMPORT BACKUP JSON
// ==========================

function importJSON(event){


    let file =
    event.target.files[0];



    if(!file)
    return;



    let reader =
    new FileReader();



    reader.onload =
    function(e){



        try{


            let data =
            JSON.parse(
                e.target.result
            );



            if(

            !data.settings ||

            !Array.isArray(data.repairs) ||

            !Array.isArray(data.inventory) ||

            !Array.isArray(data.receipts) ||

            !Array.isArray(data.notes)

            ){


                alert(
                    "❌ Nieprawidłowy backup TechDesk Hub"
                );


                return;


            }



            database=data;



            database.dbVersion =
            "0.2.4";



            saveDatabase();



            updateDashboard();


            showRepairs();


            showInventory();


            showReceipts();


            showNotes();



            checkServiceName();



            alert(
                "✅ Przywrócono kopię zapasową"
            );


        }
        catch{


            alert(
                "❌ Błąd odczytu pliku"
            );


        }



    };



    reader.readAsText(
        file
    );


}




// ==========================
// RESET DANYCH
// ==========================

function resetDatabase(){


    if(
    !confirm(
        "Usunąć wszystkie dane TechDesk Hub?"
    )
    )
    return;



    localStorage.removeItem(
        "techdesk_database"
    );



    location.reload();


}



// ==========================
// START APLIKACJI
// ==========================

loadDatabase();


checkServiceName();


updateDashboard();


showRepairs();


showInventory();


showReceipts();


showNotes();
