import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cuenta-mensajes',
  templateUrl: './cuenta-mensajes.component.html',
  styleUrls: ['./cuenta-mensajes.component.css']
})
export class CuentaMensajesComponent implements OnInit {
  @Input() childItem:any;

  constructor() { }

  ngOnInit(): void {
  }

}
