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
async function mentesFirestoreba(utca, ember) {
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
        let sorok = document.getElementById("utcaTabla").getElementsByTagName("tr");

        for (let sor of sorok) {
            let utcaNev = sor.cells[0].textContent;
            let szemely = sor.cells[1].querySelector("select").value;
            
            // Firestore-ba mentés
            mentesFirestoreba(utcaNev, szemely);
        }
    });
});
