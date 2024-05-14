import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UiStateService } from 'src/app/services/ui-state.service';
import { YoutubeApiService } from 'src/app/services/youtube-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  fakeLoopData: number[] = Array.from({ length: 20 }, (_, index) => index);
  seachQuery!: string;
  searchResults: any[] = [];
  nextPageToken: string = '';
  loading!: boolean;
  sidebarOpen!: boolean;

  private loadingSub!: Subscription;
  private sidebarOpenSub!: Subscription;
  private searchValueSub!: Subscription;

  constructor(
    private youtubeService: YoutubeApiService,
    private router: Router,
    private uiStateService: UiStateService,
  ) {}

  ngOnInit(): void {
    this.searchValueSub = this.uiStateService.searchValue$.subscribe(
      (value) => {
        this.seachQuery = value;
        this.searchByCategory()
      }
    );
    this.loadingSub = this.uiStateService.loading$.subscribe((value) => {
      this.loading = value;
    });

    this.sidebarOpenSub = this.uiStateService.sidebarOpen$.subscribe(
      (value) => {
        this.sidebarOpen = value;
      }
    );
  }

  search(): void {
    if (this.seachQuery.trim() !== '') {
      this.uiStateService.setLoadingState(true);
      this.youtubeService
        .searchVideos(this.seachQuery, this.nextPageToken)
        .subscribe(
          (response: any) => {
            this.searchResults = this.searchResults
              ? [...this.searchResults, ...response.items]
              : response.items;
            this.nextPageToken = response.nextPageToken; // Update nextPageToken
            this.uiStateService.setLoadingState(false);
            //console.log(response);
          },
          (error) => {
            console.error('Error searching videos:', error);
          }
        );
    }
  }
  
  searchByCategory() {
    this.uiStateService.setLoadingState(true);
    this.youtubeService
      .searchVideos(this.seachQuery, this.nextPageToken)
      .subscribe(
        (response: any) => {
          this.searchResults = response.items;
          this.nextPageToken = response.nextPageToken; // Update nextPageToken
          this.uiStateService.setLoadingState(false);

          //console.log(response);
        },
        (error) => {
          console.error('Error searching videos:', error);
        }
      );
  }

  showMore(): void {
    this.search();
  }

  navigateToVideo(videoId: string, channelId: string): void {
    this.router.navigate(['/video', videoId, channelId]);
  }

  ngOnDestroy() {
    // Unsubscribe to avoid memory leaks
    this.loadingSub.unsubscribe();
  }
}


/* fakeLoopData: number[] = Array.from({ length: 20 }, (_, index) => index);

  seachQuery!: string;
  searchResults: any[] = [];
  nextPageToken: string = '';

  loading!: boolean;
  sidebarOpen!: boolean;

  private loadingSub!: Subscription;
  private sidebarOpenSub!: Subscription;
  private searchValueSub!: Subscription;

  constructor(
    private youtubeService: YoutubeApiService,
    private router: Router,
    private uiStateService: UiStateService,
  ) {}

  ngOnInit(): void {
    // Subscribe to searchValue$
    this.searchValueSub = this.uiStateService.searchValue$.subscribe(
      (value) => {
        this.seachQuery = value;
        this.searchByCategory()
        // this.searchTrending()
      }
    );

    this.loadingSub = this.uiStateService.loading$.subscribe((value) => {
      this.loading = value;
      // this.searchByCategory(value)
    });

    this.sidebarOpenSub = this.uiStateService.sidebarOpen$.subscribe(
      (value) => {
        this.sidebarOpen = value;
        // this.searchByCategory(value)
      }
    );
  }

  search(): void {
    if (this.seachQuery.trim() !== '') {
      this.uiStateService.setLoadingState(true);
      this.youtubeService
        .searchVideos(this.seachQuery, this.nextPageToken)
        .subscribe(
          (response: any) => {
            this.searchResults = this.searchResults
              ? [...this.searchResults, ...response.items]
              : response.items;
            this.nextPageToken = response.nextPageToken; // Update nextPageToken
            this.uiStateService.setLoadingState(false);
            //console.log(response);
          },
          (error) => {
            console.error('Error searching videos:', error);
          }
        );
    }
  }
  
  searchByCategory() {
    // this.seachQuery = categoryName;
    this.uiStateService.setLoadingState(true);
    this.youtubeService
      .searchVideos(this.seachQuery, this.nextPageToken)
      .subscribe(
        (response: any) => {
          this.searchResults = response.items;
          this.nextPageToken = response.nextPageToken; // Update nextPageToken
          this.uiStateService.setLoadingState(false);

          //console.log(response);
        },
        (error) => {
          console.error('Error searching videos:', error);
        }
      );
  }

  showMore(): void {
    // Call search function to fetch next page
    this.search();
  }

  navigateToVideo(videoId: string, channelId: string): void {
    this.router.navigate(['/video', videoId, channelId]);
  }

  ngOnDestroy() {
    // Unsubscribe to avoid memory leaks
    this.loadingSub.unsubscribe();
    // this.sidebarOpenSub.unsubscribe();
    // this.searchValueSub.unsubscribe();
  }
}*/


  /*
  fakeLoopData: number[] = Array.from({ length: 20 }, (_, index) => index);

  searchQuery!: string;
  searchResults: any[] = [];
  nextPageToken: string = '';
  loading: boolean = false;
  sidebarOpen: boolean = false;

  private loadingSub!: Subscription;
  private searchValueSub!: Subscription;

  constructor(
    private youtubeService: YoutubeApiService,
    private router: Router,
    private uiStateService: UiStateService,
    private youtubeService2: YoutubeApi2Service
  ) {}

  ngOnInit(): void {
    this.loadingSub = this.uiStateService.loading$.subscribe((value) => {
      this.loading = value;
      if (this.searchQuery) {
        this.searchByCategory();
      }
    });

    this.searchValueSub = this.uiStateService.searchValue$.subscribe((value) => {
      this.searchQuery = value;
      if (this.searchQuery.trim() !== '') {
        this.searchByCategory();
      }
    });
  }

  search(): void {
    if (this.searchQuery.trim() !== '') {
      this.uiStateService.setLoadingState(true);
      this.youtubeService.searchVideos(this.searchQuery, this.nextPageToken).subscribe(
        (response: any) => {
          this.searchResults = this.nextPageToken ? [...this.searchResults, ...response.items] : response.items;
          this.nextPageToken = response.nextPageToken;
          this.uiStateService.setLoadingState(false);
        },
        (error) => {
          console.error('Error searching videos:', error);
          this.uiStateService.setLoadingState(false);
        }
      );
    }
  }

  searchByCategory(): void {
    this.uiStateService.setLoadingState(true);
    this.youtubeService.searchVideos(this.searchQuery, this.nextPageToken).subscribe(
      (response: any) => {
        this.searchResults = response.items;
        this.nextPageToken = response.nextPageToken;
        this.uiStateService.setLoadingState(false);
      },
      (error) => {
        console.error('Error searching videos:', error);
        this.uiStateService.setLoadingState(false);
      }
    );
  }

  searchTrending(): void {
    this.uiStateService.setLoadingState(true);
    this.youtubeService2.showHomePageContent().subscribe(
      (response) => {
        //console.log(response);
        this.uiStateService.setLoadingState(false);
      },
      (error) => {
        console.error('Error fetching trending videos:', error);
        this.uiStateService.setLoadingState(false);
      }
    );
  }

  showMore(): void {
    this.search();
  }

  navigateToVideo(videoId: string, channelId: string): void {
    this.router.navigate(['/video', videoId, channelId]);
  }

  ngOnDestroy(): void {
    this.loadingSub.unsubscribe();
    this.searchValueSub.unsubscribe();
  }
}




*/



  // dataArray = [
  //   {
  //     kind: 'youtube#searchResult',
  //     id: {
  //       kind: 'youtube#video',
  //       videoId: 'KIAHopqOAow',
  //     },
  //     snippet: {
  //       publishedAt: '2024-05-07T06:30:05Z',
  //       channelId: 'UCeFBJOw9lFTufkre7zVAtVQ',
  //       title: 'Rey Mysterio VS Austin Theory - WWE 2K24 PS5 Gameplay',
  //       description:
  //         'Rey Mysterio VS Austin Theory - WWE 2K24 PS5 Gameplay WWE 2K24, WrestleMania gameplay, WWE 2K24, gameplay, ...',
  //       thumbnails: {
  //         default: {
  //           url: 'https://i.ytimg.com/vi/KIAHopqOAow/default.jpg',
  //           width: 120,
  //           height: 90,
  //         },
  //         medium: {
  //           url: 'https://i.ytimg.com/vi/KIAHopqOAow/mqdefault.jpg',
  //           width: 320,
  //           height: 180,
  //         },
  //         high: {
  //           url: 'https://i.ytimg.com/vi/KIAHopqOAow/hqdefault.jpg',
  //           width: 480,
  //           height: 360,
  //         },
  //       },
  //       channelTitle: 'Wrestling Switch',
  //       liveBroadcastContent: 'none',
  //       publishTime: '2024-05-07T06:30:05Z',
  //     },
  //   },
  //   {
  //     kind: 'youtube#searchResult',
  //     id: {
  //       kind: 'youtube#video',
  //       videoId: 'gPjROEqduac',
  //     },
  //     snippet: {
  //       publishedAt: '2024-05-07T04:10:24Z',
  //       channelId: 'UCJ5v_MCY6GNUBTO8-D3XoAg',
  //       title:
  //         'FULL MATCH: Sheamus vs. Gunther — King of the Ring Tournament Match: Raw highlights, May 6, 2024',
  //       description:
  //         'The Ring General goes head-to-head with The Celtic Warrior in the first round of the King of the Ring Tournament. Catch WWE ...',
  //       thumbnails: {
  //         default: {
  //           url: 'https://i.ytimg.com/vi/gPjROEqduac/default.jpg',
  //           width: 120,
  //           height: 90,
  //         },
  //         medium: {
  //           url: 'https://i.ytimg.com/vi/gPjROEqduac/mqdefault.jpg',
  //           width: 320,
  //           height: 180,
  //         },
  //         high: {
  //           url: 'https://i.ytimg.com/vi/gPjROEqduac/hqdefault.jpg',
  //           width: 480,
  //           height: 360,
  //         },
  //       },
  //       channelTitle: 'WWE',
  //       liveBroadcastContent: 'none',
  //       publishTime: '2024-05-07T04:10:24Z',
  //     },
  //   },
  //   {
  //     kind: 'youtube#searchResult',
  //     id: {
  //       kind: 'youtube#video',
  //       videoId: 'G7dVlNrPa6c',
  //     },
  //     snippet: {
  //       publishedAt: '2024-05-07T04:07:23Z',
  //       channelId: 'UCJkPD52LaKPVRIWYQtMwkxw',
  //       title:
  //         'WWE 6 May 2024 AJ Styles Wins Undisputed Championship Cody Rhodes Lose Backlash Full Match HD',
  //       description:
  //         'WWE 5 May 2024 AJ Styles Wins Undisputed Championship Cody Rhodes Lose Backlash Full Match HD #aliautos #wwe ...',
  //       thumbnails: {
  //         default: {
  //           url: 'https://i.ytimg.com/vi/G7dVlNrPa6c/default.jpg',
  //           width: 120,
  //           height: 90,
  //         },
  //         medium: {
  //           url: 'https://i.ytimg.com/vi/G7dVlNrPa6c/mqdefault.jpg',
  //           width: 320,
  //           height: 180,
  //         },
  //         high: {
  //           url: 'https://i.ytimg.com/vi/G7dVlNrPa6c/hqdefault.jpg',
  //           width: 480,
  //           height: 360,
  //         },
  //       },
  //       channelTitle: 'ali autos',
  //       liveBroadcastContent: 'none',
  //       publishTime: '2024-05-07T04:07:23Z',
  //     },
  //   },
  //   {
  //     kind: 'youtube#searchResult',
  //     id: {
  //       kind: 'youtube#video',
  //       videoId: 'ixX85uauEvI',
  //     },
  //     snippet: {
  //       publishedAt: '2024-05-07T04:00:46Z',
  //       channelId: 'UCJ5v_MCY6GNUBTO8-D3XoAg',
  //       title: 'Explosive Raw Moments: Raw highlights, May 6, 2024',
  //       description:
  //         'From Damian Priest apologizing to The Judgment Day, to Gunther claiming a controversial win over Sheamus, relive the best ...',
  //       thumbnails: {
  //         default: {
  //           url: 'https://i.ytimg.com/vi/ixX85uauEvI/default.jpg',
  //           width: 120,
  //           height: 90,
  //         },
  //         medium: {
  //           url: 'https://i.ytimg.com/vi/ixX85uauEvI/mqdefault.jpg',
  //           width: 320,
  //           height: 180,
  //         },
  //         high: {
  //           url: 'https://i.ytimg.com/vi/ixX85uauEvI/hqdefault.jpg',
  //           width: 480,
  //           height: 360,
  //         },
  //       },
  //       channelTitle: 'WWE',
  //       liveBroadcastContent: 'none',
  //       publishTime: '2024-05-07T04:00:46Z',
  //     },
  //   },
  //   {
  //     kind: 'youtube#searchResult',
  //     id: {
  //       kind: 'youtube#video',
  //       videoId: 'GNUbEd8zbMY',
  //     },
  //     snippet: {
  //       publishedAt: '2024-05-07T03:18:00Z',
  //       channelId: 'UCYTtS5mx2aNQClekJwzzRrA',
  //       title:
  //         'WWE Raw IYO SKY vs Natalya Match Gameplay Reaction video with Facecam of WWE 2K24',
  //       description:
  //         'Instagram: James: https://www.instagram.com/iamvlogging/ Prashant: https://www.instagram.com/shant_twelve Original video:',
  //       thumbnails: {
  //         default: {
  //           url: 'https://i.ytimg.com/vi/GNUbEd8zbMY/default.jpg',
  //           width: 120,
  //           height: 90,
  //         },
  //         medium: {
  //           url: 'https://i.ytimg.com/vi/GNUbEd8zbMY/mqdefault.jpg',
  //           width: 320,
  //           height: 180,
  //         },
  //         high: {
  //           url: 'https://i.ytimg.com/vi/GNUbEd8zbMY/hqdefault.jpg',
  //           width: 480,
  //           height: 360,
  //         },
  //       },
  //       channelTitle: 'James Reaction',
  //       liveBroadcastContent: 'none',
  //       publishTime: '2024-05-07T03:18:00Z',
  //     },
  //   },
  //   {
  //     kind: 'youtube#searchResult',
  //     id: {
  //       kind: 'youtube#video',
  //       videoId: '3--jqTsJRUg',
  //     },
  //     snippet: {
  //       publishedAt: '2024-05-07T03:14:59Z',
  //       channelId: 'UCSy3TvvwAV12MD0rLsHyClQ',
  //       title:
  //         'Gunther vs. Sheamus in Another BANGER Match | WWE Raw Highlights 5/6/24 | WWE on USA',
  //       description:
  //         'Gunther and Sheamus pick up where they left off with another banger match. WWE Raw Highlights 5/6/24. Watch WWE Raw ...',
  //       thumbnails: {
  //         default: {
  //           url: 'https://i.ytimg.com/vi/3--jqTsJRUg/default.jpg',
  //           width: 120,
  //           height: 90,
  //         },
  //         medium: {
  //           url: 'https://i.ytimg.com/vi/3--jqTsJRUg/mqdefault.jpg',
  //           width: 320,
  //           height: 180,
  //         },
  //         high: {
  //           url: 'https://i.ytimg.com/vi/3--jqTsJRUg/hqdefault.jpg',
  //           width: 480,
  //           height: 360,
  //         },
  //       },
  //       channelTitle: 'WWE on USA',
  //       liveBroadcastContent: 'none',
  //       publishTime: '2024-05-07T03:14:59Z',
  //     },
  //   },
  //   {
  //     kind: 'youtube#searchResult',
  //     id: {
  //       kind: 'youtube#video',
  //       videoId: 'YMrWNtbiwc8',
  //     },
  //     snippet: {
  //       publishedAt: '2024-05-07T03:10:38Z',
  //       channelId: 'UCEdbSMEUdfXUQijpUb5C7sA',
  //       title:
  //         'W_W_E được giới thiệu bởi Giang Review HD P2 May 6, 2024 - W_W_E Review By Giang 5/6/2024',
  //       description: '',
  //       thumbnails: {
  //         default: {
  //           url: 'https://i.ytimg.com/vi/YMrWNtbiwc8/default.jpg',
  //           width: 120,
  //           height: 90,
  //         },
  //         medium: {
  //           url: 'https://i.ytimg.com/vi/YMrWNtbiwc8/mqdefault.jpg',
  //           width: 320,
  //           height: 180,
  //         },
  //         high: {
  //           url: 'https://i.ytimg.com/vi/YMrWNtbiwc8/hqdefault.jpg',
  //           width: 480,
  //           height: 360,
  //         },
  //       },
  //       channelTitle: 'Giang Review Wrestling',
  //       liveBroadcastContent: 'none',
  //       publishTime: '2024-05-07T03:10:38Z',
  //     },
  //   },
  //   {
  //     kind: 'youtube#searchResult',
  //     id: {
  //       kind: 'youtube#video',
  //       videoId: 'QCrNQcaT1xw',
  //     },
  //     snippet: {
  //       publishedAt: '2024-05-07T03:05:31Z',
  //       channelId: 'UCQWMcsQb99i1pJ9YnBC1DxQ',
  //       title: 'Sheamus vs. Gunther - WWE RAW 5/6/2024',
  //       description:
  //         'Sheamus vs. Gunther - WWE RAW 5/6/2024 The Rock, Roman Reigns, Cody Rhodes, CM Punk, Randy Orton, CM Punk Returns, ...',
  //       thumbnails: {
  //         default: {
  //           url: 'https://i.ytimg.com/vi/QCrNQcaT1xw/default.jpg',
  //           width: 120,
  //           height: 90,
  //         },
  //         medium: {
  //           url: 'https://i.ytimg.com/vi/QCrNQcaT1xw/mqdefault.jpg',
  //           width: 320,
  //           height: 180,
  //         },
  //         high: {
  //           url: 'https://i.ytimg.com/vi/QCrNQcaT1xw/hqdefault.jpg',
  //           width: 480,
  //           height: 360,
  //         },
  //       },
  //       channelTitle: 'Wrestling Best',
  //       liveBroadcastContent: 'none',
  //       publishTime: '2024-05-07T03:05:31Z',
  //     },
  //   },
  //   {
  //     kind: 'youtube#searchResult',
  //     id: {
  //       kind: 'youtube#video',
  //       videoId: '-IAOA_tWb38',
  //     },
  //     snippet: {
  //       publishedAt: '2024-05-07T03:02:53Z',
  //       channelId: 'UChDzLC0lqmtpmIyH1gznCDw',
  //       title: 'Sheamus Vs Gunther - WWE RAW 6 de Mayo 2024 Español',
  //       description:
  //         'Sheamus Vs Gunther - WWE RAW 6 de Mayo 2024 Español wwe en vivo gratis,resumenes de wwe raw español,resumenes de ...',
  //       thumbnails: {
  //         default: {
  //           url: 'https://i.ytimg.com/vi/-IAOA_tWb38/default.jpg',
  //           width: 120,
  //           height: 90,
  //         },
  //         medium: {
  //           url: 'https://i.ytimg.com/vi/-IAOA_tWb38/mqdefault.jpg',
  //           width: 320,
  //           height: 180,
  //         },
  //         high: {
  //           url: 'https://i.ytimg.com/vi/-IAOA_tWb38/hqdefault.jpg',
  //           width: 480,
  //           height: 360,
  //         },
  //       },
  //       channelTitle: 'SuperWrestling',
  //       liveBroadcastContent: 'none',
  //       publishTime: '2024-05-07T03:02:53Z',
  //     },
  //   },
  //   {
  //     kind: 'youtube#searchResult',
  //     id: {
  //       kind: 'youtube#video',
  //       videoId: 'TAHux4p6JvM',
  //     },
  //     snippet: {
  //       publishedAt: '2024-05-07T02:46:00Z',
  //       channelId: 'UCJ5v_MCY6GNUBTO8-D3XoAg',
  //       title:
  //         'Sami Zayn incites brawl during “Big” Bronson Reed vs. Chad Gable: Raw highlights, May 6, 2024',
  //       description:
  //         'Intercontinental Champion Sami Zayn looks for payback on Chad Gable and “Big” Bronson Reed. Catch WWE action on Peacock, ...',
  //       thumbnails: {
  //         default: {
  //           url: 'https://i.ytimg.com/vi/TAHux4p6JvM/default.jpg',
  //           width: 120,
  //           height: 90,
  //         },
  //         medium: {
  //           url: 'https://i.ytimg.com/vi/TAHux4p6JvM/mqdefault.jpg',
  //           width: 320,
  //           height: 180,
  //         },
  //         high: {
  //           url: 'https://i.ytimg.com/vi/TAHux4p6JvM/hqdefault.jpg',
  //           width: 480,
  //           height: 360,
  //         },
  //       },
  //       channelTitle: 'WWE',
  //       liveBroadcastContent: 'none',
  //       publishTime: '2024-05-07T02:46:00Z',
  //     },
  //   },
  //   {
  //     kind: 'youtube#searchResult',
  //     id: {
  //       kind: 'youtube#video',
  //       videoId: 'fjpuiGROI-g',
  //     },
  //     snippet: {
  //       publishedAt: '2024-05-07T02:43:25Z',
  //       channelId: 'UCJ5v_MCY6GNUBTO8-D3XoAg',
  //       title:
  //         'Lyra Valkyria helps Becky Lynch fight Damage CTRL as Liv Morgan exits: Raw highlights, May 6, 2024',
  //       description:
  //         "Lyra Valkyria comes to The Man's aid after Liv Morgan leaves the Women's World Champion to fend for herself against Damage ...",
  //       thumbnails: {
  //         default: {
  //           url: 'https://i.ytimg.com/vi/fjpuiGROI-g/default.jpg',
  //           width: 120,
  //           height: 90,
  //         },
  //         medium: {
  //           url: 'https://i.ytimg.com/vi/fjpuiGROI-g/mqdefault.jpg',
  //           width: 320,
  //           height: 180,
  //         },
  //         high: {
  //           url: 'https://i.ytimg.com/vi/fjpuiGROI-g/hqdefault.jpg',
  //           width: 480,
  //           height: 360,
  //         },
  //       },
  //       channelTitle: 'WWE',
  //       liveBroadcastContent: 'none',
  //       publishTime: '2024-05-07T02:43:25Z',
  //     },
  //   },
  //   {
  //     kind: 'youtube#searchResult',
  //     id: {
  //       kind: 'youtube#video',
  //       videoId: 'dW35CjalS3k',
  //     },
  //     snippet: {
  //       publishedAt: '2024-05-07T02:36:38Z',
  //       channelId: 'UCgKpcxVyF0qXU1h_Irzd7XA',
  //       title:
  //         'Liv Morgan abandons Becky Lynch with Damage CTRL after calling out disrespect | WWE on FOX',
  //       description:
  //         "Liv Morgan crashed Becky Lynch's time with Michael Cole on Monday Night Raw by calling out the Women's World Champion for ...",
  //       thumbnails: {
  //         default: {
  //           url: 'https://i.ytimg.com/vi/dW35CjalS3k/default.jpg',
  //           width: 120,
  //           height: 90,
  //         },
  //         medium: {
  //           url: 'https://i.ytimg.com/vi/dW35CjalS3k/mqdefault.jpg',
  //           width: 320,
  //           height: 180,
  //         },
  //         high: {
  //           url: 'https://i.ytimg.com/vi/dW35CjalS3k/hqdefault.jpg',
  //           width: 480,
  //           height: 360,
  //         },
  //       },
  //       channelTitle: 'WWE ON FOX',
  //       liveBroadcastContent: 'none',
  //       publishTime: '2024-05-07T02:36:38Z',
  //     },
  //   },
  //   {
  //     kind: 'youtube#searchResult',
  //     id: {
  //       kind: 'youtube#video',
  //       videoId: '2hb7b2PcC1w',
  //     },
  //     snippet: {
  //       publishedAt: '2024-05-07T02:29:10Z',
  //       channelId: 'UCQ5apl42WmuZZy_thgK-Wkg',
  //       title: 'WWE Liv Morgan, Becky Lynch &amp; Damage CTRL Segment 5/6/24',
  //       description: '',
  //       thumbnails: {
  //         default: {
  //           url: 'https://i.ytimg.com/vi/2hb7b2PcC1w/default.jpg',
  //           width: 120,
  //           height: 90,
  //         },
  //         medium: {
  //           url: 'https://i.ytimg.com/vi/2hb7b2PcC1w/mqdefault.jpg',
  //           width: 320,
  //           height: 180,
  //         },
  //         high: {
  //           url: 'https://i.ytimg.com/vi/2hb7b2PcC1w/hqdefault.jpg',
  //           width: 480,
  //           height: 360,
  //         },
  //       },
  //       channelTitle: 'Women Wrestlers',
  //       liveBroadcastContent: 'none',
  //       publishTime: '2024-05-07T02:29:10Z',
  //     },
  //   },
  //   {
  //     kind: 'youtube#searchResult',
  //     id: {
  //       kind: 'youtube#video',
  //       videoId: 'cu5FsZAeI6k',
  //     },
  //     snippet: {
  //       publishedAt: '2024-05-07T02:27:23Z',
  //       channelId: 'UCoa3SvgBeuJYTtosHSU9ZWQ',
  //       title: 'Full Segment: Liv Morgan Betrays Becky Lynch - Raw 5/6/2024',
  //       description:
  //         'WWE, WWE Highlights, WWE 2024, Roman Reigns, Cody Rhodes, CM Punk, Randy Orton, Seth Rollins, Rhea Ripley, The ...',
  //       thumbnails: {
  //         default: {
  //           url: 'https://i.ytimg.com/vi/cu5FsZAeI6k/default.jpg',
  //           width: 120,
  //           height: 90,
  //         },
  //         medium: {
  //           url: 'https://i.ytimg.com/vi/cu5FsZAeI6k/mqdefault.jpg',
  //           width: 320,
  //           height: 180,
  //         },
  //         high: {
  //           url: 'https://i.ytimg.com/vi/cu5FsZAeI6k/hqdefault.jpg',
  //           width: 480,
  //           height: 360,
  //         },
  //       },
  //       channelTitle: 'Wrestling Segment',
  //       liveBroadcastContent: 'none',
  //       publishTime: '2024-05-07T02:27:23Z',
  //     },
  //   },
  //   {
  //     kind: 'youtube#searchResult',
  //     id: {
  //       kind: 'youtube#video',
  //       videoId: '9YAcZElJWSA',
  //     },
  //     snippet: {
  //       publishedAt: '2024-05-07T02:22:50Z',
  //       channelId: 'UChDzLC0lqmtpmIyH1gznCDw',
  //       title:
  //         'Liv Morgan confronta a Becky Lynch - WWE RAW 6 de Mayo 2024 Español',
  //       description:
  //         'Liv Morgan confronta a Becky Lynch - WWE RAW 6 de Mayo 2024 Español wwe en vivo gratis,resumenes de wwe raw español ...',
  //       thumbnails: {
  //         default: {
  //           url: 'https://i.ytimg.com/vi/9YAcZElJWSA/default.jpg',
  //           width: 120,
  //           height: 90,
  //         },
  //         medium: {
  //           url: 'https://i.ytimg.com/vi/9YAcZElJWSA/mqdefault.jpg',
  //           width: 320,
  //           height: 180,
  //         },
  //         high: {
  //           url: 'https://i.ytimg.com/vi/9YAcZElJWSA/hqdefault.jpg',
  //           width: 480,
  //           height: 360,
  //         },
  //       },
  //       channelTitle: 'SuperWrestling',
  //       liveBroadcastContent: 'none',
  //       publishTime: '2024-05-07T02:22:50Z',
  //     },
  //   },
  //   {
  //     kind: 'youtube#searchResult',
  //     id: {
  //       kind: 'youtube#video',
  //       videoId: 'Ugf3O_0UawQ',
  //     },
  //     snippet: {
  //       publishedAt: '2024-05-07T02:14:38Z',
  //       channelId: 'UC2FV-AELKAUSehINlGkQGMw',
  //       title: 'WWE Lyra Valkyria saves Becky Lynch 5/6/24',
  //       description:
  //         'Lyra Valkyria saves Becky Lynch - WWE RAW 5/6/24 WWE Highlights, WWE RAW Highlights, WWE SmackDown Highlights, ...',
  //       thumbnails: {
  //         default: {
  //           url: 'https://i.ytimg.com/vi/Ugf3O_0UawQ/default.jpg',
  //           width: 120,
  //           height: 90,
  //         },
  //         medium: {
  //           url: 'https://i.ytimg.com/vi/Ugf3O_0UawQ/mqdefault.jpg',
  //           width: 320,
  //           height: 180,
  //         },
  //         high: {
  //           url: 'https://i.ytimg.com/vi/Ugf3O_0UawQ/hqdefault.jpg',
  //           width: 480,
  //           height: 360,
  //         },
  //       },
  //       channelTitle: "Women's Wrestling",
  //       liveBroadcastContent: 'none',
  //       publishTime: '2024-05-07T02:14:38Z',
  //     },
  //   },
  //   {
  //     kind: 'youtube#searchResult',
  //     id: {
  //       kind: 'youtube#video',
  //       videoId: 'uP7WGTjv6j8',
  //     },
  //     snippet: {
  //       publishedAt: '2024-05-07T02:15:04Z',
  //       channelId: 'UCQJk6ACbHJY3-Fp6OK6MXCg',
  //       title:
  //         'WWE 7 May 2024 Roman Reigns VS. Brock Lesnar VS. The Rock VS. Cody Rhodes VS. All Raw Smackdown',
  //       description:
  //         'WWE 7 May 2024 Roman Reigns VS. Brock Lesnar VS. The Rock VS. Cody Rhodes VS. All Raw Smackdown.',
  //       thumbnails: {
  //         default: {
  //           url: 'https://i.ytimg.com/vi/uP7WGTjv6j8/default.jpg',
  //           width: 120,
  //           height: 90,
  //         },
  //         medium: {
  //           url: 'https://i.ytimg.com/vi/uP7WGTjv6j8/mqdefault.jpg',
  //           width: 320,
  //           height: 180,
  //         },
  //         high: {
  //           url: 'https://i.ytimg.com/vi/uP7WGTjv6j8/hqdefault.jpg',
  //           width: 480,
  //           height: 360,
  //         },
  //       },
  //       channelTitle: 'Os Mania',
  //       liveBroadcastContent: 'none',
  //       publishTime: '2024-05-07T02:15:04Z',
  //     },
  //   },
  //   {
  //     kind: 'youtube#searchResult',
  //     id: {
  //       kind: 'youtube#video',
  //       videoId: 'CR08x2OArDg',
  //     },
  //     snippet: {
  //       publishedAt: '2024-05-07T02:13:07Z',
  //       channelId: 'UC2FV-AELKAUSehINlGkQGMw',
  //       title: 'WWE Liv Morgan confronts Becky Lynch 5/6/24',
  //       description:
  //         'Liv Morgan confronts Becky Lynch - WWE RAW 5/6/24 WWE Highlights, WWE RAW Highlights, WWE SmackDown Highlights, ...',
  //       thumbnails: {
  //         default: {
  //           url: 'https://i.ytimg.com/vi/CR08x2OArDg/default.jpg',
  //           width: 120,
  //           height: 90,
  //         },
  //         medium: {
  //           url: 'https://i.ytimg.com/vi/CR08x2OArDg/mqdefault.jpg',
  //           width: 320,
  //           height: 180,
  //         },
  //         high: {
  //           url: 'https://i.ytimg.com/vi/CR08x2OArDg/hqdefault.jpg',
  //           width: 480,
  //           height: 360,
  //         },
  //       },
  //       channelTitle: "Women's Wrestling",
  //       liveBroadcastContent: 'none',
  //       publishTime: '2024-05-07T02:13:07Z',
  //     },
  //   },
  //   {
  //     kind: 'youtube#searchResult',
  //     id: {
  //       kind: 'youtube#video',
  //       videoId: 'gwbAgyz64pc',
  //     },
  //     snippet: {
  //       publishedAt: '2024-05-07T02:08:49Z',
  //       channelId: 'UCgKpcxVyF0qXU1h_Irzd7XA',
  //       title:
  //         'R-Truth brings UConn Head Coach Dan Hurley to Raw, wants UConn vs. The Awesome Truth',
  //       description:
  //         "R-Truth brought Uconn Men's Basketball Head Coach Dan Hurley to Monday Night Raw and wanted the Huskies to face The ...",
  //       thumbnails: {
  //         default: {
  //           url: 'https://i.ytimg.com/vi/gwbAgyz64pc/default.jpg',
  //           width: 120,
  //           height: 90,
  //         },
  //         medium: {
  //           url: 'https://i.ytimg.com/vi/gwbAgyz64pc/mqdefault.jpg',
  //           width: 320,
  //           height: 180,
  //         },
  //         high: {
  //           url: 'https://i.ytimg.com/vi/gwbAgyz64pc/hqdefault.jpg',
  //           width: 480,
  //           height: 360,
  //         },
  //       },
  //       channelTitle: 'WWE ON FOX',
  //       liveBroadcastContent: 'none',
  //       publishTime: '2024-05-07T02:08:49Z',
  //     },
  //   },
  //   {
  //     kind: 'youtube#searchResult',
  //     id: {
  //       kind: 'youtube#video',
  //       videoId: 'ZwwDBwidz0g',
  //     },
  //     snippet: {
  //       publishedAt: '2024-05-07T02:07:49Z',
  //       channelId: 'UCNCfLZyGE5hc--zoCUf6bwg',
  //       title:
  //         'Carlito habla con The Judgment Day en Backstage - WWE Raw 06/05/2024 (En Español)',
  //       description: '',
  //       thumbnails: {
  //         default: {
  //           url: 'https://i.ytimg.com/vi/ZwwDBwidz0g/default.jpg',
  //           width: 120,
  //           height: 90,
  //         },
  //         medium: {
  //           url: 'https://i.ytimg.com/vi/ZwwDBwidz0g/mqdefault.jpg',
  //           width: 320,
  //           height: 180,
  //         },
  //         high: {
  //           url: 'https://i.ytimg.com/vi/ZwwDBwidz0g/hqdefault.jpg',
  //           width: 480,
  //           height: 360,
  //         },
  //       },
  //       channelTitle: 'Rodrigo XD 3',
  //       liveBroadcastContent: 'none',
  //       publishTime: '2024-05-07T02:07:49Z',
  //     },
  //   },
  //   {
  //     kind: 'youtube#searchResult',
  //     id: {
  //       kind: 'youtube#video',
  //       videoId: 'TvdDcW4mVjQ',
  //     },
  //     snippet: {
  //       publishedAt: '2024-05-07T02:06:41Z',
  //       channelId: 'UCQVX2xe4xNcv4LLNYdNio7Q',
  //       title:
  //         'AY YO! Why bro pin him like that? 😂 #wwe #wweraw #therock #wwenews #fypシ #wrestling #codyrhodes',
  //       description: '',
  //       thumbnails: {
  //         default: {
  //           url: 'https://i.ytimg.com/vi/TvdDcW4mVjQ/default.jpg',
  //           width: 120,
  //           height: 90,
  //         },
  //         medium: {
  //           url: 'https://i.ytimg.com/vi/TvdDcW4mVjQ/mqdefault.jpg',
  //           width: 320,
  //           height: 180,
  //         },
  //         high: {
  //           url: 'https://i.ytimg.com/vi/TvdDcW4mVjQ/hqdefault.jpg',
  //           width: 480,
  //           height: 360,
  //         },
  //       },
  //       channelTitle: 'Regular J0e',
  //       liveBroadcastContent: 'none',
  //       publishTime: '2024-05-07T02:06:41Z',
  //     },
  //   },
  //   {
  //     kind: 'youtube#searchResult',
  //     id: {
  //       kind: 'youtube#video',
  //       videoId: 'KL5_NE9o5ZY',
  //     },
  //     snippet: {
  //       publishedAt: '2024-05-07T02:05:43Z',
  //       channelId: 'UCjPBoM7hLsfIgr1Bm2qydBA',
  //       title: 'Judgement Day Segment - Raw 5/6/2024',
  //       description:
  //         'WWE, WWE Highlights, The Rock, Roman Reigns, Cody Rhodes, CM Punk, Randy Orton, Seth Rollins, Rhea Ripley, The ...',
  //       thumbnails: {
  //         default: {
  //           url: 'https://i.ytimg.com/vi/KL5_NE9o5ZY/default.jpg',
  //           width: 120,
  //           height: 90,
  //         },
  //         medium: {
  //           url: 'https://i.ytimg.com/vi/KL5_NE9o5ZY/mqdefault.jpg',
  //           width: 320,
  //           height: 180,
  //         },
  //         high: {
  //           url: 'https://i.ytimg.com/vi/KL5_NE9o5ZY/hqdefault.jpg',
  //           width: 480,
  //           height: 360,
  //         },
  //       },
  //       channelTitle: 'Wrestling Promos',
  //       liveBroadcastContent: 'none',
  //       publishTime: '2024-05-07T02:05:43Z',
  //     },
  //   },
  //   {
  //     kind: 'youtube#searchResult',
  //     id: {
  //       kind: 'youtube#video',
  //       videoId: 'dwjxCwrQr10',
  //     },
  //     snippet: {
  //       publishedAt: '2024-05-07T02:02:33Z',
  //       channelId: 'UCJ5v_MCY6GNUBTO8-D3XoAg',
  //       title:
  //         'Ricochet vs. Ilja Dragunov — King of the Ring Tournament Match: Raw highlights, May 6, 2024',
  //       description:
  //         'The newly crowned WWE Speed Champion battles The Mad Dragon in the first round of the King of the Ring Tournament.',
  //       thumbnails: {
  //         default: {
  //           url: 'https://i.ytimg.com/vi/dwjxCwrQr10/default.jpg',
  //           width: 120,
  //           height: 90,
  //         },
  //         medium: {
  //           url: 'https://i.ytimg.com/vi/dwjxCwrQr10/mqdefault.jpg',
  //           width: 320,
  //           height: 180,
  //         },
  //         high: {
  //           url: 'https://i.ytimg.com/vi/dwjxCwrQr10/hqdefault.jpg',
  //           width: 480,
  //           height: 360,
  //         },
  //       },
  //       channelTitle: 'WWE',
  //       liveBroadcastContent: 'none',
  //       publishTime: '2024-05-07T02:02:33Z',
  //     },
  //   },
  //   {
  //     kind: 'youtube#searchResult',
  //     id: {
  //       kind: 'youtube#video',
  //       videoId: 'DvFlL3A0Lcc',
  //     },
  //     snippet: {
  //       publishedAt: '2024-05-07T01:53:35Z',
  //       channelId: 'UCTwpYIvTEGmJjR9M9tLUOUA',
  //       title: 'LIVE - WWE RAW 5/6/2024 LIVE STREAM',
  //       description:
  //         'LIVE STREAMING WWE RAW 5/6/2024 wwe raw,wwe,wwe raw live stream,raw live stream,wwe raw results,wwe raw watch along ...',
  //       thumbnails: {
  //         default: {
  //           url: 'https://i.ytimg.com/vi/DvFlL3A0Lcc/default.jpg',
  //           width: 120,
  //           height: 90,
  //         },
  //         medium: {
  //           url: 'https://i.ytimg.com/vi/DvFlL3A0Lcc/mqdefault.jpg',
  //           width: 320,
  //           height: 180,
  //         },
  //         high: {
  //           url: 'https://i.ytimg.com/vi/DvFlL3A0Lcc/hqdefault.jpg',
  //           width: 480,
  //           height: 360,
  //         },
  //       },
  //       channelTitle: 'Jung Junge',
  //       liveBroadcastContent: 'none',
  //       publishTime: '2024-05-07T01:53:35Z',
  //     },
  //   },
  //   {
  //     kind: 'youtube#searchResult',
  //     id: {
  //       kind: 'youtube#video',
  //       videoId: 'XS2nXzjvYsc',
  //     },
  //     snippet: {
  //       publishedAt: '2024-05-07T01:44:44Z',
  //       channelId: 'UCJ5v_MCY6GNUBTO8-D3XoAg',
  //       title:
  //         'CM Punk challenges Drew McIntyre to meet him in the ring: Raw highlights, May 6, 2024',
  //       description:
  //         "CM Punk calls himself the unforgiving conscience of Drew McIntyre's action as he waits to meet The Scottish Superstar in the ...",
  //       thumbnails: {
  //         default: {
  //           url: 'https://i.ytimg.com/vi/XS2nXzjvYsc/default.jpg',
  //           width: 120,
  //           height: 90,
  //         },
  //         medium: {
  //           url: 'https://i.ytimg.com/vi/XS2nXzjvYsc/mqdefault.jpg',
  //           width: 320,
  //           height: 180,
  //         },
  //         high: {
  //           url: 'https://i.ytimg.com/vi/XS2nXzjvYsc/hqdefault.jpg',
  //           width: 480,
  //           height: 360,
  //         },
  //       },
  //       channelTitle: 'WWE',
  //       liveBroadcastContent: 'none',
  //       publishTime: '2024-05-07T01:44:44Z',
  //     },
  //   },
  //   {
  //     kind: 'youtube#searchResult',
  //     id: {
  //       kind: 'youtube#video',
  //       videoId: 'pgjANXUMfdY',
  //     },
  //     snippet: {
  //       publishedAt: '2024-05-07T01:39:22Z',
  //       channelId: 'UCcx53NYI8tbDnlLliHu1IZA',
  //       title:
  //         'CM punk troll drew MacIntyre at raw | today RAW segment  | Tamil translation | wrestling king tamil',
  //       description:
  //         'photo crater WWE.com insta WWE updates wwe news Tamil wwe news wrestling news Tamil #wrestlemania #wrestlingkingtamil ...',
  //       thumbnails: {
  //         default: {
  //           url: 'https://i.ytimg.com/vi/pgjANXUMfdY/default.jpg',
  //           width: 120,
  //           height: 90,
  //         },
  //         medium: {
  //           url: 'https://i.ytimg.com/vi/pgjANXUMfdY/mqdefault.jpg',
  //           width: 320,
  //           height: 180,
  //         },
  //         high: {
  //           url: 'https://i.ytimg.com/vi/pgjANXUMfdY/hqdefault.jpg',
  //           width: 480,
  //           height: 360,
  //         },
  //       },
  //       channelTitle: 'WRESTLING KING TAMIL 2.0',
  //       liveBroadcastContent: 'none',
  //       publishTime: '2024-05-07T01:39:22Z',
  //     },
  //   },
  //   {
  //     kind: 'youtube#searchResult',
  //     id: {
  //       kind: 'youtube#video',
  //       videoId: 'Z83Qozxp9CA',
  //     },
  //     snippet: {
  //       publishedAt: '2024-05-07T01:26:41Z',
  //       channelId: 'UCowQZ1a8PppiL8E1sVmElqA',
  //       title:
  //         'WWE Monday Night RAW 5/6/2024 Highlights HD | WWE RAW 6 May 2024 Full Highlights HD',
  //       description:
  //         'WWE Monday Night RAW 5/6/2024 Highlights HD | WWE RAW 6 May 2024 Full Highlights HD #WWE #WWERAW ...',
  //       thumbnails: {
  //         default: {
  //           url: 'https://i.ytimg.com/vi/Z83Qozxp9CA/default.jpg',
  //           width: 120,
  //           height: 90,
  //         },
  //         medium: {
  //           url: 'https://i.ytimg.com/vi/Z83Qozxp9CA/mqdefault.jpg',
  //           width: 320,
  //           height: 180,
  //         },
  //         high: {
  //           url: 'https://i.ytimg.com/vi/Z83Qozxp9CA/hqdefault.jpg',
  //           width: 480,
  //           height: 360,
  //         },
  //       },
  //       channelTitle: 'أم كريم 31',
  //       liveBroadcastContent: 'none',
  //       publishTime: '2024-05-07T01:26:41Z',
  //     },
  //   },
  //   {
  //     kind: 'youtube#searchResult',
  //     id: {
  //       kind: 'youtube#video',
  //       videoId: 'aylkQzwXvME',
  //     },
  //     snippet: {
  //       publishedAt: '2024-05-07T01:22:22Z',
  //       channelId: 'UCTwpYIvTEGmJjR9M9tLUOUA',
  //       title: 'LIVE - WWE RAW 5/6/2024 LIVE STREAM',
  //       description:
  //         'LIVE STREAMING WWE RAW 5/6/2024 wwe raw,wwe,wwe raw live stream,raw live stream,wwe raw results,wwe raw watch along ...',
  //       thumbnails: {
  //         default: {
  //           url: 'https://i.ytimg.com/vi/aylkQzwXvME/default.jpg',
  //           width: 120,
  //           height: 90,
  //         },
  //         medium: {
  //           url: 'https://i.ytimg.com/vi/aylkQzwXvME/mqdefault.jpg',
  //           width: 320,
  //           height: 180,
  //         },
  //         high: {
  //           url: 'https://i.ytimg.com/vi/aylkQzwXvME/hqdefault.jpg',
  //           width: 480,
  //           height: 360,
  //         },
  //       },
  //       channelTitle: 'Jung Junge',
  //       liveBroadcastContent: 'none',
  //       publishTime: '2024-05-07T01:22:22Z',
  //     },
  //   },
  //   {
  //     kind: 'youtube#searchResult',
  //     id: {
  //       kind: 'youtube#video',
  //       videoId: 'g29Opw-ttHM',
  //     },
  //     snippet: {
  //       publishedAt: '2024-05-07T01:13:52Z',
  //       channelId: 'UCJ5v_MCY6GNUBTO8-D3XoAg',
  //       title:
  //         'Jey Uso vs. Finn Bálor — King of the Ring Tournament Match: Raw highlights, May 6, 2024',
  //       description:
  //         'Jey Uso replaces an injured Drew McIntyre against Finn Bálor in the first round of the King of the Ring Tournament. Catch WWE ...',
  //       thumbnails: {
  //         default: {
  //           url: 'https://i.ytimg.com/vi/g29Opw-ttHM/default.jpg',
  //           width: 120,
  //           height: 90,
  //         },
  //         medium: {
  //           url: 'https://i.ytimg.com/vi/g29Opw-ttHM/mqdefault.jpg',
  //           width: 320,
  //           height: 180,
  //         },
  //         high: {
  //           url: 'https://i.ytimg.com/vi/g29Opw-ttHM/hqdefault.jpg',
  //           width: 480,
  //           height: 360,
  //         },
  //       },
  //       channelTitle: 'WWE',
  //       liveBroadcastContent: 'none',
  //       publishTime: '2024-05-07T01:13:52Z',
  //     },
  //   },
  //   {
  //     kind: 'youtube#searchResult',
  //     id: {
  //       kind: 'youtube#video',
  //       videoId: '88K3swzU1Mg',
  //     },
  //     snippet: {
  //       publishedAt: '2024-05-07T01:05:58Z',
  //       channelId: 'UCTwpYIvTEGmJjR9M9tLUOUA',
  //       title: 'LIVE - WWE RAW 5/6/2024 LIVE STREAM',
  //       description:
  //         'LIVE STREAMING WWE RAW 5/6/2024 wwe raw,wwe,wwe raw live stream,raw live stream,wwe raw results,wwe raw watch along ...',
  //       thumbnails: {
  //         default: {
  //           url: 'https://i.ytimg.com/vi/88K3swzU1Mg/default_live.jpg',
  //           width: 120,
  //           height: 90,
  //         },
  //         medium: {
  //           url: 'https://i.ytimg.com/vi/88K3swzU1Mg/mqdefault_live.jpg',
  //           width: 320,
  //           height: 180,
  //         },
  //         high: {
  //           url: 'https://i.ytimg.com/vi/88K3swzU1Mg/hqdefault_live.jpg',
  //           width: 480,
  //           height: 360,
  //         },
  //       },
  //       channelTitle: 'Jung Junge',
  //       liveBroadcastContent: 'upcoming',
  //       publishTime: '2024-05-07T01:05:58Z',
  //     },
  //   },
  //   {
  //     kind: 'youtube#searchResult',
  //     id: {
  //       kind: 'youtube#video',
  //       videoId: 'Ob0ZyeYxAU0',
  //     },
  //     snippet: {
  //       publishedAt: '2024-05-07T01:05:17Z',
  //       channelId: 'UCTwpYIvTEGmJjR9M9tLUOUA',
  //       title: 'LIVE - WWE RAW 5/6/2024 LIVE STREAM',
  //       description:
  //         'LIVE STREAMING WWE RAW 5/6/2024 wwe raw,wwe,wwe raw live stream,raw live stream,wwe raw results,wwe raw watch along ...',
  //       thumbnails: {
  //         default: {
  //           url: 'https://i.ytimg.com/vi/Ob0ZyeYxAU0/default_live.jpg',
  //           width: 120,
  //           height: 90,
  //         },
  //         medium: {
  //           url: 'https://i.ytimg.com/vi/Ob0ZyeYxAU0/mqdefault_live.jpg',
  //           width: 320,
  //           height: 180,
  //         },
  //         high: {
  //           url: 'https://i.ytimg.com/vi/Ob0ZyeYxAU0/hqdefault_live.jpg',
  //           width: 480,
  //           height: 360,
  //         },
  //       },
  //       channelTitle: 'Jung Junge',
  //       liveBroadcastContent: 'upcoming',
  //       publishTime: '2024-05-07T01:05:17Z',
  //     },
  //   },
  //   {
  //     kind: 'youtube#searchResult',
  //     id: {
  //       kind: 'youtube#video',
  //       videoId: 'TtOrCPD0oSM',
  //     },
  //     snippet: {
  //       publishedAt: '2024-05-07T01:06:06Z',
  //       channelId: 'UChDzLC0lqmtpmIyH1gznCDw',
  //       title: 'Natalya Vs Iyo Sky - WWE RAW 6 de Mayo 2024 Español',
  //       description:
  //         'Natalya Vs Iyo Sky - WWE RAW 6 de Mayo 2024 Español wwe en vivo gratis,resumenes de wwe raw español,resumenes de wwe ...',
  //       thumbnails: {
  //         default: {
  //           url: 'https://i.ytimg.com/vi/TtOrCPD0oSM/default.jpg',
  //           width: 120,
  //           height: 90,
  //         },
  //         medium: {
  //           url: 'https://i.ytimg.com/vi/TtOrCPD0oSM/mqdefault.jpg',
  //           width: 320,
  //           height: 180,
  //         },
  //         high: {
  //           url: 'https://i.ytimg.com/vi/TtOrCPD0oSM/hqdefault.jpg',
  //           width: 480,
  //           height: 360,
  //         },
  //       },
  //       channelTitle: 'SuperWrestling',
  //       liveBroadcastContent: 'none',
  //       publishTime: '2024-05-07T01:06:06Z',
  //     },
  //   },
  //   {
  //     kind: 'youtube#searchResult',
  //     id: {
  //       kind: 'youtube#video',
  //       videoId: 'sFvUPuyMFvQ',
  //     },
  //     snippet: {
  //       publishedAt: '2024-05-07T01:07:10Z',
  //       channelId: 'UCTwpYIvTEGmJjR9M9tLUOUA',
  //       title: 'LIVE - WWE RAW 5/6/2024 LIVE STREAM',
  //       description:
  //         'LIVE STREAMING WWE RAW 5/6/2024 wwe raw,wwe,wwe raw live stream,raw live stream,wwe raw results,wwe raw watch along ...',
  //       thumbnails: {
  //         default: {
  //           url: 'https://i.ytimg.com/vi/sFvUPuyMFvQ/default.jpg',
  //           width: 120,
  //           height: 90,
  //         },
  //         medium: {
  //           url: 'https://i.ytimg.com/vi/sFvUPuyMFvQ/mqdefault.jpg',
  //           width: 320,
  //           height: 180,
  //         },
  //         high: {
  //           url: 'https://i.ytimg.com/vi/sFvUPuyMFvQ/hqdefault.jpg',
  //           width: 480,
  //           height: 360,
  //         },
  //       },
  //       channelTitle: 'Jung Junge',
  //       liveBroadcastContent: 'none',
  //       publishTime: '2024-05-07T01:07:10Z',
  //     },
  //   },
  //   {
  //     kind: 'youtube#searchResult',
  //     id: {
  //       kind: 'youtube#video',
  //       videoId: '_h2-1x-0PMA',
  //     },
  //     snippet: {
  //       publishedAt: '2024-05-07T01:03:19Z',
  //       channelId: 'UCgKpcxVyF0qXU1h_Irzd7XA',
  //       title:
  //         'Drew McIntyre misses CM Punk backstage after interfering in Jey Uso, Finn Bálor match on Raw',
  //       description:
  //         'Drew McIntyre was on a hunt for CM Punk backstage at Monday Night Raw, just missing him backstage after messing with Jey ...',
  //       thumbnails: {
  //         default: {
  //           url: 'https://i.ytimg.com/vi/_h2-1x-0PMA/default.jpg',
  //           width: 120,
  //           height: 90,
  //         },
  //         medium: {
  //           url: 'https://i.ytimg.com/vi/_h2-1x-0PMA/mqdefault.jpg',
  //           width: 320,
  //           height: 180,
  //         },
  //         high: {
  //           url: 'https://i.ytimg.com/vi/_h2-1x-0PMA/hqdefault.jpg',
  //           width: 480,
  //           height: 360,
  //         },
  //       },
  //       channelTitle: 'WWE ON FOX',
  //       liveBroadcastContent: 'none',
  //       publishTime: '2024-05-07T01:03:19Z',
  //     },
  //   },
  //   {
  //     kind: 'youtube#searchResult',
  //     id: {
  //       kind: 'youtube#video',
  //       videoId: 'p3EgiAkg5eg',
  //     },
  //     snippet: {
  //       publishedAt: '2024-05-07T01:01:37Z',
  //       channelId: 'UCTwpYIvTEGmJjR9M9tLUOUA',
  //       title: 'LIVE - WWE RAW 5/6/2024 LIVE STREAM',
  //       description:
  //         'LIVE STREAMING WWE RAW 5/6/2024 wwe raw,wwe,wwe raw live stream,raw live stream,wwe raw results,wwe raw watch along ...',
  //       thumbnails: {
  //         default: {
  //           url: 'https://i.ytimg.com/vi/p3EgiAkg5eg/default.jpg',
  //           width: 120,
  //           height: 90,
  //         },
  //         medium: {
  //           url: 'https://i.ytimg.com/vi/p3EgiAkg5eg/mqdefault.jpg',
  //           width: 320,
  //           height: 180,
  //         },
  //         high: {
  //           url: 'https://i.ytimg.com/vi/p3EgiAkg5eg/hqdefault.jpg',
  //           width: 480,
  //           height: 360,
  //         },
  //       },
  //       channelTitle: 'Jung Junge',
  //       liveBroadcastContent: 'none',
  //       publishTime: '2024-05-07T01:01:37Z',
  //     },
  //   },
  //   {
  //     kind: 'youtube#searchResult',
  //     id: {
  //       kind: 'youtube#video',
  //       videoId: 'SDB36zq2Tjc',
  //     },
  //     snippet: {
  //       publishedAt: '2024-05-07T01:01:01Z',
  //       channelId: 'UCSy3TvvwAV12MD0rLsHyClQ',
  //       title:
  //         'CM Punk Continues to Live in Drew McIntyre&#39;s Head | WWE Raw Highlights 5/6/24 | WWE on USA',
  //       description:
  //         'CM Punk is still waiting for Drew McIntyre. WWE Raw Highlights 5/6/24. Watch WWE Raw Monday nights at 8/7c on USA Network.',
  //       thumbnails: {
  //         default: {
  //           url: 'https://i.ytimg.com/vi/SDB36zq2Tjc/default.jpg',
  //           width: 120,
  //           height: 90,
  //         },
  //         medium: {
  //           url: 'https://i.ytimg.com/vi/SDB36zq2Tjc/mqdefault.jpg',
  //           width: 320,
  //           height: 180,
  //         },
  //         high: {
  //           url: 'https://i.ytimg.com/vi/SDB36zq2Tjc/hqdefault.jpg',
  //           width: 480,
  //           height: 360,
  //         },
  //       },
  //       channelTitle: 'WWE on USA',
  //       liveBroadcastContent: 'none',
  //       publishTime: '2024-05-07T01:01:01Z',
  //     },
  //   },
  //   {
  //     kind: 'youtube#searchResult',
  //     id: {
  //       kind: 'youtube#video',
  //       videoId: 'r8oUaXSbakg',
  //     },
  //     snippet: {
  //       publishedAt: '2024-05-07T00:57:50Z',
  //       channelId: 'UC2FV-AELKAUSehINlGkQGMw',
  //       title: 'WWE Natalya vs. Iyo Sky 1/2',
  //       description:
  //         'Natalya vs. IYO SKY 1/2 - WWE RAW 5/6/24 WWE Highlights, WWE RAW Highlights, WWE SmackDown Highlights, WWE Full ...',
  //       thumbnails: {
  //         default: {
  //           url: 'https://i.ytimg.com/vi/r8oUaXSbakg/default.jpg',
  //           width: 120,
  //           height: 90,
  //         },
  //         medium: {
  //           url: 'https://i.ytimg.com/vi/r8oUaXSbakg/mqdefault.jpg',
  //           width: 320,
  //           height: 180,
  //         },
  //         high: {
  //           url: 'https://i.ytimg.com/vi/r8oUaXSbakg/hqdefault.jpg',
  //           width: 480,
  //           height: 360,
  //         },
  //       },
  //       channelTitle: "Women's Wrestling",
  //       liveBroadcastContent: 'none',
  //       publishTime: '2024-05-07T00:57:50Z',
  //     },
  //   },
  //   {
  //     kind: 'youtube#searchResult',
  //     id: {
  //       kind: 'youtube#video',
  //       videoId: '24iS2QpmTS4',
  //     },
  //     snippet: {
  //       publishedAt: '2024-05-07T00:51:17Z',
  //       channelId: 'UCQWMcsQb99i1pJ9YnBC1DxQ',
  //       title: 'CM Punk leave your message - WWE RAW 5/6/2024',
  //       description:
  //         'CM Punk leave your message - WWE RAW 5/6/2024 The Rock, Roman Reigns, Cody Rhodes, CM Punk, Randy Orton, CM Punk ...',
  //       thumbnails: {
  //         default: {
  //           url: 'https://i.ytimg.com/vi/24iS2QpmTS4/default.jpg',
  //           width: 120,
  //           height: 90,
  //         },
  //         medium: {
  //           url: 'https://i.ytimg.com/vi/24iS2QpmTS4/mqdefault.jpg',
  //           width: 320,
  //           height: 180,
  //         },
  //         high: {
  //           url: 'https://i.ytimg.com/vi/24iS2QpmTS4/hqdefault.jpg',
  //           width: 480,
  //           height: 360,
  //         },
  //       },
  //       channelTitle: 'Wrestling Best',
  //       liveBroadcastContent: 'none',
  //       publishTime: '2024-05-07T00:51:17Z',
  //     },
  //   },
  //   {
  //     kind: 'youtube#searchResult',
  //     id: {
  //       kind: 'youtube#video',
  //       videoId: 'iCJCzc2vq1M',
  //     },
  //     snippet: {
  //       publishedAt: '2024-05-07T00:50:00Z',
  //       channelId: 'UChDzLC0lqmtpmIyH1gznCDw',
  //       title: 'CM Punk deja su mensaje - WWE RAW 6 de Mayo 2024 Español',
  //       description:
  //         'CM Punk deja su mensaje - WWE RAW 6 de Mayo 2024 Español wwe en vivo gratis,resumenes de wwe raw español,resumenes ...',
  //       thumbnails: {
  //         default: {
  //           url: 'https://i.ytimg.com/vi/iCJCzc2vq1M/default.jpg',
  //           width: 120,
  //           height: 90,
  //         },
  //         medium: {
  //           url: 'https://i.ytimg.com/vi/iCJCzc2vq1M/mqdefault.jpg',
  //           width: 320,
  //           height: 180,
  //         },
  //         high: {
  //           url: 'https://i.ytimg.com/vi/iCJCzc2vq1M/hqdefault.jpg',
  //           width: 480,
  //           height: 360,
  //         },
  //       },
  //       channelTitle: 'SuperWrestling',
  //       liveBroadcastContent: 'none',
  //       publishTime: '2024-05-07T00:50:00Z',
  //     },
  //   },
  //   {
  //     kind: 'youtube#searchResult',
  //     id: {
  //       kind: 'youtube#video',
  //       videoId: 'juTo6mLJ4mM',
  //     },
  //     snippet: {
  //       publishedAt: '2024-05-07T00:46:32Z',
  //       channelId: 'UCNCfLZyGE5hc--zoCUf6bwg',
  //       title:
  //         'Drew McIntyre discute con Adam Pearce en Backstage - WWE Raw 06/05/2024 (En Español)',
  //       description: '',
  //       thumbnails: {
  //         default: {
  //           url: 'https://i.ytimg.com/vi/juTo6mLJ4mM/default.jpg',
  //           width: 120,
  //           height: 90,
  //         },
  //         medium: {
  //           url: 'https://i.ytimg.com/vi/juTo6mLJ4mM/mqdefault.jpg',
  //           width: 320,
  //           height: 180,
  //         },
  //         high: {
  //           url: 'https://i.ytimg.com/vi/juTo6mLJ4mM/hqdefault.jpg',
  //           width: 480,
  //           height: 360,
  //         },
  //       },
  //       channelTitle: 'Rodrigo XD 3',
  //       liveBroadcastContent: 'none',
  //       publishTime: '2024-05-07T00:46:32Z',
  //     },
  //   },
  //   {
  //     kind: 'youtube#searchResult',
  //     id: {
  //       kind: 'youtube#video',
  //       videoId: 'yudXbzCmfa8',
  //     },
  //     snippet: {
  //       publishedAt: '2024-05-07T00:39:11Z',
  //       channelId: 'UCgKpcxVyF0qXU1h_Irzd7XA',
  //       title:
  //         'Damian Priest apologizes for going off on Judgment Day, Jey Uso shocks Finn Bálor with match',
  //       description:
  //         'Damian Priest kicked off Monday Night Raw after Backlash and let his fellow Judgment Day family know that he was sorry for ...',
  //       thumbnails: {
  //         default: {
  //           url: 'https://i.ytimg.com/vi/yudXbzCmfa8/default.jpg',
  //           width: 120,
  //           height: 90,
  //         },
  //         medium: {
  //           url: 'https://i.ytimg.com/vi/yudXbzCmfa8/mqdefault.jpg',
  //           width: 320,
  //           height: 180,
  //         },
  //         high: {
  //           url: 'https://i.ytimg.com/vi/yudXbzCmfa8/hqdefault.jpg',
  //           width: 480,
  //           height: 360,
  //         },
  //       },
  //       channelTitle: 'WWE ON FOX',
  //       liveBroadcastContent: 'none',
  //       publishTime: '2024-05-07T00:39:11Z',
  //     },
  //   },
  //   {
  //     kind: 'youtube#searchResult',
  //     id: {
  //       kind: 'youtube#video',
  //       videoId: 'YG10i0Xy7h8',
  //     },
  //     snippet: {
  //       publishedAt: '2024-05-07T00:34:18Z',
  //       channelId: 'UCQWMcsQb99i1pJ9YnBC1DxQ',
  //       title: 'Jey Uso vs. Finn Bálor - WWE RAW 5/6/2024',
  //       description:
  //         'Jey Uso vs. Finn Bálor - WWE RAW 5/6/2024 The Rock, Roman Reigns, Cody Rhodes, CM Punk, Randy Orton, CM Punk Returns, ...',
  //       thumbnails: {
  //         default: {
  //           url: 'https://i.ytimg.com/vi/YG10i0Xy7h8/default.jpg',
  //           width: 120,
  //           height: 90,
  //         },
  //         medium: {
  //           url: 'https://i.ytimg.com/vi/YG10i0Xy7h8/mqdefault.jpg',
  //           width: 320,
  //           height: 180,
  //         },
  //         high: {
  //           url: 'https://i.ytimg.com/vi/YG10i0Xy7h8/hqdefault.jpg',
  //           width: 480,
  //           height: 360,
  //         },
  //       },
  //       channelTitle: 'Wrestling Best',
  //       liveBroadcastContent: 'none',
  //       publishTime: '2024-05-07T00:34:18Z',
  //     },
  //   },
  //   {
  //     kind: 'youtube#searchResult',
  //     id: {
  //       kind: 'youtube#video',
  //       videoId: 'TxH9qVow19c',
  //     },
  //     snippet: {
  //       publishedAt: '2024-05-07T00:21:13Z',
  //       channelId: 'UCA-1Nsp3jfX4Sjpcn7M0Atw',
  //       title: 'The Judgment Day Promo - WWE RAW 5/6/2024',
  //       description:
  //         'Disclaimer:* Please be aware that this YouTube channel is not officially affiliated with, endorsed by, or connected to World ...',
  //       thumbnails: {
  //         default: {
  //           url: 'https://i.ytimg.com/vi/TxH9qVow19c/default.jpg',
  //           width: 120,
  //           height: 90,
  //         },
  //         medium: {
  //           url: 'https://i.ytimg.com/vi/TxH9qVow19c/mqdefault.jpg',
  //           width: 320,
  //           height: 180,
  //         },
  //         high: {
  //           url: 'https://i.ytimg.com/vi/TxH9qVow19c/hqdefault.jpg',
  //           width: 480,
  //           height: 360,
  //         },
  //       },
  //       channelTitle: 'Wrestling Full HD',
  //       liveBroadcastContent: 'none',
  //       publishTime: '2024-05-07T00:21:13Z',
  //     },
  //   },
  //   {
  //     kind: 'youtube#searchResult',
  //     id: {
  //       kind: 'youtube#video',
  //       videoId: 'ZiAMQ0axspo',
  //     },
  //     snippet: {
  //       publishedAt: '2024-05-07T00:18:38Z',
  //       channelId: 'UCoa3SvgBeuJYTtosHSU9ZWQ',
  //       title:
  //         'Full Segment: Adam Pearce Interrupts Judgement Day - Raw 5/6/2024',
  //       description:
  //         'WWE, WWE Highlights, WWE 2024, Roman Reigns, Cody Rhodes, CM Punk, Randy Orton, Seth Rollins, Rhea Ripley, The ...',
  //       thumbnails: {
  //         default: {
  //           url: 'https://i.ytimg.com/vi/ZiAMQ0axspo/default.jpg',
  //           width: 120,
  //           height: 90,
  //         },
  //         medium: {
  //           url: 'https://i.ytimg.com/vi/ZiAMQ0axspo/mqdefault.jpg',
  //           width: 320,
  //           height: 180,
  //         },
  //         high: {
  //           url: 'https://i.ytimg.com/vi/ZiAMQ0axspo/hqdefault.jpg',
  //           width: 480,
  //           height: 360,
  //         },
  //       },
  //       channelTitle: 'Wrestling Segment',
  //       liveBroadcastContent: 'none',
  //       publishTime: '2024-05-07T00:18:38Z',
  //     },
  //   },
  //   {
  //     kind: 'youtube#searchResult',
  //     id: {
  //       kind: 'youtube#video',
  //       videoId: 'EXvxK8kHsCY',
  //     },
  //     snippet: {
  //       publishedAt: '2024-05-07T00:15:00Z',
  //       channelId: 'UCGqeCHzAOqau567ZQazjyTw',
  //       title: 'WWE Raw Kofi Kingston vs. Rey Mysterio Full Match',
  //       description:
  //         'wwe2k23 #gaming #gameplay #raw #edge #mysterio #mysterious #reymysterio #judgmentday #judgement #finnbàlor ...',
  //       thumbnails: {
  //         default: {
  //           url: 'https://i.ytimg.com/vi/EXvxK8kHsCY/default.jpg',
  //           width: 120,
  //           height: 90,
  //         },
  //         medium: {
  //           url: 'https://i.ytimg.com/vi/EXvxK8kHsCY/mqdefault.jpg',
  //           width: 320,
  //           height: 180,
  //         },
  //         high: {
  //           url: 'https://i.ytimg.com/vi/EXvxK8kHsCY/hqdefault.jpg',
  //           width: 480,
  //           height: 360,
  //         },
  //       },
  //       channelTitle: 'Suny Jadu',
  //       liveBroadcastContent: 'none',
  //       publishTime: '2024-05-07T00:15:00Z',
  //     },
  //   },
  //   {
  //     kind: 'youtube#searchResult',
  //     id: {
  //       kind: 'youtube#video',
  //       videoId: 'WnlbjFtYeNI',
  //     },
  //     snippet: {
  //       publishedAt: '2024-05-06T20:16:53Z',
  //       channelId: 'UCAeTKI3Zcv44VDqq0koHy7Q',
  //       title:
  //         'WWE 2K24: First DLC Previews! Full Entrance, Screenshots &amp; Rating Revealed!',
  //       description:
  //         'Check out the first previews for the WWE 2K24 ECW Punk Pack DLC featuring ECW Legend The Sandman! In this first set of DLC ...',
  //       thumbnails: {
  //         default: {
  //           url: 'https://i.ytimg.com/vi/WnlbjFtYeNI/default.jpg',
  //           width: 120,
  //           height: 90,
  //         },
  //         medium: {
  //           url: 'https://i.ytimg.com/vi/WnlbjFtYeNI/mqdefault.jpg',
  //           width: 320,
  //           height: 180,
  //         },
  //         high: {
  //           url: 'https://i.ytimg.com/vi/WnlbjFtYeNI/hqdefault.jpg',
  //           width: 480,
  //           height: 360,
  //         },
  //       },
  //       channelTitle: 'Smacktalks',
  //       liveBroadcastContent: 'none',
  //       publishTime: '2024-05-06T20:16:53Z',
  //     },
  //   },
  //   {
  //     kind: 'youtube#searchResult',
  //     id: {
  //       kind: 'youtube#video',
  //       videoId: 'W-6u428aCWw',
  //     },
  //     snippet: {
  //       publishedAt: '2024-05-06T18:44:58Z',
  //       channelId: 'UClxQgbi_u-O3ARrCU9QACSQ',
  //       title: 'Predicting WWE King &amp; Queen of The Ring 2024 (First Round)',
  //       description: '',
  //       thumbnails: {
  //         default: {
  //           url: 'https://i.ytimg.com/vi/W-6u428aCWw/default.jpg',
  //           width: 120,
  //           height: 90,
  //         },
  //         medium: {
  //           url: 'https://i.ytimg.com/vi/W-6u428aCWw/mqdefault.jpg',
  //           width: 320,
  //           height: 180,
  //         },
  //         high: {
  //           url: 'https://i.ytimg.com/vi/W-6u428aCWw/hqdefault.jpg',
  //           width: 480,
  //           height: 360,
  //         },
  //       },
  //       channelTitle: 'Sooplex',
  //       liveBroadcastContent: 'none',
  //       publishTime: '2024-05-06T18:44:58Z',
  //     },
  //   },
  //   {
  //     kind: 'youtube#searchResult',
  //     id: {
  //       kind: 'youtube#video',
  //       videoId: 'U0-ohk-RBQw',
  //     },
  //     snippet: {
  //       publishedAt: '2024-05-06T18:00:31Z',
  //       channelId: 'UCXBHLImvA0zijGzAw9MG4LA',
  //       title: 'WWE RAW: IYO SKY Vs Natalya #WWERAW #WWE2K24',
  //       description:
  //         'SUBSCRIBE --- https://goo.gl/ebmedo Thanks for stopping by The RevELLEution, why not check out what else we have to offer by ...',
  //       thumbnails: {
  //         default: {
  //           url: 'https://i.ytimg.com/vi/U0-ohk-RBQw/default.jpg',
  //           width: 120,
  //           height: 90,
  //         },
  //         medium: {
  //           url: 'https://i.ytimg.com/vi/U0-ohk-RBQw/mqdefault.jpg',
  //           width: 320,
  //           height: 180,
  //         },
  //         high: {
  //           url: 'https://i.ytimg.com/vi/U0-ohk-RBQw/hqdefault.jpg',
  //           width: 480,
  //           height: 360,
  //         },
  //       },
  //       channelTitle: 'Revelleution',
  //       liveBroadcastContent: 'none',
  //       publishTime: '2024-05-06T18:00:31Z',
  //     },
  //   },
  //   {
  //     kind: 'youtube#searchResult',
  //     id: {
  //       kind: 'youtube#video',
  //       videoId: 'aU17nqx8rhU',
  //     },
  //     snippet: {
  //       publishedAt: '2024-05-06T17:55:18Z',
  //       channelId: 'UCFSzSUAjazxK-HHL9tjpcuQ',
  //       title:
  //         'Sorry Y’all! #wwe #wrestling #prowrestling #fyp #fypシ #foryou #shorts #short #parenting #update',
  //       description: '',
  //       thumbnails: {
  //         default: {
  //           url: 'https://i.ytimg.com/vi/aU17nqx8rhU/default.jpg',
  //           width: 120,
  //           height: 90,
  //         },
  //         medium: {
  //           url: 'https://i.ytimg.com/vi/aU17nqx8rhU/mqdefault.jpg',
  //           width: 320,
  //           height: 180,
  //         },
  //         high: {
  //           url: 'https://i.ytimg.com/vi/aU17nqx8rhU/hqdefault.jpg',
  //           width: 480,
  //           height: 360,
  //         },
  //       },
  //       channelTitle: 'PartTimeGamerDad',
  //       liveBroadcastContent: 'none',
  //       publishTime: '2024-05-06T17:55:18Z',
  //     },
  //   },
  //   {
  //     kind: 'youtube#searchResult',
  //     id: {
  //       kind: 'youtube#video',
  //       videoId: 'IC5HJ2Rizx8',
  //     },
  //     snippet: {
  //       publishedAt: '2024-05-06T16:10:58Z',
  //       channelId: 'UC2k6iKdogZPP11xrlVsdn3Q',
  //       title: 'UNMISSABLE WWE RAW PREVIEW 6/5/2024 #wwe #wweraw #preview',
  //       description:
  //         'UNMISSABLE WWE RAW PREVIEW 6/5/2024 #wwe #wweraw #preview A big night in WWE not only are we getting the new Raw ...',
  //       thumbnails: {
  //         default: {
  //           url: 'https://i.ytimg.com/vi/IC5HJ2Rizx8/default.jpg',
  //           width: 120,
  //           height: 90,
  //         },
  //         medium: {
  //           url: 'https://i.ytimg.com/vi/IC5HJ2Rizx8/mqdefault.jpg',
  //           width: 320,
  //           height: 180,
  //         },
  //         high: {
  //           url: 'https://i.ytimg.com/vi/IC5HJ2Rizx8/hqdefault.jpg',
  //           width: 480,
  //           height: 360,
  //         },
  //       },
  //       channelTitle: 'Dave in real life',
  //       liveBroadcastContent: 'none',
  //       publishTime: '2024-05-06T16:10:58Z',
  //     },
  //   },
  // ];

