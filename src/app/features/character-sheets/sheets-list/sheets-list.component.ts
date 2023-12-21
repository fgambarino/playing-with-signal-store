import {Component, inject} from '@angular/core';
import {ListStore} from "@character-sheets/sheets-list/list.store";
import {ButtonModule} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {CardComponent} from "@character-sheets/components/card/card.component";
import {DatePipe} from "@angular/common";
import {ProgressBarModule} from "primeng/progressbar";

@Component({
  selector: 'app-sheets-list',
  standalone: true,
  imports: [ButtonModule, InputTextModule, CardComponent, DatePipe, ProgressBarModule ],
  providers: [ListStore],
  template: `
    @if (listStore.isLoading()) {
      <p-progressBar mode="indeterminate"/>
    }
    <h2>Available character sheets</h2>
    <input #search pInputText placeholder="Search by name" (input)="listStore.searchChanged(search.value)"/>
    <br>
    <div class="list-container">
      @for (char of listStore.characters();track char.id) {
        <app-card [title]="char.name">
          <div class="button-container">
            <p-button label="edit" (onClick)="listStore.editChar(char.id)"/>
            <p-button severity="danger" label="delete" (onClick)="listStore.deleteChar(char.id)"/>
          </div>
        </app-card>
      } @empty {
        <p>No characters found</p>
      }
    </div>
    @if (listStore.count()) {
      <p>Number of characters found: {{ listStore.count() }}</p>
    }
    <p-button label="add one" (onClick)="listStore.addOneChar()"/>
  `,
  styles: `
  .list-container{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 40px;
    padding-top: 50px;
  }

  p-progressBar {
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
  }

  .button-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  `
})
export default class SheetsListComponent {
  readonly listStore = inject(ListStore);

}
