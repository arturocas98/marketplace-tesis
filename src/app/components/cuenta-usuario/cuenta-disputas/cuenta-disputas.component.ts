import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cuenta-disputas',
  templateUrl: './cuenta-disputas.component.html',
  styleUrls: ['./cuenta-disputas.component.css']
})
export class CuentaDisputasComponent implements OnInit {
  @Input() childItem:any;

  constructor() { }

  ngOnInit(): void {
  }

}
