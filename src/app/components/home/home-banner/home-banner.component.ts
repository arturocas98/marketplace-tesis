import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home-banner',
  templateUrl: './home-banner.component.html',
  styleUrls: ['./home-banner.component.css']
})
export class HomeBannerComponent implements OnInit {
  public url_image:String;
  constructor() { 
    this.url_image = environment.url_image;
  }

  ngOnInit(): void {
  }

}
