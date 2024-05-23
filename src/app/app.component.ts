import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertController,
  LoadingController,
  MenuController,
} from '@ionic/angular';
import { AuthenticationService } from './auth/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private alertController: AlertController,
    private loadCtrl: LoadingController,
    private menuCtrl: MenuController
  ) {}
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Are you sure you want to log out?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          },
        },
        {
          text: 'Yes',
          handler: () => {
            this.logout();
          },
        },
      ],
    });

    await alert.present();
  }

  async logout() {
    const loading = await this.loadCtrl.create({
      message: 'Logging out...',
    });
    await loading.present();
    await this.menuCtrl.close();

    await this.authService.logOut();
    await this.router.navigateByUrl('/login');
    await loading.dismiss();
  }
}
