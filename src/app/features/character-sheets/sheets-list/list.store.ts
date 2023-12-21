import {patchState, signalStore, withComputed, withHooks, withMethods, withState} from "@ngrx/signals";
import {Character, CharactersService} from "@api/characters.service";
import {computed, inject} from "@angular/core";
import {Router} from "@angular/router";
import {concatMap, debounceTime, switchMap, tap} from "rxjs";
import {rxMethod} from "@ngrx/signals/rxjs-interop";
import {tapResponse} from "@ngrx/operators";

export type ListState = { characters: Character[], searchText: string, isLoading: boolean }
export const ListStore = signalStore(
  withState<ListState>({characters: [], isLoading: false, searchText: ''}),
  withComputed(({characters}) => ({
    count: computed(() => characters().length)
  })),
  withMethods(({...store},
               charactersService = inject(CharactersService),
               router = inject(Router)) =>
    ({
        searchChanged(searchText: string) {
          patchState(store, {searchText})
        },
        searchByName: rxMethod<string>(name$ => name$.pipe(
            debounceTime(500),
            tap(() => patchState(store, {isLoading: true})),
            switchMap((name) => charactersService.getSheetsByName(name).pipe(
              tapResponse({
                next: (characters) => {
                  patchState(store, {characters});
                },
                error: console.error,
                finalize: () => patchState(store, {isLoading: false})
              })
            )),
          )
        ),
        addOneChar() {
          router.navigate(['characters', 'new'])
        },
        editChar(id: number) {
          router.navigate(['characters', id, 'edit'])
        },
        deleteChar: rxMethod<number>(id$ => id$.pipe(
          concatMap(id => charactersService.deleteCharacter(id).pipe(
            tapResponse({
              next: () => patchState(store, ({characters, ...store}) => ({
                ...store,
                characters: characters.filter((c: Character) => c.id !== id)
              })),
              error: console.error
            })
          ))
        ))
      }
    ),
  ),
  withHooks({
    onInit({searchByName, searchText}) {
      searchByName(searchText);
    },
    onDestroy(store) {
      patchState(store, {searchText: ''})
    }
  }),
);
