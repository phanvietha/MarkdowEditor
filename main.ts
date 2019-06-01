import { app, BrowserWindow, dialog } from 'electron';
import * as url from 'url';
import * as path from 'path';
import * as fs from 'fs';

import { createMenu } from './menu';

// Store all window oject
const windowSet: Set<BrowserWindow> = new Set();

const fileMap: Map<BrowserWindow, any> = new Map();

// Create window
export const createWindow = () => {
    let x, y;
    const focusedWindow = BrowserWindow.getFocusedWindow();

    // Move next opening window offset left and top 10px
    if (focusedWindow) {
        [x, y] = focusedWindow.getPosition();
        x = x + 20;
        y = y + 20;
    }

    let window = new BrowserWindow({
        x,
        y,
        show: false,
        width: 700,
        height: 700,
        webPreferences: {
            nodeIntegration: true
        },
    });

    windowSet.add(window);

    // Production
    window.loadURL(url.format({
        slashes: true,
        protocol: 'file',
        pathname: path.join(__dirname, '..', 'mark-down', 'index.html')
    }));


    window.webContents.openDevTools();

    window.once('ready-to-show', () => {
        window.show();
    });

    window.on('closed', () => {
        stopWatchingFile(window);
        windowSet.delete(window);
        window = null;
    })
    return window;
}

// App Ready then create window
app.on('ready', () => {
    createMenu();
    createWindow();
});

app.on('will-finish-launching', () => {
    app.on('open-file', (event, filePath) => { // Macos
        const window = createWindow();
        window.once('ready-to-show', () => {
            openFile(window, filePath);
        })

    })
});

export const getFile = (targetWindow: BrowserWindow) => {
    const files = dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [
            {
                name: 'Markdown Files', extensions: [
                    'mdown', 'mkdn', 'md', 'mkd', 'mdwn', 'mdtxt', 'mdtext', 'text', 'Rmd'
                ]
            }
        ]
    });

    if (files) {
        const filePath = files[0];
        openFile(targetWindow, filePath);
    }
};

const openFile = (targetWindow, filePath) => {
    const content = fs.readFileSync(filePath).toString();
    targetWindow.webContents.send('file-opened', filePath, content);
    app.addRecentDocument(filePath);
    startWatchingFile(targetWindow, filePath);
}


export const saveAsHtml = (targetWindow, content) => {
    const filePath = dialog.showSaveDialog(targetWindow, {
        title: 'Export HTML',
        defaultPath: app.getPath('home'),
        filters: [
            {
                name: 'HTML File', extensions: ['html', 'htm']
            }
        ]
    })

    if (filePath) {
        fs.writeFileSync(filePath, content);
    }
}

const startWatchingFile = (targetWindow: BrowserWindow, filePath: string) => {
    stopWatchingFile(targetWindow);
    const watcher = fs.watch(filePath, (eventType, filename) => {
        console.log('sdds');
        if (eventType === 'change') {
            openFile(targetWindow, filePath);
        }
    })
    fileMap.set(targetWindow, watcher)
}


const stopWatchingFile =  (targetWindow: BrowserWindow) => {
    if (fileMap.has(targetWindow)) {
        fileMap.get(targetWindow).close();
        fileMap.delete(targetWindow);
    }
}

