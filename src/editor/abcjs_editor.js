// import libraries
const abcjs = require('abcjs_basic.js');
const hljs = require('highlight.min.js');
const hljsAbc = require('hljs_abc');

// global variables
const saveButton = document.getElementById("saveButton");
const textArea = document.getElementById("abc");			// highlightjs div
const invText = document.getElementById("invisibleText");	// textarea
const saveFile = await getAbcSave();

// main statements
await textareaFromFile();
saveButton.addEventListener("click", clickSave);

// to loophole over contenteditable div vs textarea-abcjs editor
textArea.innerHTML = invText.value;
invText.addEventListener("input", function(){
    textArea.innerHTML = invText.value;
});
invText.addEventListener("scroll", function(){
    $('#abc').scrollTop($('#invisibleText').scrollTop());
});

/* attempting to select contenteditable div text directly
preserved for posterity
textArea.addEventListener("selectstart", function(){
    await textareaFromFile();
    var selection = document.getSelection();
    console.log(selection);
    invText.setSelectionRange(selection.anchorOffset, selection.focusOffset);
    console.log("Selecting " + selection.anchorOffset + " to " + selection.focusOffset);
});*/

// use abcjs's Editor
const editor = new abcjs.Editor("invisibleText", {
    canvas_id: "paper", 
    warnings_id:"warnings",
    abcjsParams: {
        responsive: 'resize',
        /*paddingbottom: 30*/
    }
});
editor.fireChanged();

// use highlight.js & hljs-abc
hljs.registerLanguage("abc", hljsAbc.main);
hljs.highlightAll();

// redoing highlighting when content is edited
invText.addEventListener("input", function(){
    console.log("Text edited - highlighting all...");
    textArea.removeAttribute('data-highlighted');
    hljs.highlightAll();
});

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
Event handler for clicking save button
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
async function clickSave(event){
    // set file content
    await api.runOnBackend((noteId, content) => api.getNote(noteId).setContent(content), [saveFile.noteId, invText.value]);
    //await api.runOnBackend((noteId, content) => api.getNote(noteId).setContent(content), [saveFile.noteId, textArea.innerText]);
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Set textarea value from save file content
Only for initial load 
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
async function textareaFromFile(){
    // get file content
    const saveData = await api.runOnBackend((id) => api.getNote(id).getContent(), [saveFile.noteId]);

    // display content in textarea
    invText.value = saveData;
    //textArea.textContent = saveData;
    //textArea.value = "X:1\nK:D\nDD AA|BBA2|\n";
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
