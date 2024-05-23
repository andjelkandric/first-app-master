import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/auth/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  constructor(
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public authService: AuthenticationService,
    public router: Router,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    // this.loginForm = this.formBuilder.group({
    //   email: [
    //     '',
    //     [
    //       Validators.required,
    //       Validators.email,
    //       Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
    //     ],
    //   ],
    //   password: [
    //     '',
    //     [
    //       Validators.required,
    //       Validators.pattern(
    //         '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-8])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}'
    //       ),
    //     ],
    //   ],
    // });
  }
  // get errorControl() {
  //   return this.loginForm?.controls;
  // }

  login(loginForm: NgForm) {
    if (loginForm.valid) {
      this.authService.logIn(loginForm.value).subscribe({
        next: (resData) => {
          this.router.navigateByUrl('/home/tabs/memos');
          console.log('login user');
          console.log(this.authService.user);
        },
        error: async (errRes) => {
          let message = 'Incorrect email or password';

          const alert = await this.alertCtrl.create({
            header: 'Authentication failed',
            message,
            buttons: ['Okay'],
          });
          await alert.present();
          loginForm.reset();
        },
      });
    }

    // const loading = await this.loadingCtrl.create();
    // await loading.present();
    // if (this.loginForm?.valid) {
    //   const user = await this.authService
    //     .logIn(this.loginForm.value.email, this.loginForm.value.password)
    //     .catch((error) => {
    //       console.log('unauthorized');
    //       loading.dismiss();
    //     });
    //   if (user) {
    //     loading.dismiss();
    //     console.log(user);
    //     localStorage.setItem('token', user.user.email),
    //       this.route.navigate(['/home']);
    //   } else {
    //     console.log('Provide correct values.');
    //     loading.dismiss();
    //   }
    // } else {
    //   loading.dismiss();
    //   console.log('Provide correct values.');
    // }
  }
}
