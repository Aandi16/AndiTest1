import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBLWkY8PRtE3dbvamQ6EATULf4pAAAT6yI",
  authDomain: "andidb-61cf8.firebaseapp.com",
  projectId: "andidb-61cf8",
  storageBucket: "andidb-61cf8.firebasestorage.app",
  messagingSenderId: "811423588787",
  appId: "1:811423588787:web:1d60d20bc270ef07cc6bc6",
  measurementId: "G-8YP801XDBW"
};

// Firebase inicializálása
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Adatok betöltése
async function betoltAdatokat() {
    const utcakQuery = await getDocs(collection(db, "Utcak"));
    const emberekQuery = await getDocs(collection(db, "Emberek"));
    const parositasQuery = await getDocs(collection(db, "Parositasok"));

    let utcak = [];
    let emberek = [];
    let parositasok = {};

    // Utcák beolvasása
    utcakQuery.forEach((doc) => {
        utcak.push(doc.data().nev); // Az "nev" mező tartalmazza az utca nevét
    });

    // Emberek beolvasása
    emberekQuery.forEach((doc) => {
        emberek.push(doc.data().nev); // Az "nev" mező tartalmazza az ember nevét
    });

    // Párosítások betöltése (utca -> ember)
    parositasQuery.forEach((doc) => {
        parositasok[doc.data().utca] = doc.data().ember;
    });

    // Táblázat generálása
    let tabla = document.getElementById("utcaTabla");
    tabla.innerHTML = ""; // Töröljük a régi tartalmat

    utcak.forEach((utca) => {
        let sor = document.createElement("tr");
        let utcaCell = document.createElement("td");
        utcaCell.textContent = utca;

        let emberCell = document.createElement("td");
        let select = document.createElement("select");

        // Legördülő lista feltöltése emberekkel
        emberek.forEach((ember) => {
            let option = document.createElement("option");
            option.value = ember;
            option.textContent = ember;
            if (parositasok[utca] === ember) {
                option.selected = true;
            }
            select.appendChild(option);
        });

        emberCell.appendChild(select);
        sor.appendChild(utcaCell);
        sor.appendChild(emberCell);
        tabla.appendChild(sor);
    });
}

// **Betöltés az oldal betöltésekor**
document.addEventListener("DOMContentLoaded", function () {
    betoltAdatokat();
    document.getElementById("mentesGomb").addEventListener("click", mentesFirestoreba);
});

function mentesFirestoreba(sorok) {   
    // console.log("Sorok típusa:", typeof sorok);
    // console.log("Sorok értéke:", sorok);

    // HTMLCollection átalakítása tömbbé
    let sorokArray = Array.from(sorok);

    sorokArray.forEach(async (sor) => {
        let utcaNev = sor.cells[0].textContent;
        let szemely = sor.cells[1].querySelector("select").value;
        
        let utcaRef = collection(db, "parositas"); // Kollekció hivatkozás
        let querySnapshot = await getDocs(utcaRef);
        let docId = null;

        // Megnézzük, van-e már ilyen utca az adatbázisban
        querySnapshot.forEach((doc) => {
            if (doc.data().utca === utcaNev) {
                docId = doc.id;
            }
        });

        if (docId) {
            // Ha létezik, frissítjük
            await updateDoc(doc(db, "parositas", docId), {
                szemely: szemely
            });
            // console.log(`Frissítve: ${utcaNev} -> ${szemely}`);
        } else {
            // Ha nincs, akkor hozzáadjuk
            await addDoc(utcaRef, {
                utca: utcaNev,
                szemely: szemely
            });
            // console.log(`Hozzáadva: ${utcaNev} -> ${szemely}`);
        }
    });

    alert("Mentés sikeres!");
}

// **Betöltés az oldal betöltésekor**
document.addEventListener("DOMContentLoaded", function () {
    betoltAdatokat();
    document.getElementById("mentesGomb").addEventListener("click", mentesFirestoreba);
});

// **Gombhoz kötött mentés**
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("mentesGomb").addEventListener("click", function () {
        
        mentesFirestoreba( document.getElementById("utcaTabla").getElementsByTagName("tr") );
              
    });
});
