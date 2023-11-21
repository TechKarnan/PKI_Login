import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {
  issuerName:any;
  constructor(private router: Router) {
    this.issuerName=this.router.getCurrentNavigation()?.extras.state?.['name'];
    console.log(this.router.getCurrentNavigation()?.extras.state);
  }
}
