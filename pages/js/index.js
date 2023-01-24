//* Since I am making this be single page, we need to show and hide elements.
let headerDiv = document.getElementById("heading");
let codingDiv = document.getElementById("coding");
let textElement = document.getElementById("text");
let fileHolder = document.getElementById("fileHolder");
let currentFile = document.getElementsByClassName("file");
let sidebar = document.getElementById("sidebar")

//* Create file info variables
let textContent = "";
let filepath = "";

//* Watch for the ctrl-s combination and change the names, and save based off of it
textElement.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 's') {
        document.getElementsByClassName("current")[0].innerText = document.getElementsByClassName("current")[0].id;
        e.preventDefault();
        ipcRenderer.send('save-file', [filepath, textElement.value]);
    } else if (!(e.ctrlKey && e.key === 's') && !(e.ctrlKey || e.metaKey || e.altKey) && !document.getElementsByClassName("current")[0].innerText.includes("*")) {
        document.getElementsByClassName("current")[0].innerText = document.getElementsByClassName("current")[0].innerText + "*";
    }
})

//* When you choose to load a file, show menu and run function (Done in src/index.ts)
function loadfile() {
    ipcRenderer.send('fileMenu');
}

//* Load the window and watch for the ctrl-s combination.
function loadWindow(text) {
    if (document.getElementById(filepath)) return document.getElementById(filepath).click();
    currentFile[0].id = filepath;
    //* Unhide the divs
    headerDiv.hidden = true;
    codingDiv.hidden = false;
    //* Set the elements text content.
    textElement.textContent = text;

    //* Make a button and give it the onclick function 
    let button = document.createElement("button");
    button.onclick = () => {
        currentFile[0].id = button.id;
        // ipcRenderer.send('change-file', button.id);
    };

    //* set the button id and text, the append it to the fileHolder
    button.id = filepath;
    button.innerText = filepath;
    fileHolder.appendChild(button);

    button.classList.add("current");

}

function changeFile(text, path) {
    currentFile[0].id = path;

    for (let i = 0; i < document.getElementsByClassName("current").length; i++) {
        document.getElementsByClassName("current")[i].classList.remove("current");
    }

    document.getElementById(path).classList.add("current");

    textElement.value = text;
}

// function loadDirectory() {
//     ipcRenderer.send('dirMenu');
// }

// function loadDir(files) {
//     headerDiv.hidden = true;
//     codingDiv.hidden = false;
//     console.log(files);
//     files = files.replace("[", "").replace("]", "").split(",");
//     for (let i = 0; i < files.length; i++) {
//         //* Make a button and give it the onclick function
//         let button = document.createElement("button");
//         button.onclick = () => {

//         };

//         //* set the button id and text, the append it to the fileHolder
//         button.id = files[i];
//         button.innerText = files[i];
//         sidebar.appendChild(button);
//     }
// }