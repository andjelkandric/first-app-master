import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: HomePage,
    children: [
      {
        path: 'memos',
        loadChildren: () =>
          import('./memos/memos.module').then((m) => m.MemosPageModule),
      },

      {
        path: 'favorites',
        loadChildren: () =>
          import('./favorites/favorites.module').then(
            (m) => m.FavoritesPageModule
          ),
      },
      {
        path: '',
        redirectTo: '/home/tabs/memos',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/home/tabs/memos',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
