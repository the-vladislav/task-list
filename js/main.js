document.forms.create.onsubmit = function (e) {
    let newNote = this.elements.note.value;
    addNote(newNote);
    this.reset();
    showNotes();
    e.preventDefault();
}

function getNotes() {
    let noteJSON = localStorage.getItem("notes");
    if (noteJSON) {
        let noteArray = JSON.parse(noteJSON);
        if (noteArray) {
            return noteArray;
        }
    }
    return [];
}

function saveNotes(notes) {
    let notesJSON = JSON.stringify(notes);
    localStorage.setItem("notes", notesJSON);
}

function addNote(note) {
    let notes = getNotes();
    notes.push(note);
    saveNotes(notes);
}

function delNote(index) {
    let notes = getNotes();
    notes.splice(index, 1);
    saveNotes(notes);
}

function editNode(indexOfEditNote) {
    let notes = getNotes();

    let popup = openModal();
    let edit = popup.querySelector("#popupText");
    let subm = popup.querySelector("#popupEdit");
    localStorage.setItem("indexOfEditNote", indexOfEditNote);
    subm.onclick = changeValue;
    edit.value = notes[indexOfEditNote];

}

function editModalListener(e) {
    showNotes();
    e.preventDefault();
}

function changeValue(e) {
    let indexForChange = localStorage.getItem("indexOfEditNote");
    localStorage.removeItem("indexOfEditNote");

    console.log(indexForChange);
    let edit = document.querySelector("#popupText");
    let notes = getNotes();
    notes[indexForChange] = edit.value;
    saveNotes(notes);

    let popup = document.querySelector(".popup");
    closeModal(popup);
    showNotes();
    e.preventDefault();
}

function modalWindow(notes, indexOfEditNote) {

    return notes;
}

function openModal() {
    let popup = document.querySelector(".popup");
    popup.classList.remove("popupClose");
    popup.classList.add("popupOpen");
    return popup;
}

function closeModal(popup) {
    popup.classList.remove("popupOpen");
    popup.classList.add("popupClose");
}

function showNotes() {
    let notes = getNotes();
    let tbody = document.querySelector("#notes > tbody");;
    let notesHTML = notes.reduce((total, note, i) => {
        return `${total}
                <tr>
                    <td>${i + 1}</td>
                    <td>${note}</td>
                    <td>
                        <form name="del">
                            <input type="hidden" name="index" value="${i}"/>
                            <input type="submit" value="delete"/>
                            <input type="submit" value="edit"/>
                        </form>
                    </td>
                </tr>`;
    }, '');
    tbody.innerHTML = notesHTML;
    // let delForms = document.getElementsByName("del");
    let delForms = document.querySelectorAll("form[name='del']");

    let delInputs = [];
    let editInputs = [];
    console.log("********");
    for(let item of delForms) {
        delInputs.push(item.querySelector("input[value='delete']"));
        editInputs.push(item.querySelector("input[value='edit']"));
    }

    console.log("form");
    delInputs.forEach((form) => {
        console.log(form);
        form.onclick = delListener;
    });

    editInputs.forEach((form) => {
        console.log(form);
        form.onclick = editListener;
    });

}

function editListener(e) {
    // let indexOfDelNote = parseInt(this.elements.index.value);
    let indexOfEditNote = parseInt(this.parentElement.children.index.value);
    console.log("this");
    console.log(this);
    // delNote(indexOfEditNote);
    editNode(indexOfEditNote);
    showNotes();
    e.preventDefault();
}

function delListener(e) {
    // let indexOfDelNote = parseInt(this.elements.index.value);
    let indexOfDelNote = parseInt(this.parentElement.children.index.value);
    console.log("this");
    console.log(this);
    delNote(indexOfDelNote);
    showNotes();
    e.preventDefault();
}

showNotes();
