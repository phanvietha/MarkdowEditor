import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { ElectronService } from 'src/shared/services/electron.service';
import * as md from 'markdown';
import { BrowserWindow } from 'electron';

@Component({
  selector: 'app-text-area',
  templateUrl: './text-area.component.html',
  styleUrls: ['./text-area.component.scss']
})
export class TextAreaComponent implements OnInit {
  @ViewChild('previewTab' , {static: false}) previewTab: ElementRef;
  inputText: FormControl;
  currentWindow: BrowserWindow;

  constructor(private electronService: ElectronService) {
    this.inputText = new FormControl();
    this.currentWindow = this.electronService.remote.getCurrentWindow();
  }

  ngOnInit() {
    this.inputOnChange();
    this.listenOpenedFile();
  }

  inputOnChange = () => {
    this.inputText.valueChanges.pipe(debounceTime(300))
    .subscribe(data => {
      this.previewTab.nativeElement.innerHTML = md.markdown.toHTML(data);
    });
  }

  listenOpenedFile = () => {
    this.electronService.ipcRenderer.on('file-opened', (event, filePath, content) => {
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
}
