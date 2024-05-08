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
    NumberAbbreviationPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
