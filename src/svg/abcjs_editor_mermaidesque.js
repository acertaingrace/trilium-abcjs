/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
abcjs editor code adapted to load with widget
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

async function main(){
    // import library
    const abcjs = require('abcjs_basic.js');

    // set colour of svg when saved to 'main-text-color' of trilium theme
    let mainTextColour = getComputedStyle(document.documentElement).getPropertyValue('--main-text-color');

    // 'global' variables
    const saveButton = document.getElementById("saveButton");
    const textArea = document.getElementById("abc");
    const saveFile = await getAbcSave();
    console.log(saveFile);

    // main statements
    await textareaFromFile(saveFile, textArea);
    saveButton.addEventListener("click", function(){clickSave(undefined,saveFile,textArea)});
    
    // use abcjs's Editor
    const editor = new abcjs.Editor("abc", { 
        canvas_id: "paper", 
        warnings_id:"warnings",
        abcjsParams: {
            responsive: 'resize',
            foregroundColor: mainTextColour,
            /*paddingbottom: 30*/
        }
    });
    
    editor.fireChanged();
}

module.exports.main = main;

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
Event handler for clicking save button
Mermaidesque: save to save.abc & svg
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
async function clickSave(event, saveFile, textArea){
    // set save file content
    await api.runOnBackend((noteId, content) => api.getNote(noteId).setContent(content), [saveFile.noteId, textArea.value]);

    // set svg content
    const canvas = document.getElementById("paper");
    // svg doesn't display in trilium without this
    canvas.getElementsByTagName("svg")[0].setAttribute("xmlns","http://www.w3.org/2000/svg");
    await api.runOnBackend((noteId, content) => api.getNote(noteId).setContent(content), [api.getActiveContextNote().noteId, canvas.innerHTML]);
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Set textarea value from save file content
Only for initial load 
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
async function textareaFromFile(saveFile, textArea){
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
    const searchString = "#abcSave AND note.parents.noteId = '" + api.getActiveContextNote().noteId + "'";
    return api.searchForNote(searchString);
}
