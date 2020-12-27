import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../core/usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private usuarioService:UsuarioService,
    private router:Router,
    ){}
  canActivate(): Promise<boolean>{
    return new Promise(resolve=>{
      this.usuarioService.authActivate().then(resp=>{
        if (!resp) {
          this.router.navigateByUrl("/login");
          resolve(false);   
        }else{
          resolve(true);
        }
      });
    })
  }
  
}
