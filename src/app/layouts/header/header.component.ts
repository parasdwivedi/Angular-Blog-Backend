import { JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  user!: string;
  loggedIn$!: Observable<boolean>;
  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');

    if (storedUser !== null) {
      this.user = JSON.parse(storedUser).email;
      console.log(this.user);
    }
    this.loggedIn$ = this.authService.isLoggedIn();
  }

  onLogout() {
    this.authService.logout();
  }
}
