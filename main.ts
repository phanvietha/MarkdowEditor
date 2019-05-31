import { app, BrowserWindow, dialog } from 'electron';
import * as url from 'url';
import * as path from 'path';
import * as fs from 'fs';

import { createMenu } from './menu';

// Store all window oject
const windowSet: Set<BrowserWindow> = new Set();

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
        windowSet.delete(window);
        window = null;
    })
}

// App Ready then create window
app.on('ready', () => {
    createMenu();
    createWindow();
});

export const openFile = (targetWindow: BrowserWindow) => {
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
        const content = fs.readFileSync(filePath).toString();
        targetWindow.webContents.send('file-opened', filePath, content);
    }
};

