import { Injectable } from '@angular/core';

import { ipcRenderer } from 'electron';

declare global {
    interface Window {
        require;
    }
}

@Injectable({
    providedIn: 'root'
})
export class ElectronModuleService {
    ipcRenderer: typeof ipcRenderer;
    
    constructor() {
        if (this.isInElectron()) {
            this.ipcRenderer = window.require('electron').ipcRenderer;
        }
    }

    isInElectron = () => {
        return window.require;
    }
}