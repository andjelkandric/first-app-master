import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MemosPage } from './memos.page';

const routes: Routes = [
  {
    path: '',
    component: MemosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MemosPageRoutingModule {}
