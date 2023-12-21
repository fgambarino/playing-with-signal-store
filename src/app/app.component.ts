import {Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {CoreStore} from "@core/core.store";
import {AvatarModule} from "primeng/avatar";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AvatarModule],
  templateUrl: './app.component.html',
  styles:`
  .container {
    display: flex;
    justify-content: center;
  }
  #logged {
    float: right;
    display: flex;
    flex-direction: column;
    align-items: center;

    p {
      font-size: 16px;
    }

    a {
      text-decoration: none;
      font-size: 14px;
    }
  }`
})
export class AppComponent {
  coreStore = inject(CoreStore)
}
