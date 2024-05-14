import { Component } from '@angular/core';
import { UiStateService } from 'src/app/services/ui-state.service';

@Component({
  selector: 'app-top-category',
  templateUrl: './top-category.component.html',
  styleUrls: ['./top-category.component.scss']
})
export class TopCategoryComponent {

  youtubeCategories:any = [
    "Entertainment",
    "Music",
    "Gaming",
    "Sports",
    "Education",
    "How-to & Style",
    "Science & Technology",
    "Travel & Events",
    "Comedy",
    "News & Politics",
    "Angular",
];

constructor(private uiStateService: UiStateService){

}

searchByCategory(categoryName:string){
  this.uiStateService.setLoadingState(true)
  this.uiStateService.setSearchValue(categoryName)
}
}
