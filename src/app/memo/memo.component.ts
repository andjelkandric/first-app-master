import { Component, Input, OnInit } from '@angular/core';
import { MemoService } from '../service/memo.service';
import { ModalController, ToastController } from '@ionic/angular';
import { FavoriteService } from '../service/favorite.service';
import { Memo } from 'src/memo.model';
import { of, switchMap } from 'rxjs';

@Component({
  selector: 'app-memo',
  templateUrl: './memo.component.html',
  styleUrls: ['./memo.component.scss'],
})
export class MemoComponent implements OnInit {
  @Input() id: string;

  userId: any;
  title: string;
  content: string;
  createdAt: any;
  formattedDate: any;
  memos: Memo[] = [];
  memo: Memo;
  constructor(
    private memoService: MemoService,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private favService: FavoriteService
  ) {}

  ngOnInit() {
    this.memoService.getMemoById(this.id).subscribe((res) => {
      console.log('ngOnInit');

      console.log(res.id);
      this.memo = res;
    });
  }
  async updateMemo() {
    this.memoService.updateMemo(
      this.id,
      this.memo.title,
      this.memo.content,
      new Date(),
      this.memo.userId
    );

    const toast = await this.toastCtrl.create({
      message: 'Memo updated!',
      duration: 2000,
    });
    toast.present();
    this.modalCtrl.dismiss();
  }

  async deleteMemo() {
    this.memoService.deleteMemo(this.id);
    this.modalCtrl.dismiss();
  }
  addToFavorites() {
    console.log('id od dodate fav');

    console.log(this.memo.id);

    this.favService
      .getMemos()
      .pipe(
        switchMap((res) => {
          console.log('vraceni fav memosi');

          console.log(res);
          this.memos = res || [];

          const memoExists = this.memos.some((f) => {
            return f.idMemo === this.memo.id;
          });

          if (!memoExists) {
            console.log('memo koji se dodaje', this.memo);

            return this.favService.addToFavorites(
              this.memo.title,
              this.memo.content,
              this.memo.createdAt,
              this.memo.id
            );
          } else {
            console.log('Memo već postoji u omiljenima');
            // Emitovanje praznog observable-a ako memo već postoji

            this.presentToast('Memo is already in favorites');
            return of(null);
          }
        })
      )
      .subscribe({
        next: (result) => {
          if (result) {
            this.memos.push(this.memo);
            this.presentToast('Memo added to favorites!');
          }
        },
        error: (error) => {
          console.error('Greška prilikom dodavanja u favorite', error);
        },
      });
  }
  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
    });
    toast.present();
  }
}
