import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {CardModule} from "primeng/card";

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CardModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p-card [header]="title">
      <ng-content/>
    </p-card>
  `,
  styles: ``
})
export class CardComponent {
@Input() title ='';
}
