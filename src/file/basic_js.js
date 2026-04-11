// import library
const abcjs = require('abcjs_basic.js');

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Renders from a single div, somewhat equivalent to a single .abc file
A file (aka 'tunebook') can have multiple tunes
abcjs renders one tune in one div
Returns whatever abcjs.renderAbc returns
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function renderAbcFile(fileObj){
    // get text from div
    const fileStr = fileObj.innerText;
    
    // get number of tunes to create more divs as required
    let tunesNum = abcjs.numberOfTunes(fileStr);
    const divArray = [];
    for (let i = 0; i < tunesNum; i++){
        
        // create new div
        // Temporal string to ensure unique id across files
        let newDiv = document.createElement("div");
        newDiv.id = "tune_" + Temporal.Now.instant().toString() + "_" + i;
        
        // insert after the file div
        divArray.unshift(newDiv.id);
        fileObj.parentNode.insertBefore(newDiv,fileObj.nextSibling);
    }

    // render with abcjs
    return abcjs.renderAbc(divArray, fileStr);
}

const files = document.getElementsByClassName("abc_file");
for (let i = 0; i < files.length; i ++){
    renderAbcFile(files[i]);
}