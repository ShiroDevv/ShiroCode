//* Import modules 
import { BrowserWindow, app, ipcMain, dialog } from "electron";
import fs from "node:fs";
import glob from "glob";
import path from "path";

// * When electron is ready, start a window with the contents.
app.whenReady().then(() => {
    const preload = `${__dirname}/resources/preload.js`;
    const window = new BrowserWindow({
        webPreferences: {
            preload,
        },
        autoHideMenuBar: true,
    });

    //* Load the file and show the message.
    window.loadFile(`${process.cwd().replaceAll('\\', '/')}/pages/html/index.html`);
    window.show();

    //* Handle the messages between the renderer and main process.
    handleMessages(window);
});

function handleMessages(window: BrowserWindow) {
    //* When the renderer asks for the file menu, show the menu and send the contents.
    ipcMain.on('fileMenu', async (event, args) => {
        dialog.showOpenDialog({
            title: "Open file",
            filters: [{ name: "TXT", extensions: ["txt"] }],
            buttonLabel: "Select file",
            defaultPath: `${process.cwd()}`,
            properties: ["openFile"],
            message: "Select file to open.",
        }).then(async (value) => {
            //* Read the file into a string.
            let text = fs.readFileSync(value.filePaths[0]).toString();
            //* Send the text back
            const filePath = path.basename(`${value.filePaths[0].replaceAll("\\", "/")}`);

            console.log(filePath);
            window.webContents.executeJavaScript(`
            textContent = \`${text}\`;
            filepath = \`${filePath}\`;
            loadWindow(textContent);
            `)
        })
    })

    //* If requested, open devtools
    ipcMain.on("open-dev", async () => {
        if (window.webContents.isDevToolsOpened()) {
            window.webContents.closeDevTools();
        } else window.webContents.openDevTools();
    });

    ipcMain.on('save-file', async (ev, arg) => {
        const path = arg[0];
        const content = arg[1];

        fs.writeFileSync(path, content);
    });

    ipcMain.on('change-file', async (ev, args) => {
        let file = args;

        let text = fs.readFileSync(file).toString();

        window.webContents.executeJavaScript(`
            textContent = \`${text}\`;
            filepath = \`${file.toString()}\`;
            changeFile(textContent, filepath);
        `);
    });

    ipcMain.on('dirMenu', async (ev, args) => {
        dialog.showOpenDialog({
            title: "Open Directory",
            buttonLabel: "Open",
            defaultPath: `${process.cwd()}`,
            properties: ["openDirectory"],
            message: "Open Directory",
        }).then(async (value) => {
            //* Read the file into a string.
            console.log(value);
            let dirsDirent = getDirs(value.filePaths[0]);
            let dirs: Array<string> = [];
            for (let i = 0; i < dirsDirent.length; i++) {
                dirs.push(dirsDirent[i].name);
            }
            const files = glob.sync(value.filePaths[0].replaceAll("\\", "/") + "/**/*.txt");
            console.log(files);

            window.webContents.executeJavaScript(`
            loadDir("[${files.toString()}]");
        `);
        });
    });

    // ipcMain.on("file-select", (ev, args) => {
    //     const file = args;

    //     let text = fs.readFileSync(args).toString();

    //     window.webContents.executeJavaScript(` 
    //     changeFile("${text}");
    //     `)
    // })
}


const getDirs = (source: string) => fs.readdirSync(source, {
    withFileTypes: true
}).filter((c) => c.isDirectory());