import {patchState, signalStore, withComputed, withMethods, withState} from '@ngrx/signals';
import {FakeLoginService} from "@api/fake-login.service";
import {computed, inject} from "@angular/core";
import {rxMethod} from "@ngrx/signals/rxjs-interop";
import {exhaustMap} from "rxjs";
import {tapResponse} from "@ngrx/operators";
import {Router} from "@angular/router";

interface CoreState {
  user: string | undefined,
}

export const CoreStore = signalStore(
  {providedIn: 'root'},
  withState<CoreState>({user: undefined}),
  withComputed(({user}) => ({
    isLoggedIn: computed(() => user() || false)
  })),
  withMethods(({isLoggedIn, ...store},
               loginService = inject(FakeLoginService),
               router = inject(Router)) =>
    ({
      logIn: rxMethod<{ username: string, pwd: string }>(data$ =>
        data$.pipe(
          exhaustMap(({username, pwd}) => loginService.login(username, pwd).pipe(
            tapResponse({
              next: (isLoggedIn) => {
                patchState(store, {user: username});
                if (isLoggedIn) router.navigate(['characters'])
              },
              error: console.error,
            })))
        )
      ),
      logout: () => {
        patchState(store, {user: ''});
        router.navigate(['login'])
      }
    })
  ));
