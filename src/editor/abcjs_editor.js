// import library
const abcjs = require('abcjs_basic.js');

// global variables
const saveButton = document.getElementById("saveButton");
const textArea = document.getElementById("abc");
const saveFile = await getAbcSave();

// main statements
await textareaFromFile();
saveButton.addEventListener("click", clickSave);

// use abcjs's Editor
const editor = new abcjs.Editor("abc", { 
    canvas_id: "paper", 
    warnings_id:"warnings",
    abcjsParams: {
        responsive: 'resize',
        /*paddingbottom: 30*/
    }
});
editor.fireChanged();

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
Event handler for clicking save button
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
async function clickSave(event){
    // set file content
    await api.runOnBackend((noteId, content) => api.getNote(noteId).setContent(content), [saveFile.noteId, textArea.value]);
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Set textarea value from save file content
Only for initial load 
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
async function textareaFromFile(){
    // get file content
    const saveData = await api.runOnBackend((id) => api.getNote(id).getContent(), [saveFile.noteId]);

    // display content in textarea
    textArea.value = saveData;
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Get save file from search
Returns: FNote
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
async function getAbcSave(){
    // search for save file
    const searchString = "#abcSave AND note.parents.noteId = '" + api.originEntity.noteId + "'";

    return api.searchForNote(searchString);
}
