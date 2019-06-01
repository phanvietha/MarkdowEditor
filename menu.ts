import { Menu, MenuItem, BrowserWindow } from 'electron';
import { getFile, createWindow } from './main';


const editMenu = () => new MenuItem({
    label: 'Edit',
    submenu: [
        {
            label: 'Undo',
            accelerator: 'CmdOrCtrl+Z',
            role: 'undo'
        },
        {
            label: 'Redo',
            accelerator: 'CmdOrCtrl+Shift+Z',
            role: 'redo'
        },
        {
            type: 'separator'
        },
        {
            label: 'Cut',
            accelerator: 'CmdOrCtrl+X',
            role: 'cut'
        },
        {
            label: 'Copy',
            accelerator: 'CmdOrCtrl+C',
            role: 'copy'
        },
        {
            label: 'Paste',
            accelerator: 'CmdOrCtrl+V',
            role: 'paste'
        },
    ]
});

const helpMenu = () => new MenuItem({
    label: 'Help',
    submenu: [
        {
            label: 'About',
            // TODO implements show dialog
        }
    ]
});

const fileMenu = () => new MenuItem({
    label: 'File',
    submenu: [
        {
            label: 'New Window',
            click: () => {
                createWindow();
            }
        },
        {
            label: 'Open File',
            click: (_, currentWindow: BrowserWindow) => {
                getFile(currentWindow);
            }
        },
        {
            label: 'Save',
            accelerator: 'CmdOrCtrl+S',
            // role: ''
        },
        {type: 'separator'},
        {
            label: 'Export HTML File',
            click: (_, targetWindow) => {
                targetWindow.webContents.send('export-html');
            }
        },
        {type: 'separator'},
        {
            label: 'Exit',
            accelerator: 'CtrlOrCmd+Shift+W',
            role: 'quit'
        }
    ]
});

export const createMenu = () => {
    return Menu.setApplicationMenu(Menu.buildFromTemplate([
        fileMenu(),
        editMenu(),
        helpMenu()
    ]));
};



