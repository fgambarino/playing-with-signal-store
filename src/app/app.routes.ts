import {Router, Routes} from '@angular/router';
import {CoreStore} from "@core/core.store";
import {inject} from "@angular/core";

const loggedInGuard = () => {
  const router = inject(Router);
  const coreStore = inject(CoreStore);

  return coreStore.isLoggedIn() ? true : router.parseUrl('/login');
}

export const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'characters'},
  {
    title: 'Character sheet list',
    path: 'characters',
    loadChildren: () => import('./features/character-sheets/character-sheets.routes').then(r => r.CharacterSheetsRoutes),
    canActivate: [loggedInGuard]
  },
  {
    title: "login",
    path: "login",
    loadComponent: () => import('./features/login/login.component'),
  }
];
