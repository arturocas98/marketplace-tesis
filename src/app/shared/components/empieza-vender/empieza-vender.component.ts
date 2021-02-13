import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-empieza-vender',
  templateUrl: './empieza-vender.component.html',
  styleUrls: ['./empieza-vender.component.css']
})
export class EmpiezaVenderComponent implements OnInit {

	path:string = environment.url_image;
  constructor() { }

  ngOnInit(): void {
  }

}
