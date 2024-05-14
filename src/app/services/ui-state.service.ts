import {  Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiStateService {

  loading$ = new BehaviorSubject<boolean>(true);
  sidebarOpen$ = new BehaviorSubject<boolean>(true);
  searchValue$ = new BehaviorSubject<string>('angular');

  constructor() { }


  setLoadingState(state: boolean) {
    this.loading$.next(state);
  }

  setSidebarStatus(open: boolean) {
    this.sidebarOpen$.next(open);
  }

  setSearchValue(value: string) {
    this.searchValue$.next(value);
  }
}
