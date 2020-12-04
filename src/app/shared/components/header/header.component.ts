import { Component, OnInit } from '@angular/core';
import { CategoriaService } from 'src/app/core/categoria/categoria.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  url_image: string;
  public categorias: any;
  public title_list: any[];
  constructor(
    private categoriaService: CategoriaService
  ) {
    this.url_image = environment.url_image;
    this.categorias = [];
    this.title_list = [];
  }

  ngOnInit(): void {
    this.getAll();

  }

  getAll() {
    this.categoriaService.getAll().subscribe(
      res => {
        this.categorias = res;
        console.log(this.categorias);
        for (const i in this.categorias) {
          this.title_list.push(JSON.parse(this.categorias[i].titulo_lista));
          console.log("title_list:",this.title_list);
        }
      }, err => {
        console.log(err);
      }
    );

  }

}
