import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/auth/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  regForm: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public authService: AuthenticationService,
    public router: Router,
    public alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.regForm = new FormGroup({
      name: new FormControl('User', Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(7),
      ]),
    });
  }

  async signUp() {
    if (this.regForm.valid) {
      console.log('register');

      console.log(this.regForm);
      this.authService.register(this.regForm.value).subscribe({
        next: (resData) => {
          this.router.navigateByUrl('/login');
          console.log('Reg succ ');
        },
        error: async (errRes) => {
          let message = 'Incorrect email or password';

          const alert = await this.alertCtrl.create({
            header: 'Authentication failed',
            message,
            buttons: ['Okay'],
          });
          await alert.present();
          this.regForm.reset();
        },
      });
    }
  }
}
