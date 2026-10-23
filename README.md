# Postarile mele – mini-frontend pentru un API REST

1. Am realizat pagina in trei fisiere: `index.html`, `style.css` si `app.js`.
2. API folosit: https://jsonplaceholder.typicode.com/posts (API REST public de test).
3. La pornire, `fetch()` trimite GET; verific `response.ok` si citesc JSON-ul.
4. Afisez lista folosind `createElement`, `textContent` si `appendChild`, fara `innerHTML`.
5. Sunt tratate trei situatii: „Se incarca...”, eroare si lista goala.
6. Formularul foloseste `label`, `name`, `required`, `min` si `minlength`.
7. La submit folosesc `preventDefault()`, `FormData` si POST cu JSON (`Content-Type: application/json`).
8. La raspuns 201, adaug elementul in lista din JavaScript, fara alt GET.
9. La 4xx afisez textul primit de la server; la erori de retea afisez un mesaj general.
10. Stergerea foloseste DELETE si delegarea evenimentelor pe lista de postari.
11. Cautarea filtreaza local dupa titlu; CSS foloseste `border-box`, Grid si `@media` pentru 360 px.
12. CORS: API-ul de test permite cereri intre origini; permisiunea este data prin headerele serverului, nu din JavaScript. POST si DELETE sunt simulate si nu se salveaza definitiv.

Link site public (GitHub Pages): https://ioancalbaza-spec.github.io/tema-api-PRSW

Link repository GitHub: https://github.com/ioancalbaza-spec/tema-api-PRSW

**Verificare:** deschid `index.html` in browser (sau in VS Code cu Live Server), apoi testez lista, cautarea, adaugarea, stergerea, tabul Network din DevTools si latimea 360 px.
