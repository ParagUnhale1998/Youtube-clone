import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DarkModeService } from 'src/app/services/dark-mode.service';
import { UiStateService } from 'src/app/services/ui-state.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  searchTerm: string = '';


  constructor(private darkModeService: DarkModeService,private uiStateService: UiStateService,private route: ActivatedRoute,private router :Router) {}

  
  toggleDarkMode() {
    this.darkModeService.toggleDarkMode();
  }

 

  search() {
    this.uiStateService.setSearchValue(this.searchTerm);

    // Check if the current route is /video/
    if (this.route.snapshot.url[0]?.path === 'video') {
      // Navigate to home route with search term appended to the URL
      this.router.navigate(['/']);
    }
  }


}
