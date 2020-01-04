import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { RouteGuardService } from '@services/route-guard-service/route-guard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full'
  },
  {
    path: 'splash',
    loadChildren: './pages/splash/splash.module#SplashPageModule'
  },
  {
    path: 'main',
    loadChildren: './pages/main/main.module#MainPageModule',
    canActivate: [RouteGuardService]
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
