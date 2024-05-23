import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  map,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Memo } from 'src/memo.model';
import { AuthenticationService } from '../auth/authentication.service';
interface MemoData {
  title: string;
  content: string;
  createdAt: any;
  userId: string;
  idMemo: string;
}
@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  private _memos = new BehaviorSubject<Memo[]>([]);
  get favorites(): Observable<Memo[]> {
    return this._memos.asObservable();
  }
  constructor(
    private authService: AuthenticationService,
    private http: HttpClient
  ) {}

  addToFavorites(
    title: string,
    content: string,
    createdAt: any,
    idMemo: string
  ) {
    let generatedId: string;
    const userId: string = this.authService.getUserId();
    console.log(content, createdAt, title, userId, idMemo);
    return this.http
      .post<{ name: string }>(
        `${
          environment.firebaseRDBUrl
        }/favorites.json?auth=${this.authService.getToken()}`,
        {
          idMemo,
          title,
          content,
          createdAt,
          userId,
        }
      )
      .pipe(
        switchMap((resData) => {
          generatedId = resData.name;
          return this._memos;
        }),
        take(1),
        tap((memos) => {
          this._memos.next(
            memos.concat({
              id: idMemo,
              title,
              content,
              createdAt,
              userId,
              idMemo: idMemo,
            })
          );
        })
      );
  }

  getMemos() {
    return this.http
      .get<{ [key: string]: MemoData }>(
        `${
          environment.firebaseRDBUrl
        }/favorites/.json?auth=${this.authService.getToken()}&orderBy="userId"&equalTo="${this.authService.getUserId()}"`
      )
      .pipe(
        map((memosData: any) => {
          const memos: Memo[] = [];
          for (const key in memosData) {
            memos.push({
              id: key,
              title: memosData[key].title,
              content: memosData[key].content,
              createdAt: memosData[key].createdAt,
              userId: memosData[key].userId,
              idMemo: memosData[key].idMemo,
            });
          }
          return memos;
        }),
        tap((memos) => {
          this._memos.next(memos);
        })
      );
  }

  getMemoById(id: string) {
    return this.http
      .get<MemoData>(
        `${
          environment.firebaseRDBUrl
        }/favorites/${id}.json?auth=${this.authService.getToken()}`
      )
      .pipe(
        map((resData) => {
          return {
            id,
            title: resData.title,
            content: resData.content,
            userId: resData.userId,
            createdAt: resData.createdAt,
            idMemo: resData.idMemo,
          };
        })
      );
  }

  // updateFav(
  //   id: string,
  //   title: string,
  //   content: string,
  //   createdAt: any,
  //   userId: string
  // ) {
  //   console.log('fav service update');

  //   console.log(id, title, content, createdAt, userId);

  //   return this.http
  //     .put(
  //       `${
  //         environment.firebaseRDBUrl
  //       }/favorites/${id}.json?auth=${this.authService.getToken()}`,
  //       { content, createdAt, title, userId }
  //     )
  //     .pipe(
  //       switchMap(() => this._memos),
  //       take(1),
  //       tap((memos) => {
  //         const updatedMemoIndex = memos.findIndex((q) => q.id === id);
  //         const updatedMemos = [...memos];

  //         updatedMemos[updatedMemoIndex] = {
  //           id,
  //           content,
  //           createdAt,
  //           title,
  //           userId,
  //         };
  //         this._memos.next(updatedMemos);
  //       })
  //     )
  //     .subscribe({
  //       next: (response) => {
  //         console.log('Favo updated successfully', response);
  //       },
  //       error: (error) => {
  //         console.error('Error updating fav', error);
  //       },
  //     });
  // }
  updateFav(idMemo: string, title: string, content: string, createdAt: any) {
    return this.http
      .get<{ [key: string]: MemoData }>(
        `${
          environment.firebaseRDBUrl
        }/favorites.json?auth=${this.authService.getToken()}&orderBy="idMemo"&equalTo="${idMemo}"`
      )
      .pipe(
        switchMap((resData) => {
          const key = Object.keys(resData)[0];
          return this.http.put(
            `${
              environment.firebaseRDBUrl
            }/favorites/${key}.json?auth=${this.authService.getToken()}`,
            {
              title,
              content,
              createdAt,
              idMemo,
              userId: this.authService.getUserId(),
            }
          );
        }),
        tap(() => {
          this._memos.pipe(take(1)).subscribe((memos) => {
            const updatedMemoIndex = memos.findIndex(
              (m) => m.idMemo === idMemo
            );
            if (updatedMemoIndex > -1) {
              const updatedMemos = [...memos];
              updatedMemos[updatedMemoIndex] = {
                ...updatedMemos[updatedMemoIndex],
                title,
                content,
                createdAt,
              };
              this._memos.next(updatedMemos);
            }
          });
        })
      );
  }

  // deleteFav(id: string) {
  //   return this.http
  //     .delete(
  //       `${
  //         environment.firebaseRDBUrl
  //       }/favorites/${id}.json?auth=${this.authService.getToken()}`
  //     )
  //     .pipe(
  //       switchMap(() => {
  //         const deleted = this._memos.value.filter((f) => f.id !== id);

  //         this._memos.next(deleted);
  //         return of(deleted);
  //       })
  //     )
  //     .subscribe({
  //       next: (response) => {
  //         console.log('Memo deleted successfully', response);
  //       },
  //       error: (error) => {
  //         console.error('Error deleting memo', error);
  //       },
  //     });
  // }
  deleteFav(idMemo: string) {
    return this.http
      .get<{ [key: string]: MemoData }>(
        `${
          environment.firebaseRDBUrl
        }/favorites.json?auth=${this.authService.getToken()}&orderBy="idMemo"&equalTo="${idMemo}"`
      )
      .pipe(
        switchMap((resData) => {
          const key = Object.keys(resData)[0];
          return this.http.delete(
            `${
              environment.firebaseRDBUrl
            }/favorites/${key}.json?auth=${this.authService.getToken()}`
          );
        }),
        tap(() => {
          this._memos.pipe(take(1)).subscribe((memos) => {
            this._memos.next(memos.filter((m) => m.idMemo !== idMemo));
          });
        })
      );
  }
}
