import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loggedInGuard: boolean = false;
  constructor(
    private auth: AngularFireAuth,
    private toastr: ToastrService,
    private router: Router
  ) {}

  login(email: string, password: string) {
    this.auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        this.toastr.success('Logged In Successfully');
        this.loggedIn.next(true);
        this.loadUser();

        this.loggedInGuard = true;
        this.router.navigate(['']);
      })
      .catch((err) => {
        this.toastr.error(
          'Cannot Login. Please Provide valid email and password '
        );
      });
  }
  loadUser() {
    this.auth.authState.subscribe((user) => {
      localStorage.setItem('user', JSON.stringify(user));
    });
  }
  logout() {
    this.auth.signOut().then(() => {
      this.router.navigate(['/login']);
      localStorage.removeItem('user');
      this.loggedIn.next(false);
      this.loggedInGuard = false;
      this.toastr.success('Logged Out Successfully');
    });
  }
  isLoggedIn() {
    return this.loggedIn.asObservable();
  }
}
