import { app, BrowserWindow } from 'electron';
import * as url from 'url';
import * as path from 'path';

const createWindow = () => {
    const window  = new BrowserWindow({
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
    createWindow();
})

