import {Routes} from "@angular/router";

export const CharacterSheetsRoutes: Routes = [
  {
    path: '',
    pathMatch: "full",
    redirectTo: 'list'
  },
  {
    path: 'list',
    title: 'Characters list',
    loadComponent: () => import("./sheets-list/sheets-list.component")
  },
  {
    path: 'new',
    title: 'Create character sheet',
    loadComponent: () => import("./character-sheet/character-sheet.component")
  },
  {
    path: ':id/edit',
    title: 'Edit character sheet',
    loadComponent: () => import("./character-sheet/character-sheet.component")
  }
]
