import {patchState, signalStore, withComputed, withHooks, withMethods, withState} from "@ngrx/signals";
import {Character, CharactersService} from "@api/characters.service";
import {computed, inject} from "@angular/core";
import {Router} from "@angular/router";
import {rxMethod} from "@ngrx/signals/rxjs-interop";
import {mergeMap, switchMap} from "rxjs";
import {tapResponse} from "@ngrx/operators";

export type CharacterState = { character: Character | undefined }

function calculateModifier(value: number) {
  return Math.floor((value - 10) / 2);
}

export const CharacterStore = signalStore(
  withState<CharacterState>({character: undefined}),
  withComputed(({character}) => ({
    totalKgCarried: computed(() => character()?.inventory.length ?? 0),
    modifiers: computed(() => Object.fromEntries(Object.entries(character() ?? {}).map(([key, value]) => ([key, calculateModifier(value as number)]))))
  })),
  withMethods(({...store},
               charactersService = inject(CharactersService),
               router = inject(Router)) =>
    ({
      goToList() {
        router.navigate(['characters', 'list'])
      },
      loadCharacterSheet: rxMethod<number>(id$ => id$.pipe(
          switchMap(
            id => charactersService.getSheet(id)
              .pipe(tapResponse({
                  next: (character) => patchState(store, {character}),
                  error: console.error
                })
              )
          )
        )
      ),
      addItemToInventory(item: string) {
        if(!item)
          return

        patchState(store, ({character, ...store}) => ({
          ...store,
          character: {...character!, inventory: [...character!.inventory, item]}
        }))
      },
      removeItem(index: number){
        patchState(store, ({character, ...store}) => ({
          ...store,
          character: {...character!, inventory: character!.inventory.filter((item,i) => index !== i)}
        }))
      },
      updateStoredCharacter(characterUpdated: Omit<Character, 'id'>) {
        patchState(store, ({character, ...store}) => ({
          ...store,
          character: {...character!, ...characterUpdated!}
        }))
      },
      insertOrUpdate: rxMethod<{
        id: number | undefined,
        characterSubmitted: Omit<Character, 'id'>
      }>(request$ => request$.pipe(
        mergeMap(({id, characterSubmitted}) => charactersService.insertOrUpdate(id, characterSubmitted)
          .pipe(
            tapResponse({
              next: () => router.navigate(['characters', 'list']),
              error: console.error
            })
          )
        )
      ))
    }),
  ),
  withHooks({
    onDestroy(store) {
      patchState(store, {character: undefined})
    }
  }),
);
