import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {
  Observable,
  Subject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  of,
  switchMap,
} from 'rxjs';
import { DarkModeService } from 'src/app/services/dark-mode.service';
import { UiStateService } from 'src/app/services/ui-state.service';
import { YoutubeApi2Service } from 'src/app/services/youtube-api2.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  isSidebarOpen!: boolean;
  darkMode: boolean = false;
  suggestionsData: any;
  suggestionsToggle: boolean = false;
  isVideoPath: boolean = false;
  searchInput: Subject<string> = new Subject<string>();
  @ViewChild('searchInput', { static: true })
  searchInputValue!: ElementRef<HTMLInputElement>;

  constructor(
    private darkModeService: DarkModeService,
    private uiStateService: UiStateService,
    private route: ActivatedRoute,
    private router: Router,
    private youtubeApi: YoutubeApi2Service
  ) {
    this.uiStateService.sidebarOpen$.subscribe((value) => {
      this.isSidebarOpen = value;
    });

    this.searchInput
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        switchMap((searchTerm: string) => this.getSuggestions(searchTerm)),
        catchError((error) => {
          console.error('Error fetching suggestions:', error);
          return of([]); // Returning an empty array in case of error
        })
      )
      .subscribe((response) => {
        this.suggestionsData = response;
        this.hideSuggestionsAfterDelay();
      });
  }

  ngOnInit(): void {
    this.darkModeService.isDarkMode$.subscribe((isDark) => {
      this.darkMode = isDark;
    });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        if (event.url.startsWith('/video/')) {
          this.uiStateService.setSidebarStatus(false);
        }
      });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (event.currentTarget.innerWidth < 500) {
      this.uiStateService.setSidebarStatus(false);
    }
  }

  toggleDarkMode() {
    this.darkModeService.toggleDarkMode();
  }

  search(searchTerm: string) {
    this.hideSuggestions();
    if (searchTerm.trim() !== '') {
      this.uiStateService.setSearchValue(searchTerm);
      if (this.router.url !== '/') {
        this.searchInputValue.nativeElement.value = searchTerm;
        this.router.navigateByUrl('/');
        this.uiStateService.setSearchValue(searchTerm);
      }
    }
  }

  openSidebar() {
    this.uiStateService.setSidebarStatus(!this.isSidebarOpen);
  }

  showSuggestions(): void {
    this.suggestionsToggle = true;
  }

  hideSuggestions(): void {
    this.suggestionsToggle = false;
  }

  hideSuggestionsAfterDelay(): void {
    setTimeout(() => {
      this.hideSuggestions();
    }, 5000);
  }

  onKeyUp(searchQuery: string) {
    this.searchInput.next(searchQuery);
  }

  getSuggestions(searchQuery: string): Observable<any> {
    if (searchQuery.trim() !== '') {
      this.showSuggestions();
      return this.youtubeApi.getSuggestions(searchQuery);
    } else {
      return of([]);
    }
  }
}

/*
  // searchTerm: string = '';
  isSidebarOpen!: boolean;
  darkMode: boolean = false;
  suggestionsData: any;
  suggestionsToggle: boolean = false;
  isVideoPath: boolean = false;
  searchInput: Subject<string> = new Subject<string>();
  @ViewChild('searchInput', { static: true }) searchInputValue!: ElementRef<HTMLInputElement>;

  constructor(
    private darkModeService: DarkModeService,
    private uiStateService: UiStateService,
    private route: ActivatedRoute,
    private router: Router,
    private youtubeApi: YoutubeApi2Service
  ) {
    this.uiStateService.sidebarOpen$.subscribe((value) => {
      this.isSidebarOpen = value;
      // this.searchByCategory(value)
    });

    // const currentPath = window.location.pathname;
    // if (currentPath.startsWith('/video/')) {
    //   this.uiStateService.setSidebarStatus(false);
    //   console.log('works');
    // }
    // this.showSuggestions()
    // {
    //   this.suggestionsData = {
    //     query: 'wwe',
    //     suggestions: [
    //       'wwe',
    //       'wwe raw highlights',
    //       'wwe raw',
    //       'wwe 2k24',
    //       'wwe smackdown',
    //       'wwe nxt',
    //       'wwe full matches',
    //       'wwe theme songs',
    //       'wwe smack downs highlights',
    //       'wwe royal rumble 2024',
    //       'wwe backlash 2024',
    //       'wwe womens',
    //       'wwe royal rumble',
    //     ],
    //   };
    // }

    this.searchInput.pipe(
      debounceTime(100), // Adjust debounce time as needed (milliseconds)
      distinctUntilChanged(),
      switchMap((searchTerm: string) => this.getSuggestions(searchTerm))
    ).subscribe((response) => {
      console.log(response);
      this.suggestionsData = response;
      
      setTimeout(() => {
        this.hideSuggestions()
      }, 5000);
    });

  }

  ngOnInit(): void {
    this.darkModeService.isDarkMode$.subscribe((isDark) => {
      this.darkMode = isDark;
    });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        if (event.url.startsWith('/video/')) {
          this.uiStateService.setSidebarStatus(false);
          console.log('works');
        }
      });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    console.log(event);
    if (event.currentTarget.innerWidth < 500) {
      this.uiStateService.setSidebarStatus(false);
    }
  }

  toggleDarkMode() {
    this.darkModeService.toggleDarkMode();
  }

  search(searchTerm: string) {
    this.hideSuggestions()
    if (searchTerm.trim() !== '') {
      // Set the search value
      this.uiStateService.setSearchValue(searchTerm);

      // Check if the current route is not the home route (/)
      if (this.router.url !== '/') {
        // Navigate to home route with search term appended to the URL
        this.searchInputValue.nativeElement.value = searchTerm;
        this.router.navigateByUrl('/');
        this.uiStateService.setSearchValue(searchTerm);
        console.log('navigate home');
      }
    }
  }

  openSidebar() {
    this.uiStateService.setSidebarStatus(!this.isSidebarOpen);
  }

  showSuggestions(): void {
    this.suggestionsToggle = true;
  }

  hideSuggestions(): void {
    this.suggestionsToggle = false;
  }

  onKeyUp(searchQuery: string) {
    this.searchInput.next(searchQuery);
  }

  // getSuggestions(searchQuery: any): void {
  //   if (searchQuery.trim() !== '') {
  //     this.showSuggestions();
  //     this.youtubeApi.getSuggestions(searchQuery).pipe(
  //       debounceTime(300), // Adjust debounce time as needed (milliseconds)
  //       distinctUntilChanged()
  //     ).subscribe((response) => {
  //       console.log(response);
  //       this.suggestionsData = response;
  //     });
  //   }
  // }
  getSuggestions(searchQuery: string): Observable<any> {
    if (searchQuery.trim() !== '') {
      this.showSuggestions();
      return this.youtubeApi.getSuggestions(searchQuery);
    } else {
      // Return an observable with empty response or handle it according to your requirement
      return of([]);
    }
  }
}
*/
