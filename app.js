const API_URL = "https://jsonplaceholder.typicode.com/posts";

const formular = document.querySelector("#formular");
const lista = document.querySelector("#lista-postari");
const mesajLista = document.querySelector("#mesaj-lista");
const mesajFormular = document.querySelector("#mesaj-formular");
const cautare = document.querySelector("#cautare");
const butonAdauga = document.querySelector("#buton-adauga");

let postari = [];

// Mesajul de deasupra listei: incarcare, eroare sau lista goala.
function arataMesaj(text, eroare = false) {
    mesajLista.textContent = text;
    mesajLista.className = eroare ? "mesaj eroare" : "mesaj";
}

// Construim fiecare postare folosind elemente HTML, nu innerHTML.
function afiseazaPostari() {
    lista.replaceChildren();
    const textCautat = cautare.value.toLowerCase().trim();
    let numarAfisate = 0;

    postari.forEach(function (postare, index) {
        if (!postare.title.toLowerCase().includes(textCautat)) {
            return;
        }

        const element = document.createElement("li");
        element.className = "postare";

        const titlu = document.createElement("h3");
        titlu.textContent = postare.title;

        const continut = document.createElement("p");
        continut.textContent = postare.body;

        const butonSterge = document.createElement("button");
        butonSterge.type = "button";
        butonSterge.textContent = "Șterge";
        butonSterge.className = "buton-sterge";
        butonSterge.dataset.index = index;

        element.appendChild(titlu);
        element.appendChild(continut);
        element.appendChild(butonSterge);
        lista.appendChild(element);
        numarAfisate++;
    });

    if (postari.length === 0) {
        arataMesaj("Lista este goală.");
    } else if (numarAfisate === 0) {
        arataMesaj("Nu există postări cu acest titlu.");
    } else {
        arataMesaj("");
    }
}

// GET: cerem lista de postari de la API cand se deschide pagina.
async function incarcaPostari() {
    arataMesaj("Se încarcă...");
    try {
        const raspuns = await fetch(API_URL);
        if (!raspuns.ok) {
            throw new Error("HTTP " + raspuns.status);
        }
        postari = await raspuns.json();
        if (!Array.isArray(postari)) {
            throw new Error("Răspunsul nu este o listă.");
        }
        afiseazaPostari();
    } catch (eroare) {
        lista.replaceChildren();
        arataMesaj("Eroare la încărcare: " + eroare.message, true);
    }
}

// POST: preluam campurile si trimitem JSON fara refresh.
formular.addEventListener("submit", async function (eveniment) {
    eveniment.preventDefault();
    mesajFormular.textContent = "";
    mesajFormular.className = "mesaj";

    const date = new FormData(formular);
    const postareNoua = {
        userId: Number(date.get("userId")),
        title: date.get("title").trim(),
        body: date.get("body").trim()
    };

    if (!postareNoua.title || !postareNoua.body) {
        mesajFormular.textContent = "Completează toate câmpurile.";
        return;
    }

    butonAdauga.disabled = true;
    try {
        const raspuns = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(postareNoua)
        });

        if (!raspuns.ok) {
            if (raspuns.status >= 400 && raspuns.status < 500) {
                const mesajServer = await raspuns.text();
                mesajFormular.textContent = "Eroare " + raspuns.status + ": " +
                    (mesajServer || "Cerere respinsă de server.");
            } else {
                mesajFormular.textContent = "Eroare de server (" + raspuns.status + ").";
            }
            mesajFormular.className = "mesaj eroare";
            return;
        }

        if (raspuns.status === 201) {
            const postareCreata = await raspuns.json();
            postari.unshift(postareCreata);
            cautare.value = "";
            afiseazaPostari();
            formular.reset();
            mesajFormular.textContent = "Postarea a fost adăugată în listă.";
        } else {
            mesajFormular.textContent = "Răspuns neașteptat (" + raspuns.status + ").";
            mesajFormular.className = "mesaj eroare";
        }
    } catch (eroare) {
        mesajFormular.textContent = "Eroare de rețea. Încearcă din nou.";
        mesajFormular.className = "mesaj eroare";
    } finally {
        butonAdauga.disabled = false;
    }
});

// Cautam in postari fara o alta cerere la API.
cautare.addEventListener("input", afiseazaPostari);

// DELETE: un singur listener pe lista (delegarea evenimentelor).
lista.addEventListener("click", async function (eveniment) {
    const buton = eveniment.target.closest(".buton-sterge");
    if (!buton) {
        return;
    }

    const index = Number(buton.dataset.index);
    const postare = postari[index];
    if (!postare) {
        return;
    }

    buton.disabled = true;
    try {
        const raspuns = await fetch(API_URL + "/" + postare.id, {
            method: "DELETE"
        });
        if (!raspuns.ok) {
            throw new Error("HTTP " + raspuns.status);
        }
        // La DELETE nu citim JSON: unele API-uri raspund cu 204, fara body.
        postari.splice(index, 1);
        afiseazaPostari();
    } catch (eroare) {
        arataMesaj("Nu s-a putut șterge: " + eroare.message, true);
        buton.disabled = false;
    }
});

incarcaPostari();
