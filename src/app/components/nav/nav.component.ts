import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  isLoggedIn: any;

  constructor(
    private authService: AuthService,
    private router: Router
  ){
  }

ngOnInit() {
  }

  logout(){
    this.authService.logout();
    this.router.navigate(["/login"]);
    this.isLoggedIn = false;
  }

}
