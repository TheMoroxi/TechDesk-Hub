/*
TechDesk Hub
app.js v0.2.1
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





function loadDatabase(){


    let saved =
    localStorage.getItem("techdesk_database");


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


    let repairs =
    document.getElementById("repairCount");


    let parts =
    document.getElementById("partsCount");


    let receipts =
    document.getElementById("receiptCount");




    if(repairs){

        repairs.innerText =
        database.repairs.length;

    }



    if(parts){

        parts.innerText =
        database.inventory.length;

    }



    if(receipts){

        receipts.innerText =
        database.receipts.length;

    }



}





// ==========================
// NAWIGACJA
// ==========================


function showPage(page){


    let pages =
    document.querySelectorAll(".page");


    pages.forEach(
        item => {

            item.classList.remove("active");

        }
    );



    let selected =
    document.getElementById(page);



    if(selected){

        selected.classList.add("active");

    }



}





// ==========================
// TESTOWE DANE (PUSTE)
// ==========================


function clearDemoData(){


    database = {

        repairs: [],

        inventory: [],

        receipts: [],

        notes: []

    };


    saveDatabase();

    updateDashboard();


}





// ==========================
// START
// ==========================


loadDatabase();

updateDashboard();
