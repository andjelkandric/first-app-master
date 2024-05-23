import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  IonModal,
  ModalController,
  ToastController,
  ViewWillEnter,
} from '@ionic/angular';
import { MemoComponent } from 'src/app/memo/memo.component';
import { MemoService } from 'src/app/service/memo.service';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { Memo } from 'src/memo.model';
import { AuthenticationService } from 'src/app/auth/authentication.service';
// import { MemoPage } from '../memo/memo.page';

@Component({
  selector: 'app-memos',
  templateUrl: './memos.page.html',
  styleUrls: ['./memos.page.scss'],
})
export class MemosPage implements OnInit, ViewWillEnter, OnDestroy {
  @ViewChild(IonModal) modal: IonModal;

  title: string;
  content: string;
  createdAt: any;
  formattedDate: any;

  memos: Memo[];
  memosSub: Subscription;
  constructor(
    private authService: AuthenticationService,
    private memoService: MemoService,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.memosSub = this.memoService.memos.subscribe((memos) => {
      this.memos = memos;
      console.log('memos');
      console.log(this.memos);

      this.memos.forEach((memo) => {
        this.formattedDate = moment(memo.createdAt).format(
          'YYYY-MM-DD HH:mm:ss'
        );
        console.log(this.formattedDate);
        memo.createdAt = this.formattedDate;
      });
    });

    // this.authService.getProfile().subscribe((user) => {
    //   if (user != null) {
    //     this.userId = user.uid;
    //     this.memoService.getMemos(this.userId).subscribe((res) => {
    //       this.memos = res;
    //       this.memos.forEach((memo) => {
    //         this.formattedDate = moment(memo.createdAt.toDate()).format(
    //           'YYYY-MM-DD HH:mm:ss'
    //         );
    //         console.log(this.formattedDate);
    //         memo.createdAt = this.formattedDate;
    //         this.createdAt = this.formattedDate;
    //       });
    //     });
    //   }
    // });
  }
  ionViewWillEnter() {
    this.memoService.getMemos().subscribe();
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
    this.title = '';
    this.content = '';
  }

  confirm() {
    this.modal.dismiss('confirm');
    this.addMemo();
    this.title = '';
    this.content = '';
  }
  async openMemo(memo: Memo) {
    const modal = await this.modalCtrl.create({
      component: MemoComponent,
      componentProps: { id: memo.id },
      breakpoints: [0, 0.5, 0.8],
      initialBreakpoint: 0.6,
    });
    await modal.present();
  }
  addMemo() {
    this.memoService.addMemo(this.title, this.content, new Date()).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({
          message: 'Memo added successfully',
          duration: 2000,
        });
        toast.present();
      },
      async (error) => {
        const toast = await this.toastCtrl.create({
          message: error.message || 'An error occurred',
          duration: 2000,
        });
        toast.present();
      }
    );
  }
  // async addMemo() {
  //   try {
  //     await this.memoService.addMemo(this.title, this.content, new Date())
  //       .toPromise;

  //     const toast = await this.toastCtrl.create({
  //       message: 'Memo added successfully',
  //       duration: 2000,
  //     });
  //     toast.present();
  //   } catch (error) {
  //     const toast = await this.toastCtrl.create({
  //       message: error,
  //       duration: 2000,
  //     });
  //     toast.present();
  //   }
  // }

  ngOnDestroy() {
    if (this.memosSub) {
      this.memosSub.unsubscribe();
    }
  }
}
