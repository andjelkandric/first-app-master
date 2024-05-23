// import { inject } from '@angular/core';
// import { catchError, map, of, pipe } from 'rxjs';
// import {
//   ActivatedRouteSnapshot,
//   CanActivateFn,
//   Router,
//   RouterStateSnapshot,
// } from '@angular/router';
// import { AuthenticationService } from '../auth/authentication.service';

// export const authGuard: CanActivateFn = (
//   route: ActivatedRouteSnapshot,
//   state: RouterStateSnapshot
// ) => {
//   const authService = inject(AuthenticationService);
//   const router = inject(Router);

//   if (localStorage.getItem('token') != null) {
//     return true;
//   } else {
//     router.navigate(['/login']);
//     return false;
//   }
//   // return authService.getProfile().pipe(
//   //   map(() => true),
//   //   catchError(() => {
//   //     void router.navigate(['login']);
//   //     return of(false);
//   //   })
//   // );
// };

// // import { pipe } from 'rxjs';
// // import { Injectable } from '@angular/core';
// // import { CanActivate, Router } from '@angular/router';
// // import { Observable } from 'rxjs';
// // import { map, take } from 'rxjs/operators';
// // import { AuthenticationService } from '../authentication.service';

// // @Injectable({
// //   providedIn: 'root',
// // })
// // export class AuthGuard implements CanActivate {
// //   constructor(
// //     private authService: AuthenticationService,
// //     private router: Router
// //   ) {}

// //   canActivate(): Observable<boolean> {
// //     return this.authService.getProfile().pipe(
// //       take(1),
// //       map((user) => {
// //         if (user) {
// //           return true;
// //         } else {
// //           this.router.navigate(['/login']);
// //           return false;
// //         }
// //       })
// //     );
// //   }
// // }
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../auth/authentication.service';

export const authGuard = () => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  if (!authService.isUserAuthenticated) {
    router.navigateByUrl('/login');
  }

  return authService.isUserAuthenticated;
};
