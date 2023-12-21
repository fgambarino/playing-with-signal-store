import {Injectable} from "@angular/core";
import {iif, of, delay, Observable} from "rxjs";

const delayResult = () => delay(500)

@Injectable({providedIn: "root"})
export class FakeLoginService {
  login(username: string, pwd: string): Observable<boolean> {
    return iif(() => this.checkUser(username, pwd), of(true).pipe(delayResult()), of(false).pipe(delayResult())) as Observable<boolean>
  }

  private checkUser(username: string, pwd: string) {
    return /federico/i.test(username.trim()) && pwd === "admin" // much security wow
  }
}
