import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {

  private _isDarkMode = new BehaviorSubject<boolean>(false);
  public isDarkMode$ = this._isDarkMode.asObservable();

  toggleDarkMode() {
    this._isDarkMode.next(!this._isDarkMode.value);
  }
}
