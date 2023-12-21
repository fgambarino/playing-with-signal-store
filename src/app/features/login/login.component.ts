import {Component, inject} from '@angular/core';
import {CoreStore} from "@core/core.store";
import {InputTextModule} from 'primeng/inputtext';
import {FormsModule} from "@angular/forms";
import {ButtonModule} from "primeng/button";
import {BadgeModule} from "primeng/badge";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [InputTextModule, ButtonModule, BadgeModule, FormsModule],
  template: `
    <div class="container">
      <h2>Restricted area, are you Federico?</h2>
      <input placeholder="username" pInputText type="text" [(ngModel)]="username">
      <input placeholder="password" pInputText type="password" [(ngModel)]="pwd">
      <p-button label="Login" (onClick)="login(username, pwd)"/>
    </div>

  `,
  styles: `.container{
   display: flex;
   flex-direction: column;
   width: 500px;
   padding-top: 30%;
   gap: 20px;
   align-items: center;
  }
  `
})
export default class LoginComponent {
  readonly coreStore = inject(CoreStore);
  username = '';
  pwd = '';

  login(username: string, pwd: string){
    this.coreStore.logIn({username, pwd})
  }
}
