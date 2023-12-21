import {Component, effect, inject, Input, OnInit} from '@angular/core';
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {FormsModule} from "@angular/forms";
import {CharacterStore} from "@character-sheets/character-sheet/character.store";
import {Character} from "@api/characters.service";

@Component({
  selector: 'app-character-sheet',
  standalone: true,
  imports: [InputTextModule, ButtonModule, FormsModule],
  providers: [CharacterStore],
  template: `
    <div class="container">
      <a href="javascript:void(0)" (click)="backToList()">Go back to list page</a>
      <h2>Character sheet</h2>
      <input placeholder="name" pInputText type="text" [(ngModel)]="character.name"
             (ngModelChange)="updateStoredModel()">
      <div>
        <label>Strength</label><input pInputText type="number" max="25" min="1" [(ngModel)]="character.strength"
               (ngModelChange)="updateStoredModel()">
        <span>modifier: {{ modifiers().strength }}</span>
      </div>
      <div>
        <label>Dexterity</label><input pInputText type="number" max="25" min="1" [(ngModel)]="character.dexterity"
               (ngModelChange)="updateStoredModel()">
        <span>modifier: {{ modifiers().dexterity }}</span>
      </div>
      <div>
        <label>Constitution</label><input pInputText type="number" max="25" min="1"
               [(ngModel)]="character.constitution" (ngModelChange)="updateStoredModel()">
        <span>modifier: {{ modifiers().constitution }}</span>
      </div>
      <div>
        <label>Intelligence</label><input pInputText type="number" max="25" min="1"
               [(ngModel)]="character.intelligence" (ngModelChange)="updateStoredModel()">
        <span>modifier: {{ modifiers().intelligence }}</span>
      </div>
      <div>
        <label>Wisdom</label><input pInputText type="number" max="25" min="1" [(ngModel)]="character.wisdom"
               (ngModelChange)="updateStoredModel()">
        <span>modifier: {{ modifiers().wisdom }}</span>
      </div>
      <div>
        <label>Charisma</label><input pInputText type="number" max="25" min="1" [(ngModel)]="character.charisma"
               (ngModelChange)="updateStoredModel()">
        <span>modifier: {{ modifiers().charisma }}</span>
      </div>
      <div class="inventory">
        <h4>Inventory</h4>
        <div>
          <input placeholder="add item" pInputText type="text" #itemToAdd/>
          <p-button label="add item" (onClick)="pushItem(itemToAdd.value); itemToAdd.value = ''"/>
        </div>
        <ul>
          @for (item of character.inventory; track $index) {
            <li>{{ item }} <i class="pi pi-trash" (click)="characterStore.removeItem($index)"></i></li>
          }
        </ul>
        <p>Total weight carried {{ characterStore.totalKgCarried() }} Kg</p>
      </div>
      <p-button label="Save" (onClick)="save()"/>
    </div>

  `,
  styles: `
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;

    div {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 20px;
    }

    .inventory {
      flex-direction: column;
    }

    .pi-trash {
      cursor: pointer;
    }
  }
  `
})
export default class CharacterSheetComponent implements OnInit {
  characterStore = inject(CharacterStore);
  character: Omit<Character, 'id'> = {
    name: '',
    strength: 1,
    dexterity: 1,
    constitution: 1,
    intelligence: 1,
    wisdom: 1,
    charisma: 1,
    inventory: []
  }
  modifiers = this.characterStore.modifiers;

  @Input('id') // from routing
  characterId: number | undefined;

  constructor() {
    effect(() => {
      const character = this.characterStore.character!();
      if (character) {
        this.character = character;
      }
    })
  }

  ngOnInit(): void {
    if (this.characterId)
      this.characterStore.loadCharacterSheet(this.characterId)
  }

  backToList() {
    this.characterStore.goToList();
  }

  pushItem(itemToAdd: string) {
    this.characterStore.addItemToInventory(itemToAdd)
  }

  updateStoredModel() {
    this.characterStore.updateStoredCharacter(this.character);
  }

  save() {
    this.characterStore.insertOrUpdate({id: this.characterId, characterSubmitted: this.character});
  }
}
