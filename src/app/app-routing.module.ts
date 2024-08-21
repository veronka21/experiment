import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PhotoTestComponent } from './Components/photo-test/photo-test.component';
import { MenuComponent } from './Components/menu/menu.component';

const routes: Routes = [
  { path: '',   redirectTo: '/menu', pathMatch: 'full' },
  {path: 'menu', component: MenuComponent},
  {path: 'photo', component: PhotoTestComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
