import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VideoComponent } from './components/video/video.component';
import { SearchComponent } from './components/search/search.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HomeComponent } from './pages/home/home.component';
import { VideoPageComponent } from './pages/video-page/video-page.component';
import { VideoCardComponent } from './components/video-card/video-card.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TruncatePipe } from './pipes/truncate.pipe';
import { TimeDifferencePipe } from './pipes/time-difference.pipe';
import { DurationPipe } from './pipes/duration.pipe';
import { NumberAbbreviationPipe } from './pipes/number-abbreviation.pipe';
import { TopCategoryComponent } from './components/top-category/top-category.component';
import { HomeVideoCardComponent } from './skeleton-loading/home-video-card/home-video-card.component';
import { ResizeIframeDirective } from './directive/resize-iframe.directive';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    VideoComponent,
    SearchComponent,
    NavbarComponent,
    SidebarComponent,
    HomeComponent,
    VideoPageComponent,
    VideoCardComponent,
    TruncatePipe,
    TimeDifferencePipe,
    DurationPipe,
    NumberAbbreviationPipe,
    TopCategoryComponent,
    HomeVideoCardComponent,
    ResizeIframeDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,

  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule { }
