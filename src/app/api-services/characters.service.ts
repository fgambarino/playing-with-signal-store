import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {delay, Observable} from "rxjs";

const baseUrl = "http://localhost:3002/";

export type Character = {
  id: number;
  name: string;
  strength: number;
  dexterity: number;
  constitution: number;
  wisdom: number;
  intelligence: number;
  charisma: number;
  inventory: string[];
}
const delayToDramaticEffect = () => delay(700);

@Injectable({providedIn: "root"})
export class CharactersService {
  private http = inject(HttpClient)

  getSheetsByName(name: string) {
    if (!name)
      return this.http.get<Character[]>(`${baseUrl}characters`).pipe(delayToDramaticEffect()) as Observable<Character[]>

    return this.http.get<Character[]>(`${baseUrl}characters?name_like=${name}`).pipe(delayToDramaticEffect()) as Observable<Character[]>
  }

  getSheet(id: number) {
    return this.http.get<Character>(`${baseUrl}characters/${id}`).pipe(delayToDramaticEffect()) as Observable<Character>;
  }

  insertOrUpdate(id: number | undefined, character: Omit<Character, 'id'>) {
    if (id)
      return this.http.put<Character>(`${baseUrl}characters/${id}`, character);

    return this.http.post<Character>(`${baseUrl}characters`, {id, ...character});
  }

  deleteCharacter(id: number) {
      return this.http.delete<Character>(`${baseUrl}characters/${id}`);
  }
}
