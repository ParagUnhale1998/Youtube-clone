import { Component, Renderer2 } from '@angular/core';
import { DarkModeService } from './services/dark-mode.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'youtube-clone';

  constructor(private renderer: Renderer2, public darkModeService: DarkModeService) {}

  ngOnInit() {
    // Subscribe to changes in dark mode state
    this.darkModeService.isDarkMode$.subscribe(isDark => {
      this.setDarkModeClass(isDark);
    });
  }

  private setDarkModeClass(isDarkMode: boolean) {
    if (isDarkMode) {
      this.renderer.addClass(document.body, 'dark');
    } else {
      this.renderer.removeClass(document.body, 'dark');
    }
  }
}
