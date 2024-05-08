import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { VideoPageComponent } from './pages/video-page/video-page.component';

const routes: Routes = [
  {path:'',component:HomeComponent},
  { path: 'video/:videoId/:channelId', component: VideoPageComponent }, // Define route with parameter
];  


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
