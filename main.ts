import { app, BrowserWindow, dialog } from 'electron';
import * as url from 'url';
import * as path from 'path';
import * as fs from 'fs';


import { createMenu } from './menu';

// Create window
const createWindow = () => {
    const window = new BrowserWindow({
        show: false,
        width: 700,
        height: 700
    });
    // Production
    // window.loadURL(url.format({
    //     slashes: true,
    //     protocol: 'file',
    //     pathname: path.join('..', 'mark-down', 'index.html')
    // }));

    // develop
    window.loadURL('http://localhost:4200/')

    window.once('ready-to-show', () => {
        window.show();
    });
}

// App Ready then create window
app.on('ready', () => {
    createMenu();
    createWindow();
});

export const openFile = () => {
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
        const content = fs.readFileSync(files[0]).toString();
    }
};

