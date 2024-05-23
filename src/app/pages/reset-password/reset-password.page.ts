import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/auth/authentication.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  email: any;
  constructor(
    public route: Router,
    public authService: AuthenticationService
  ) {}

  ngOnInit() {}
  async resetPassword() {
    console.log('reset link sent');
    this.authService.resetPassword(this.email).subscribe(() => {
      this.route.navigate(['/login']).catch((error) => {
        this.route.navigate(['/login']);
      });
    });
    this.route.navigate(['/login']);
  }
}
