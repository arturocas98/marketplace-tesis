import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/core/usuario/usuario.service';

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.component.html',
  styleUrls: ['./cuenta.component.css']
})
export class CuentaComponent implements OnInit {
  
  constructor(private usersService: UsuarioService) { }

  ngOnInit(): void {
    this.usersService.authActivate().then(resp =>{
   			
      if(!resp){

        window.open("login", "_top")

      }
    })
  }

}
