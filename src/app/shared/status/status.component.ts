import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StatusModel, STATUS_STYLES } from '../../enums/status.enum';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit {
  @Input() estado: string;
  public objStyleStatus: StatusModel;
  constructor() { }

  ngOnInit(): void {
   this.objStyleStatus = STATUS_STYLES[this.estado];
  }

  getClass(){
    return `${this.objStyleStatus.bgColor} ${this.objStyleStatus.textColor}`;
  }

}
