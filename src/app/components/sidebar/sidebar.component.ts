import { Component } from '@angular/core';
import { UiStateService } from 'src/app/services/ui-state.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  categories = [
    { name: "Trending", icon: "fa-fire" },
    { name: "Adventure and Movies", icon: "fa-compass" },
    { name: "Programming and Coding", icon: "fa-laptop-code" },
    { name: "Science and Fact", icon: "fa-flask" },
    { name: "Technology and Space", icon: "fa-satellite-dish" },
    { name: "Business and Startups", icon: "fa-chart-line" },
    { name: "Sports and Highlights", icon: "fa-futbol" },
    { name: "Movies and Webseries", icon: "fa-film" },
    { name: "AI and ChatGPT", icon: "fa-robot" },
    { name: "Health and Fitness", icon: "fa-heartbeat" },
    { name: "Food and Blogging", icon: "fa-utensils" },
    { name: "Gaming and Live", icon: "fa-gamepad" }
  ];

  constructor(private uiStateService: UiStateService){

  }

  searchByCategory(categoryName:string){
    this.uiStateService.setLoadingState(true)
    this.uiStateService.setSearchValue(categoryName)

    
    this.uiStateService.setSidebarStatus(false)
  }
}
