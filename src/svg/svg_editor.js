/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
snippet - drawio-esque
Adapted from trilium-drawio
(https://github.com/SiriusXT/trilium-drawio)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
// when you close & exit with button, it's fine, but if you switch tabs, it dies.
// import library
const abcjs_editor = require('abcjs_editor_mermaidesque.js');

var defaultTheme = "0"; 	// 0:light;1:dark;,2:Follow software theme styles

var themeStyle = getComputedStyle(document.documentElement).getPropertyValue('--theme-style');
var $last_image_wrapper;	// Used to detect tab switching
var last_noteId;			// For detection and switching of new tab pages
var id_svg_dict = {};

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Edit mode
Hides normal image display & replaces with drawio iframe
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/*async*/ 
function edit(noteId) {
    // remove 'click' event handler
	$('div.component.note-split:not(.hidden-ext) div.component.scrolling-container div.note-detail.component div.note-detail-image-wrapper').off("click");

	let svg = id_svg_dict[noteId];
    
    // hide the normal image display
	$("div.component.note-split:not(.hidden-ext) .note-detail-image-wrapper .note-detail-image-view").css("display", "none");
    
    // create <div> for entire mermaidesque editor to be inserted in
	const div_main = document.createElement('div');
    div_main.classList.add("mermaidesque");
    
    // the entire html of abcjs editor - mermaidesque
    div_main.innerHTML = '<div class="flex"><div><textarea id="abc" cols="50">%%text loading...</textarea></div><div id="paper"></div></div><div id="savepanel"> <div id="savediv"><button id="saveButton" type="button">Save</button></div><div id="warndiv"><b>Render warnings:</b><div id="warnings"></div></div></div>';
    $('div.component.note-split:not(.hidden-ext) .note-detail-image-wrapper').append(div_main);

    abcjs_editor.main();

    // add buttons for 'theme switcher', 'full screen', 'close'
	$('div.component.note-split:not(.hidden-ext) .note-detail-image-wrapper div.mermaidesque').prepend(`<div class="drawio-iframe" style=" position: absolute; border-radius: 5px; color:#837d7d; box-shadow: inset 0 0 0 1px rgb(0 0 0 / 11%), inset 0 -1px 0 0 rgb(0 0 0 / 8%), 0 1px 2px 0 rgb(0 0 0 / 4%);
 right: 8px; top: 8px;  padding: 0px 4px; ">
<div class="drawio-switch-theme bx" title="Drawio Switch Theme" style="cursor: pointer; padding: 6px;"></div>
<div class="drawio-switch-full-screen bx" title="Drawio Switch Full Screen" style=" cursor: pointer; padding: 6px;">
</div><div class="drawio-save-and-close bx" title="Drawio Close and Exit" style=" cursor: pointer; padding: 6px;">
</div></div>`);

    // Drawio Switch Theme
	$('div.component.note-split:not(.hidden-ext) .note-detail-image-wrapper div.mermaidesque .drawio-switch-theme.bx').click(function (event) {
		event.stopPropagation();
		var $iframe_tmp = $("div.component.note-split:not(.hidden-ext) div.note-detail-image-wrapper div.iframe-drawio");
		if ($iframe_tmp.length > 0) {
			if ($iframe_tmp.hasClass("dark")) {
				$iframe_tmp.removeClass("dark");
			}
			else {
				$iframe_tmp.addClass("dark");
			}
		}
		else {
			const $iframe_tmp = $("body > div.mermaidesque");
			if ($iframe_tmp.hasClass("dark")) {
				$iframe_tmp.removeClass("dark");
			}
			else {
				$iframe_tmp.addClass("dark");
			}
		}
	});

    // Drawio full screen
	$('div.component.note-split:not(.hidden-ext) .note-detail-image-wrapper div.mermaidesque .drawio-switch-full-screen.bx').click(function (event) {
		event.stopPropagation();
		const $iframe_tmp = $("div.component.note-split:not(.hidden-ext) .note-detail-image-wrapper div.mermaidesque");
		if ($iframe_tmp.length > 0) {
			$iframe_tmp.appendTo($(parent.document).find("body"));
			$iframe_tmp.css("position", "fixed");
			$(".tab-row-filler").css("-webkit-app-region", "none");
		}
		else {
			const $iframe_tmp = $("body > div.mermaidesque");
			$iframe_tmp.appendTo($("div.component.note-split:not(.hidden-ext) .note-detail-image-wrapper"));
			$iframe_tmp.css("position", "");
			$(".tab-row-filler").css("-webkit-app-region", "drag");
		}

	});
	
    // Close and exit button
	$('div.component.note-split:not(.hidden-ext) .note-detail-image-wrapper div.mermaidesque .drawio-save-and-close.bx').click(function (event) {
		event.stopPropagation();
		close();
	})

    // close function
	var close = function () {
		id_svg_dict[noteId] = svg;
		//window.removeEventListener('message', receive);

        // close edit display
		if ($("div.component.note-split:not(.hidden-ext) .note-detail-image-wrapper div.mermaidesque").length > 0) {
			$("div.component.note-split:not(.hidden-ext) .note-detail-image-wrapper div.mermaidesque").remove();
		}
		else {
			$("body > div.mermaidesque").remove();
			$(".tab-row-filler").css("-webkit-app-region", "drag");
		}

        // revert back to normal image display
		$("div.component.note-split:not(.hidden-ext) .note-detail-image-wrapper img.note-detail-image-view").css("display", "block");
		var img = $("div.component.note-split:not(.hidden-ext) .note-detail-image-wrapper img.note-detail-image-view");
		img.attr("src", img.attr("src"));

        // set click event handler
		$('div.component.note-split:not(.hidden-ext) div.component.scrolling-container div.note-detail.component div.note-detail-image-wrapper').click(noteId, function () {
			edit(noteId);
		});
	};
};

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Add click event handler to edit function
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
function addClick(noteId, autoEdit) {
	var $img = $('div.component.note-split:not(.hidden-ext) div.component.scrolling-container div.note-detail.component img.note-detail-image-view');

    // if image has neither dark or light class yet
    if (!$img.hasClass('dark') && !$img.hasClass('light')) {
		// detach current click event handler
        $('div.component.note-split:not(.hidden-ext) div.component.scrolling-container div.note-detail.component div.note-detail-image-wrapper').off("click");

        // attach new click event handler
		$('div.component.note-split:not(.hidden-ext) div.component.scrolling-container div.note-detail.component div.note-detail-image-wrapper').click(noteId, function () {
            edit(noteId);
		});
	}

    console.log("addClick: " + $img);
	
    if (themeStyle.indexOf('dark') >= 0) { $img.addClass('dark'); }
	else if (themeStyle.indexOf('light') >= 0) { $img.addClass('light'); }
	
    if (autoEdit) {
		edit(noteId);
	}
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Class definition of widget
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
class abcjsSnippet extends api.NoteContextAwareWidget {
	get position() {
		return 100;
	}

    // widget in content area
    get parentWidget() {
		return 'center-pane';
	}

    // css styling
	doRender() {
		this.$widget = $(`<style type="text/css">
        div.mermaidesque{
            width: 100%;
            height: 100%;
        }
        img.note-detail-image-view{        
            transform: none !important;
            width: max-content;
            max-width: 100%;
            height: max-content;
            max-height: 100%;
        } 
        img.note-detail-image-view.dark {
            filter: invert(88%) hue-rotate(180deg);
        }
        div.mermaidesque.dark{
            filter: invert(88%) hue-rotate(180deg);
        }
        .mermaidesque iframe {
			border:0;
			right:0;
			bottom:0;
			width:100%;
			height:100%
		}
        div.mermaidesque{
            z-index: 100;
            border:0;
            right:0;
            bottom:0;
            width:100%;
            height:100%
        }
        .drawio-switch-theme.bx::before {
            content: "\\ec34";
        }
        .drawio-switch-full-screen.bx::before {
            content: "\\eaeb";
        }
        .drawio-save-and-close.bx::before {
            content: "\\ec8d";
        }
        .flex {
            display: flex;
            width: 90%;
        }
        /*.flex > div {
            width: 50%;
        }*/
        #abc{
            height: 70vh;
        }
        #savepanel {
            display: flex;
            position: sticky;
            bottom: 0;
            background: #2e3440;
        }
        #savediv {
            margin-right: 10vw;
        }
        #warndiv {
            width: 100%;
        }
        #warnings {
            overflow-y: auto;
            max-height: 15vh;
        }
</style>`);
		return this.$widget;
	}

    // refresh
	async refreshWithNote(note) {
        console.log("refreshWithNote");
		let noteId = note.noteId;
		var autoEdit = false;

        // get note content
		id_svg_dict[noteId] = (await note.getBlob()).content;

        // ensure template svg has default svg (?)
		if (note.hasLabel("originalFileName") && note.getLabel("originalFileName").value == "abcjs.svg" && (await note.getBlob()).content == undefined) {
			id_svg_dict[noteId] = `<svg xmlns:xlink="http://www.w3.org/1999/xlink" role="img" fill="currentColor" stroke="currentColor" aria-label="Sheet Music" viewBox="0 0 770 94.617" preserveAspectRatio="xMinYMin meet" style="display: inline-block; position: absolute; top: 0px; left: 0px;"><title>Sheet Music</title><g><g><path d="M 15 36.64 L 55.05 36.64 L 55.05 37.34 L 15 37.34 z" stroke="none" fill="currentColor" class="abcjs-top-line"></path><path d="M 15 44.39 L 55.05 44.39 L 55.05 45.09 L 15 45.09 z" stroke="none" fill="currentColor"></path><path d="M 15 52.14 L 55.05 52.14 L 55.05 52.84 L 15 52.84 z" stroke="none" fill="currentColor"></path><path d="M 15 59.89 L 55.05 59.89 L 55.05 60.59 L 15 60.59 z" stroke="none" fill="currentColor"></path><path d="M 15 67.64 L 55.05 67.64 L 55.05 68.34 L 15 68.34 z" stroke="none" fill="currentColor"></path></g><g class="" fill="currentColor" stroke="none" data-name="staff-extra clef"><path data-name="clefs.G" d="M 29.689999999999998 22.832000000000008c 0.09 -0.09 0.24 -0.06 0.36 0c 0.12 0.09 0.57 0.6 0.96 1.11c 1.77 2.34 3.21 5.85 3.57 8.73c 0.21 1.56 0.03 3.27 -0.45 4.86c -0.69 2.31 -1.92 4.47 -4.23 7.44c -0.3 0.39 -0.57 0.72 -0.6 0.75c -0.03 0.06 0 0.15 0.18 0.78c 0.54 1.68 1.38 4.44 1.68 5.49l 0.09 0.42l 0.39 0c 1.47 0.09 2.76 0.51 3.96 1.29c 1.83 1.23 3.06 3.21 3.39 5.52c 0.09 0.45 0.12 1.29 0.06 1.74c -0.09 1.02 -0.33 1.83 -0.75 2.73c -0.84 1.71 -2.28 3.06 -4.02 3.72l -0.33 0.12l 0.03 1.26c 0 1.74 -0.06 3.63 -0.21 4.62c -0.45 3.06 -2.19 5.49 -4.47 6.21c -0.57 0.18 -0.9 0.21 -1.59 0.21c -0.69 0 -1.02 -0.03 -1.65 -0.21c -1.14 -0.27 -2.13 -0.84 -2.94 -1.65c -0.99 -0.99 -1.56 -2.16 -1.71 -3.54c -0.09 -0.81 0.06 -1.53 0.45 -2.13c 0.63 -0.99 1.83 -1.56 3 -1.53c 1.5 0.09 2.64 1.32 2.73 2.94c 0.06 1.47 -0.93 2.7 -2.37 2.97c -0.45 0.06 -0.84 0.03 -1.29 -0.09l -0.21 -0.09l 0.09 0.12c 0.39 0.54 0.78 0.93 1.32 1.26c 1.35 0.87 3.06 1.02 4.35 0.36c 1.44 -0.72 2.52 -2.28 2.97 -4.35c 0.15 -0.66 0.24 -1.5 0.3 -3.03c 0.03 -0.84 0.03 -2.94 0 -3c -0.03 0 -0.18 0 -0.36 0.03c -0.66 0.12 -0.99 0.12 -1.83 0.12c -1.05 0 -1.71 -0.06 -2.61 -0.3c -4.02 -0.99 -7.11 -4.35 -7.8 -8.46c -0.12 -0.66 -0.12 -0.99 -0.12 -1.83c 0 -0.84 0 -1.14 0.15 -1.92c 0.36 -2.28 1.41 -4.62 3.3 -7.29l 2.79 -3.6c 0.54 -0.66 0.96 -1.2 0.96 -1.23c 0 -0.03 -0.09 -0.33 -0.18 -0.69c -0.96 -3.21 -1.41 -5.28 -1.59 -7.68c -0.12 -1.38 -0.15 -3.09 -0.06 -3.96c 0.33 -2.67 1.38 -5.07 3.12 -7.08c 0.36 -0.42 0.99 -1.05 1.17 -1.14zm 2.01 4.71c -0.15 -0.3 -0.3 -0.54 -0.3 -0.54c -0.03 0 -0.18 0.09 -0.3 0.21c -2.4 1.74 -3.87 4.2 -4.26 7.11c -0.06 0.54 -0.06 1.41 -0.03 1.89c 0.09 1.29 0.48 3.12 1.08 5.22c 0.15 0.42 0.24 0.78 0.24 0.81c 0 0.03 0.84 -1.11 1.23 -1.68c 1.89 -2.73 2.88 -5.07 3.15 -7.53c 0.09 -0.57 0.12 -1.74 0.06 -2.37c -0.09 -1.23 -0.27 -1.92 -0.87 -3.12zm -2.94 20.7c -0.21 -0.72 -0.39 -1.32 -0.42 -1.32c 0 0 -1.2 1.47 -1.86 2.37c -2.79 3.63 -4.02 6.3 -4.35 9.3c -0.03 0.21 -0.03 0.69 -0.03 1.08c 0 0.69 0 0.75 0.06 1.11c 0.12 0.54 0.27 0.99 0.51 1.47c 0.69 1.38 1.83 2.55 3.42 3.42c 0.96 0.54 2.07 0.9 3.21 1.08c 0.78 0.12 2.04 0.12 2.94 -0.03c 0.51 -0.06 0.45 -0.03 0.42 -0.3c -0.24 -3.33 -0.72 -6.33 -1.62 -10.08c -0.09 -0.39 -0.18 -0.75 -0.18 -0.78c -0.03 -0.03 -0.42 0 -0.81 0.09c -0.9 0.18 -1.65 0.57 -2.22 1.14c -0.72 0.72 -1.08 1.65 -1.05 2.64c 0.06 0.96 0.48 1.83 1.23 2.58c 0.36 0.36 0.72 0.63 1.17 0.9c 0.33 0.18 0.36 0.21 0.42 0.33c 0.18 0.42 -0.18 0.9 -0.6 0.87c -0.18 -0.03 -0.84 -0.36 -1.26 -0.63c -0.78 -0.51 -1.38 -1.11 -1.86 -1.83c -1.77 -2.7 -0.99 -6.42 1.71 -8.19c 0.3 -0.21 0.81 -0.48 1.17 -0.63c 0.3 -0.09 1.02 -0.3 1.14 -0.3c 0.06 0 0.09 0 0.09 -0.03c 0.03 -0.03 -0.51 -1.92 -1.23 -4.26zm 3.78 7.41c -0.18 -0.03 -0.36 -0.06 -0.39 -0.06c -0.03 0 0 0.21 0.18 1.02c 0.75 3.18 1.26 6.3 1.5 9.09c 0.06 0.72 0 0.69 0.51 0.42c 0.78 -0.36 1.44 -0.96 1.98 -1.77c 1.08 -1.62 1.2 -3.69 0.3 -5.55c -0.81 -1.62 -2.31 -2.79 -4.08 -3.15z"></path></g><g class="" fill="currentColor" stroke="none" data-name="bar"><path d="M 54.05 67.99L 54.05 36.99L 54.65 36.99L 54.65 67.99z" data-name="bar"></path></g></g></svg>`;
			note.mime = "image/svg+xml";
			autoEdit = true;
			api.runAsyncOnBackendWithManualTransactionHandling(async (NoteId, svg) => {
				const Note = await api.getNote(NoteId);
				Note.setContent(svg);
				Note.mime = "image/svg+xml";
				Note.title = Note.title + ".abcjs.svg"
				Note.save();
			}, [noteId, id_svg_dict[noteId]]);
            console.log("Default svg definition");
		}

        console.log("Before document ready");
        // run when document is ready
		$(document).ready(function () {
            console.log("Document ready!");
            // detect if tab has been changed
			let ischangeTab = false;
			if ($last_image_wrapper != undefined && $last_image_wrapper.length > 0) {
				window.last_image_wrapper = $last_image_wrapper;
				$.each($last_image_wrapper.parents(), function (index, value) {
					var truecount = 0;
					$.each(value.classList, function (index1, classL) {
						if (classL == "note-split") { truecount += 1; }
						else if (classL == "hidden-ext") { truecount += 1; }
					});
					if (truecount == 2) {
						ischangeTab = true;
					}
				});
			}
			if (last_noteId != undefined && last_noteId == noteId) {
				ischangeTab = true;
			}
			$last_image_wrapper = $("div.component.note-split:not(.hidden-ext) div.scrolling-container.component");
			last_noteId = noteId;

            console.log("isChangeTab: " + ischangeTab);

            // if tab hasn't changed
			if (!ischangeTab) {
				if ($("div.component.note-split:not(.hidden-ext) div.note-detail-image-wrapper div.mermaidesque").length > 0) { $("div.component.note-split:not(.hidden-ext) div.note-detail-image-wrapper div.mermaidesque").remove(); }
				if ($("div.component.note-split:not(.hidden-ext) .note-detail-printable.component div.note-detail-image-wrapper img.note-detail-image-view").length > 0) { $("div.component.note-split:not(.hidden-ext) .note-detail-printable.component div.note-detail-image-wrapper img.note-detail-image-view").css("display", "block"); }
				$('div.component.note-split:not(.hidden-ext) .note-detail-printable.component .note-detail-image-wrapper').off("click");
				
                var $img = $('div.component.note-split:not(.hidden-ext) .note-detail-printable.component img.note-detail-image-view');
				if ($img.length > 0) {
					if ($img.hasClass('dark')) { $img.removeClass('dark') }
					if ($img.hasClass('light')) { $img.removeClass('light') }
				}
			}

            // if note isn't the right svg, return
            if (note.mime != "image/svg+xml" /*|| id_svg_dict[noteId].indexOf("mxfile") < 0*/) { 
                console.log("Mime wrong or mxfile?");
                return; }
            if (!(note.hasLabel("originalFileName")) || note.getLabel("originalFileName").value != "abcjs.svg"){
                console.log("Not right abc save file");
                return;}

            console.log("Right file at least");

            setTimeout(function () {
                // When switching tabs, if the iframe is already loaded, return
				if ($("div.component.note-split:not(.hidden-ext) .note-detail-image-wrapper div.mermaidesque").length > 0) { 
                    console.log("Iframe already loaded");
                    return; };
                addClick(noteId, autoEdit);
			}, 10);
			
            $("div.ribbon-tab-title.active").click();
		});
	}

    // reload
	async entitiesReloadedEvent({ loadResults }) {
        console.log("entitiesReloadedEvent");
		if (loadResults.isNoteContentReloaded(this.noteId)) {
			this.refresh();
		}
	}
}

module.exports = new abcjsSnippet();

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Reset (remove editor) before unloading
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
window.onbeforeunload = function () {
	if ($("div.component.note-split:not(.hidden-ext) .note-detail-image-wrapper div.mermaidesque").length > 0) {
		$("div.component.note-split:not(.hidden-ext) .note-detail-image-wrapper div.mermaidesque").remove();
	}
	else {
		$("body > div.mermaidesque").remove();
		$(".tab-row-filler").css("-webkit-app-region", "drag");
	}
};
