import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { ElectronService } from 'src/shared/services/electron.service';
import * as md from 'markdown';
import { BrowserWindow, Menu } from 'electron';

@Component({
  selector: 'app-text-area',
  templateUrl: './text-area.component.html',
  styleUrls: ['./text-area.component.scss']
})
export class TextAreaComponent implements OnInit {
  @ViewChild('previewTab' , {static: false}) previewTab: ElementRef;
  inputText: FormControl;
  currentWindow: BrowserWindow;
  mainProcess;
  menu: Menu;
  filePath: string;

  constructor(private electronService: ElectronService) {
    this.inputText = new FormControl();
    this.currentWindow = this.electronService.remote.getCurrentWindow();
    this.mainProcess = this.electronService.remote.require('../out-tsc/main');
  }

  ngOnInit() {
    this.inputOnChange();
    this.listenOpenedFile();
    this.listenExportHtml();
    this.listenSaveFile();
    this.createMenu();
  }

  inputOnChange = () => {
    this.inputText.valueChanges.pipe(debounceTime(300))
    .subscribe(data => {
      this.previewTab.nativeElement.innerHTML = md.markdown.toHTML(data);
    });
  }

  listenOpenedFile = () => {
    this.electronService.ipcRenderer.on('file-opened', (event, filePath, content) => {
      this.filePath = filePath;
      this.inputText.setValue(content);
      this.updateAppTitle(filePath);
    });
  }

  updateAppTitle = (filePath: string) => {
    let title = 'MarkdownEditor';
    if (filePath) {
      title = `${this.electronService.path.basename(filePath)} - ${title}`
    }
    this.currentWindow.setTitle(title);
    this.currentWindow.setDocumentEdited(true);
  }

  listenExportHtml = () => {
    this.electronService.ipcRenderer.on('export-html', () => {
        this.mainProcess.saveAsHtml(this.currentWindow, this.inputText.value);
    })
  }

  createMenu = () => {
    this.menu = this.electronService.remote.Menu.buildFromTemplate([
        { label: 'Cut', role: 'cut' },
        { label: 'Copy', role: 'copy' },
        { label: 'Paste', role: 'paste' },
        { label: 'Select All', role: 'selectall' },
    ])
  }

  onPopupMenu = () => {
    this.menu.popup();
  }

  listenSaveFile = () => {
    this.electronService.ipcRenderer.on('save-file', () => {
      this.mainProcess.saveMarkdown(this.currentWindow, this.filePath, this.inputText.value);
    })
  }
}
