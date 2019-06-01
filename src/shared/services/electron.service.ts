import { Injectable } from '@angular/core';

import { ipcRenderer, remote } from 'electron';
import * as path from 'path';

declare global {
    interface Window {
        require;
    }
}

@Injectable({
    providedIn: 'root'
})
export class ElectronService {
    ipcRenderer: typeof ipcRenderer;
    path: typeof path;
    remote: typeof remote

    constructor() {
        if (this.isInElectron()) {
            this.remote = window.require('electron').remote;
            this.ipcRenderer = window.require('electron').ipcRenderer;
            this.path = window.require('path');
        }
    }

    isInElectron = () => {
        return window.require;
    }
}