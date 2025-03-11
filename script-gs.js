import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

// 🔥 Itt másold be a Firebase konfigurációdat 🔥
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

// **Mentés Firestore-ba**
async function mentesFirestoreba1(utca, ember) {
  try {
    await addDoc(collection(db, "parositasok"), {
      utca: utca,
      ember: ember,
      timestamp: new Date()
    });
    alert("Sikeres mentés Firestore-ba!");
  } catch (error) {
    console.error("Hiba mentés közben:", error);
    alert("Hiba történt mentés közben!");
  }
}

function mentesFirestoreba( sorok ) {   
    console.log("Sorok típusa:", typeof sorok);
    console.log("Sorok értéke:", sorok);
  
    sorok.forEach(async (sor) => {
        let utcaNev = sor.cells[0].textContent;
        let szemely = sor.cells[1].querySelector("select").value;
      
        let utcaRef = db.collection("parositas").doc(utcaNev); // Dokumentum az utcanév alapján
        let doc = await utcaRef.get();

        if (doc.exists) {
            // Ha már létezik az utca, frissítjük az adatokat
            await utcaRef.update({
                szemely: szemely
            });
            console.log(`Frissítve: ${utcaNev} -> ${szemely}`);
        } else {
            // Ha még nincs az adatbázisban, új dokumentumot hozunk létre
            await utcaRef.set({
                utca: utcaNev,
                szemely: szemely
            });
            console.log(`Hozzáadva: ${utcaNev} -> ${szemely}`);
        }
    });

    alert("Mentés sikeres!");
}

// **Adatok betöltése Firestore-ból**
async function betoltesFirestorebol() {
  const querySnapshot = await getDocs(collection(db, "parositasok"));
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
  });
}

// **Gombhoz kötött mentés**
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("mentesGomb").addEventListener("click", function () {
        
        mentesFirestoreba( document.getElementById("utcaTabla").getElementsByTagName("tr") );
              
    });
});
