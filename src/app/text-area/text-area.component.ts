import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { ElectronModuleService } from 'src/shared/services/electron-module.service';
import * as md from 'markdown';

@Component({
  selector: 'app-text-area',
  templateUrl: './text-area.component.html',
  styleUrls: ['./text-area.component.scss']
})
export class TextAreaComponent implements OnInit {
  @ViewChild('previewTab' , {static: false}) previewTab: ElementRef;
  inputText: FormControl;

  constructor(private electronModule: ElectronModuleService) {
    this.inputText = new FormControl();
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
    this.electronModule.ipcRenderer.on('file-opened', (event, filePath, content) => {
      this.inputText.setValue(content);
    });
  }

}
