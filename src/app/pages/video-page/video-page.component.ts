import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { YoutubeApiService } from 'src/app/services/youtube-api.service';
import { Subscription, forkJoin, mergeMap } from 'rxjs';
import { UiStateService } from 'src/app/services/ui-state.service';

@Component({
  selector: 'app-video-page',
  templateUrl: './video-page.component.html',
  styleUrls: ['./video-page.component.scss'],
})
export class VideoPageComponent implements OnInit {
  fakeLoopData: number[] = Array.from({ length: 10 }, (_, index) => index);

  videoId!: string;
  channelId!: string;
  videoDetail: any;
  relatedVideos: any;
  videoComments: any;
  channelDetails: any;
  displayCount: number = 10;
  isLoading: boolean = true;
  isLoadingComments: boolean = true;
  isLoadingChannelDetails: boolean = true;
  isLoadingRelatedVideos: boolean = true;
  
  private loadingSub!: Subscription;


  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private youtubeApiService: YoutubeApiService,
    private router:Router,
    private uiStateService :UiStateService
  ) {
    // this.videoId = this.route.snapshot.params['id']; // Retrieve video ID from route
    this.route.params.subscribe((params) => {
      this.uiStateService.setLoadingState(true)
      this.videoId = params['videoId'];
      this.channelId = params['channelId'];
      this.fetchVideoDetails(this.videoId);
      this.fetchChannelDetails(this.channelId)
      this.fetchRelatedVideos(this.videoId)
      this.fetchVideoComments(this.videoId)
      // Now you have access to videoId and channelId
    });

    // this.videoDetail = {
    //   kind: 'youtube#video',
    //   id: 'yyDvq4vMinA',
    //   snippet: {
    //     publishedAt: '2024-05-06T14:25:45Z',
    //     channelId: 'UCc3D8R6m-0jH-y9DM6Zw3rg',
    //     title:
    //       "SHOCKING MEMBER In Roman Reigns' BLOODLINE 😱! UNEXPECTED | Judgement Day BREAK-UP, Kevin Owens | WWE",
    //     description:
    //       "SHOCKING MEMBER In Roman Reigns' BLOODLINE 😱! UNEXPECTED | Judgement Day BREAK-UP, Kevin Owens | WWE\n\n#romanreigns #bloodline #kevinowens #wweraw #wwe #wrestlingfansnetwork \n\nTIMESTAMPS:\n\n00:00 Monday Night Raw Preview \n\n01:59 Kevin Owens on if he will leave WWE\n\n04:06 Gunther winning the world championship soon\n\n06:19 Judgement Day break-up is imminent\n\n06:57 Shocking member to join Roman Reigns' BLOODLINE?\n____________________________________________\n\n🔥Social Links :-\n\nChat With Me On Instagram:- https://www.instagram.com/ankit_wfn/\n\nFollow On Twitter:- https://twitter.com/ankit_wfn/\n\nWhatsapp channel - https://wa.openinapp.co/r1z7b  \n\nImage Credits- https://www.wwe.com",
    //     thumbnails: {
    //       default: {
    //         url: 'https://i.ytimg.com/vi/yyDvq4vMinA/default.jpg',
    //         width: 120,
    //         height: 90,
    //       },
    //       medium: {
    //         url: 'https://i.ytimg.com/vi/yyDvq4vMinA/mqdefault.jpg',
    //         width: 320,
    //         height: 180,
    //       },
    //       high: {
    //         url: 'https://i.ytimg.com/vi/yyDvq4vMinA/hqdefault.jpg',
    //         width: 480,
    //         height: 360,
    //       },
    //       standard: {
    //         url: 'https://i.ytimg.com/vi/yyDvq4vMinA/sddefault.jpg',
    //         width: 640,
    //         height: 480,
    //       },
    //       maxres: {
    //         url: 'https://i.ytimg.com/vi/yyDvq4vMinA/maxresdefault.jpg',
    //         width: 1280,
    //         height: 720,
    //       },
    //     },
    //     channelTitle: 'Wrestling Fans Network',
    //     tags: [
    //       'roman reigns',
    //       'roman reigns bloodline',
    //       'sami zayn bloodline',
    //       'sami zayn',
    //       'kevin owens',
    //       'judgement day',
    //       'judgement day breakup',
    //       'rhea ripley',
    //       'wwe raw',
    //       'gunther',
    //       'wwe updates',
    //       'wwe latest updates',
    //       'wwe updates today',
    //       'wwe news',
    //       'wwe news today',
    //       'wwe',
    //       'wrestling fans network',
    //       'wwe fans network',
    //       'ankit',
    //     ],
    //     categoryId: '17',
    //     liveBroadcastContent: 'none',
    //     localized: {
    //       title:
    //         "SHOCKING MEMBER In Roman Reigns' BLOODLINE 😱! UNEXPECTED | Judgement Day BREAK-UP, Kevin Owens | WWE",
    //       description:
    //         "SHOCKING MEMBER In Roman Reigns' BLOODLINE 😱! UNEXPECTED | Judgement Day BREAK-UP, Kevin Owens | WWE\n\n#romanreigns #bloodline #kevinowens #wweraw #wwe #wrestlingfansnetwork \n\nTIMESTAMPS:\n\n00:00 Monday Night Raw Preview \n\n01:59 Kevin Owens on if he will leave WWE\n\n04:06 Gunther winning the world championship soon\n\n06:19 Judgement Day break-up is imminent\n\n06:57 Shocking member to join Roman Reigns' BLOODLINE?\n____________________________________________\n\n🔥Social Links :-\n\nChat With Me On Instagram:- https://www.instagram.com/ankit_wfn/\n\nFollow On Twitter:- https://twitter.com/ankit_wfn/\n\nWhatsapp channel - https://wa.openinapp.co/r1z7b  \n\nImage Credits- https://www.wwe.com",
    //     },
    //     defaultAudioLanguage: 'hi',
    //   },
    //   contentDetails: {
    //     duration: 'PT9M15S',
    //     dimension: '2d',
    //     definition: 'hd',
    //     caption: 'false',
    //     licensedContent: true,
    //     contentRating: {},
    //     projection: 'rectangular',
    //   },
    //   statistics: {
    //     viewCount: '5350',
    //     likeCount: '739',
    //     favoriteCount: '0',
    //     commentCount: '78',
    //   },
    // };

    // this.channelDetails = {
    //   kind: 'youtube#channel',
    //   id: 'UCc3D8R6m-0jH-y9DM6Zw3rg',
    //   snippet: {
    //     title: 'Wrestling Fans Network',
    //     description:
    //       'For Businesses enquiries, Sponsorship and Paid collaboration.\nContact - rajpootankitsingh333@gmail.com\n\nWWE Fans Network Brings To You Non-Stop \'FASTEST\' Wrestling Updates, News, Rumors And Predictions. Channel Created By Ankit Singh. \n"Subscribe To WWE Fans Network" To Get Latest Insights About "Pro Wrestling "\n\nAbout Me:-\nName - Ankit Singh.\nLocality - Bharat\nLanguages Used In Videos- "Hindi"',
    //     customUrl: '@wwefansnetwork',
    //     publishedAt: '2019-06-06T16:54:45Z',
    //     thumbnails: {
    //       default: {
    //         url: 'https://yt3.ggpht.com/cRclQVmdG1CL8B9ti55A4Z1284K0LFDHD63lPTxtrk9yX84dVLqbMp1kSF9HnPJTvYrmjRqq=s88-c-k-c0x00ffffff-no-rj',
    //         width: 88,
    //         height: 88,
    //       },
    //       medium: {
    //         url: 'https://yt3.ggpht.com/cRclQVmdG1CL8B9ti55A4Z1284K0LFDHD63lPTxtrk9yX84dVLqbMp1kSF9HnPJTvYrmjRqq=s240-c-k-c0x00ffffff-no-rj',
    //         width: 240,
    //         height: 240,
    //       },
    //       high: {
    //         url: 'https://yt3.ggpht.com/cRclQVmdG1CL8B9ti55A4Z1284K0LFDHD63lPTxtrk9yX84dVLqbMp1kSF9HnPJTvYrmjRqq=s800-c-k-c0x00ffffff-no-rj',
    //         width: 800,
    //         height: 800,
    //       },
    //     },
    //     localized: {
    //       title: 'Wrestling Fans Network',
    //       description:
    //         'For Businesses enquiries, Sponsorship and Paid collaboration.\nContact - rajpootankitsingh333@gmail.com\n\nWWE Fans Network Brings To You Non-Stop \'FASTEST\' Wrestling Updates, News, Rumors And Predictions. Channel Created By Ankit Singh. \n"Subscribe To WWE Fans Network" To Get Latest Insights About "Pro Wrestling "\n\nAbout Me:-\nName - Ankit Singh.\nLocality - Bharat\nLanguages Used In Videos- "Hindi"',
    //     },
    //     country: 'IN',
    //   },
    //   contentDetails: {
    //     relatedPlaylists: {
    //       likes: '',
    //       uploads: 'UUc3D8R6m-0jH-y9DM6Zw3rg',
    //     },
    //   },
    //   statistics: {
    //     viewCount: '15302223',
    //     subscriberCount: '74300',
    //     hiddenSubscriberCount: false,
    //     videoCount: '2359',
    //   },
    //   brandingSettings: {
    //     channel: {
    //       title: 'Wrestling Fans Network',
    //       description:
    //         'For Businesses enquiries, Sponsorship and Paid collaboration.\nContact - rajpootankitsingh333@gmail.com\n\nWWE Fans Network Brings To You Non-Stop \'FASTEST\' Wrestling Updates, News, Rumors And Predictions. Channel Created By Ankit Singh. \n"Subscribe To WWE Fans Network" To Get Latest Insights About "Pro Wrestling "\n\nAbout Me:-\nName - Ankit Singh.\nLocality - Bharat\nLanguages Used In Videos- "Hindi"',
    //       keywords:
    //         '"wwe fans network" "wwe raw" "wwe smackdown" "roman reigns" "brock lesnar" "seth rollins" "randy orton" "becky lynch" "roman reigns and paul heyman" "drew mcintyre" wwe "wwe updates" "wwe updates in hindi" "wwe updates today" "wwe updates in hindi today" "wwe news in hindi" "wwe news in hindi today" "wwe fastest updates" "wwe latest updates" "wwe news" "wwe news today" "wwe news in hindi" "wwe hindi news" "wrestling fans network" "wrestle fans network"',
    //       unsubscribedTrailer: 'k4tk_72W-Fc',
    //       country: 'IN',
    //     },
    //     image: {
    //       bannerExternalUrl:
    //         'https://yt3.googleusercontent.com/9ovdfB7tdomFGuZJsx5pYaBwYE7SzUv12s_LHKKXeFQOzdgFWLH2Vh_0QBWMUVLzOLouw2OFxw',
    //     },
    //   },
    // };
  }

  getVideoUrl(videoId: string): SafeResourceUrl {
    const videoUrl = `https://www.youtube.com/embed/${videoId}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(videoUrl);
  }

  ngOnInit(): void {
    this.loadingSub = this.uiStateService.loading$.subscribe((value) => {
      this.isLoading = value;
      // this.searchByCategory(value)
    });

    this.fetchVideoDetails(this.videoId);
    this.fetchChannelDetails(this.channelId)
    this.fetchRelatedVideos(this.videoId)
    this.fetchVideoComments(this.videoId)
   
  }

  fetchVideoDetails(videoId: any): void {
    this.uiStateService.setLoadingState(true)
    this.youtubeApiService.getVideoDetails(videoId).subscribe(
      (response) => {
        console.log(response);
        this.videoDetail = response.items[0]
        this.uiStateService.setLoadingState(false)

      },
      (error) => {
        console.error(error);
      }
    );
  }
  
  fetchRelatedVideos(videoId: any): void {
    this.uiStateService.setLoadingState(true)
    this.youtubeApiService.getRelatedVideos(videoId).subscribe(
      (response) => {
        console.log('related' ,response);
        this.relatedVideos = response.items
        this.uiStateService.setLoadingState(false)
      },
      (error) => {
        console.error(error);
      }
    );
  }

  fetchChannelDetails(channelId: any): void {
  
    this.youtubeApiService.getChannelDetails(channelId).subscribe(
      (response) => {
        console.log('channel' ,response);
        this.channelDetails = response.items[0]
       

      },
      (error) => {
        console.error(error);
      }
    );
  }
  nextPageToken: string | undefined;

  fetchVideoComments(videoId: any): void {
    
    this.youtubeApiService.getVideoComments(videoId).subscribe(
      (response) => {
        console.log(response);
        this.videoComments = response.items
      

      },
      (error) => {
        console.error(error);
      }
    );
  }

showMore(): void {
    this.displayCount += 10; // Increment displayCount by 10
  }

  navigateToVideo(videoId: string,channelId:string): void {
    this.router.navigate(['/video', videoId,channelId]);
  }

    commentssss = [ {
      kind: 'youtube#commentThread',
      id: 'UgxooWopqjWUHoQfqqp4AaABAg',
      snippet: {
        channelId: 'UCN1hnUccO4FD5WfM7ithXaw',
        videoId: '7ghhRHRP6t4',
        topLevelComment: {
          kind: 'youtube#comment',
          id: 'UgxooWopqjWUHoQfqqp4AaABAg',
          snippet: {
            channelId: 'UCN1hnUccO4FD5WfM7ithXaw',
            videoId: '7ghhRHRP6t4',
            textDisplay:
              'It&#39;s it <a href="https://www.youtube.com/watch?v=7ghhRHRP6t4&amp;t=260">4:20</a> yet ❤',
            textOriginal: "It's it 4:20 yet ❤",
            authorDisplayName: '@marilyngreenlee64',
            authorProfileImageUrl:
              'https://yt3.ggpht.com/ytc/AIdro_mJD7enPdHDDp55gmUnuenSuC-CIRegYRhjuoWS5WI=s48-c-k-c0x00ffffff-no-rj',
            authorChannelUrl: 'http://www.youtube.com/@marilyngreenlee64',
            authorChannelId: {
              value: 'UC_Meu0gAttRDRDTlQ5fZGCg',
            },
            canRate: true,
            viewerRating: 'none',
            likeCount: 0,
            publishedAt: '2024-05-04T01:41:35Z',
            updatedAt: '2024-05-04T01:41:35Z',
          },
        },
        canReply: true,
        totalReplyCount: 0,
        isPublic: true,
      },
    },
      {
        kind: 'youtube#commentThread',
        id: 'Ugzae0Zf0eWXFxBz4414AaABAg',
        snippet: {
          channelId: 'UCN1hnUccO4FD5WfM7ithXaw',
          videoId: '7ghhRHRP6t4',
          topLevelComment: {
            kind: 'youtube#comment',
            id: 'Ugzae0Zf0eWXFxBz4414AaABAg',
            snippet: {
              channelId: 'UCN1hnUccO4FD5WfM7ithXaw',
              videoId: '7ghhRHRP6t4',
              textDisplay: 'I sense some SZA',
              textOriginal: 'I sense some SZA',
              authorDisplayName: '@LavettaKendall',
              authorProfileImageUrl:
                'https://yt3.ggpht.com/ytc/AIdro_nbpIyw9RERWWeYVcxAB1eIBIpGS09nJ0NDBVgNNe0nbEppDM0SbBGcKOhumeWeRWLvPA=s48-c-k-c0x00ffffff-no-rj',
              authorChannelUrl: 'http://www.youtube.com/@LavettaKendall',
              authorChannelId: {
                value: 'UCaryXMcX8X0POWAPLm-NuYg',
              },
              canRate: true,
              viewerRating: 'none',
              likeCount: 0,
              publishedAt: '2024-04-29T16:26:47Z',
              updatedAt: '2024-04-29T16:26:47Z',
            },
          },
          canReply: true,
          totalReplyCount: 0,
          isPublic: true,
        },
      },
      {
        kind: 'youtube#commentThread',
        id: 'Ugzj3Yz3Ux3TU4iA0ll4AaABAg',
        snippet: {
          channelId: 'UCN1hnUccO4FD5WfM7ithXaw',
          videoId: '7ghhRHRP6t4',
          topLevelComment: {
            kind: 'youtube#comment',
            id: 'Ugzj3Yz3Ux3TU4iA0ll4AaABAg',
            snippet: {
              channelId: 'UCN1hnUccO4FD5WfM7ithXaw',
              videoId: '7ghhRHRP6t4',
              textDisplay: 'Deep.....',
              textOriginal: 'Deep.....',
              authorDisplayName: '@LavettaKendall',
              authorProfileImageUrl:
                'https://yt3.ggpht.com/ytc/AIdro_nbpIyw9RERWWeYVcxAB1eIBIpGS09nJ0NDBVgNNe0nbEppDM0SbBGcKOhumeWeRWLvPA=s48-c-k-c0x00ffffff-no-rj',
              authorChannelUrl: 'http://www.youtube.com/@LavettaKendall',
              authorChannelId: {
                value: 'UCaryXMcX8X0POWAPLm-NuYg',
              },
              canRate: true,
              viewerRating: 'none',
              likeCount: 0,
              publishedAt: '2024-04-29T16:26:35Z',
              updatedAt: '2024-04-29T16:26:35Z',
            },
          },
          canReply: true,
          totalReplyCount: 0,
          isPublic: true,
        },
      },
      {
        kind: 'youtube#commentThread',
        id: 'UgzjMFzhTiBcSyg9Y4R4AaABAg',
        snippet: {
          channelId: 'UCN1hnUccO4FD5WfM7ithXaw',
          videoId: '7ghhRHRP6t4',
          topLevelComment: {
            kind: 'youtube#comment',
            id: 'UgzjMFzhTiBcSyg9Y4R4AaABAg',
            snippet: {
              channelId: 'UCN1hnUccO4FD5WfM7ithXaw',
              videoId: '7ghhRHRP6t4',
              textDisplay: 'For Chad',
              textOriginal: 'For Chad',
              authorDisplayName: '@MattyLbc',
              authorProfileImageUrl:
                'https://yt3.ggpht.com/vMdtrX-a-8PG7EDf54q5c9aX-R9CxdgXQZ0lUxwX8sPpanDPdoPIB38YY8VnqKytL4S6yppQ=s48-c-k-c0x00ffffff-no-rj',
              authorChannelUrl: 'http://www.youtube.com/@MattyLbc',
              authorChannelId: {
                value: 'UCgp9sNHo1n4PrUtmuOl2G-A',
              },
              canRate: true,
              viewerRating: 'none',
              likeCount: 0,
              publishedAt: '2024-04-29T02:51:41Z',
              updatedAt: '2024-04-29T02:51:41Z',
            },
          },
          canReply: true,
          totalReplyCount: 0,
          isPublic: true,
        },
      },
      {
        kind: 'youtube#commentThread',
        id: 'UgxxeoYnHrbwn53lMYx4AaABAg',
        snippet: {
          channelId: 'UCN1hnUccO4FD5WfM7ithXaw',
          videoId: '7ghhRHRP6t4',
          topLevelComment: {
            kind: 'youtube#comment',
            id: 'UgxxeoYnHrbwn53lMYx4AaABAg',
            snippet: {
              channelId: 'UCN1hnUccO4FD5WfM7ithXaw',
              videoId: '7ghhRHRP6t4',
              textDisplay:
                'WHEN I MEAN YOU CRAZY🔥🔥🔥🔥🔥🔥🔥YOU SLIIIIIIDE🔥🔥🔥🔥',
              textOriginal:
                'WHEN I MEAN YOU CRAZY🔥🔥🔥🔥🔥🔥🔥YOU SLIIIIIIDE🔥🔥🔥🔥',
              authorDisplayName: '@BROWNNSKINNBHAD',
              authorProfileImageUrl:
                'https://yt3.ggpht.com/d7j55nCiHO2jOhg6BK-UBP6fypi3UVoRnbos9Bxmj6N5ChRW5pG_kb6b0k2nag2SvNZz_zN6fA=s48-c-k-c0x00ffffff-no-rj',
              authorChannelUrl: 'http://www.youtube.com/@BROWNNSKINNBHAD',
              authorChannelId: {
                value: 'UC0A_Xq1jTg6BaYn25kZyfEg',
              },
              canRate: true,
              viewerRating: 'none',
              likeCount: 0,
              publishedAt: '2024-04-25T06:51:42Z',
              updatedAt: '2024-04-25T06:51:42Z',
            },
          },
          canReply: true,
          totalReplyCount: 0,
          isPublic: true,
        },
      },
      {
        kind: 'youtube#commentThread',
        id: 'Ugy3fSBJSHkxRs24Cq54AaABAg',
        snippet: {
          channelId: 'UCN1hnUccO4FD5WfM7ithXaw',
          videoId: '7ghhRHRP6t4',
          topLevelComment: {
            kind: 'youtube#comment',
            id: 'Ugy3fSBJSHkxRs24Cq54AaABAg',
            snippet: {
              channelId: 'UCN1hnUccO4FD5WfM7ithXaw',
              videoId: '7ghhRHRP6t4',
              textDisplay: 'who in April 2024?',
              textOriginal: 'who in April 2024?',
              authorDisplayName: '@Amiello30',
              authorProfileImageUrl:
                'https://yt3.ggpht.com/DSaOJoSXszMS5EwaNX2T_o-F_fABCcja-GmQcJWorSxTFegAaQKFcm5w8CJ5A-GH67y4heYS=s48-c-k-c0x00ffffff-no-rj',
              authorChannelUrl: 'http://www.youtube.com/@Amiello30',
              authorChannelId: {
                value: 'UCRQ2zGl3AWSCWr6RKda6R9w',
              },
              canRate: true,
              viewerRating: 'none',
              likeCount: 7,
              publishedAt: '2024-04-24T17:57:14Z',
              updatedAt: '2024-04-24T17:57:14Z',
            },
          },
          canReply: true,
          totalReplyCount: 1,
          isPublic: true,
        },
      },
      {
        kind: 'youtube#commentThread',
        id: 'UgwSMYqFWZRsDL4698p4AaABAg',
        snippet: {
          channelId: 'UCN1hnUccO4FD5WfM7ithXaw',
          videoId: '7ghhRHRP6t4',
          topLevelComment: {
            kind: 'youtube#comment',
            id: 'UgwSMYqFWZRsDL4698p4AaABAg',
            snippet: {
              channelId: 'UCN1hnUccO4FD5WfM7ithXaw',
              videoId: '7ghhRHRP6t4',
              textDisplay:
                'I think Adam’s shaved head is ridiculous. But their music will always be great.',
              textOriginal:
                'I think Adam’s shaved head is ridiculous. But their music will always be great.',
              authorDisplayName: '@denisecraig3548',
              authorProfileImageUrl:
                'https://yt3.ggpht.com/ytc/AIdro_k8pUHq73H_glmFfaiJ2Ee_2gT6R4sdOerWRqY9DyY=s48-c-k-c0x00ffffff-no-rj',
              authorChannelUrl: 'http://www.youtube.com/@denisecraig3548',
              authorChannelId: {
                value: 'UC2jgtBnJM7z4KyoqY6sIEIA',
              },
              canRate: true,
              viewerRating: 'none',
              likeCount: 0,
              publishedAt: '2024-04-22T20:44:14Z',
              updatedAt: '2024-04-22T20:44:14Z',
            },
          },
          canReply: true,
          totalReplyCount: 0,
          isPublic: true,
        },
      },
      {
        kind: 'youtube#commentThread',
        id: 'UgyrK46F6pWmOAsLNeF4AaABAg',
        snippet: {
          channelId: 'UCN1hnUccO4FD5WfM7ithXaw',
          videoId: '7ghhRHRP6t4',
          topLevelComment: {
            kind: 'youtube#comment',
            id: 'UgyrK46F6pWmOAsLNeF4AaABAg',
            snippet: {
              channelId: 'UCN1hnUccO4FD5WfM7ithXaw',
              videoId: '7ghhRHRP6t4',
              textDisplay: '2024',
              textOriginal: '2024',
              authorDisplayName: '@3duard0alves58',
              authorProfileImageUrl:
                'https://yt3.ggpht.com/IcMR05nCM2e2BsyLNQtKf8pTW_A0v51pMSbrEWwZZopZwZarwXn-6dVkPeGw7XECZsEY1WqX=s48-c-k-c0x00ffffff-no-rj',
              authorChannelUrl: 'http://www.youtube.com/@3duard0alves58',
              authorChannelId: {
                value: 'UCM0PouprQZfKYSVL66vfMYQ',
              },
              canRate: true,
              viewerRating: 'none',
              likeCount: 0,
              publishedAt: '2024-04-22T17:06:52Z',
              updatedAt: '2024-04-22T17:06:52Z',
            },
          },
          canReply: true,
          totalReplyCount: 0,
          isPublic: true,
        },
      },
      {
        kind: 'youtube#commentThread',
        id: 'UgzblKhwZYu7BHKGT5p4AaABAg',
        snippet: {
          channelId: 'UCN1hnUccO4FD5WfM7ithXaw',
          videoId: '7ghhRHRP6t4',
          topLevelComment: {
            kind: 'youtube#comment',
            id: 'UgzblKhwZYu7BHKGT5p4AaABAg',
            snippet: {
              channelId: 'UCN1hnUccO4FD5WfM7ithXaw',
              videoId: '7ghhRHRP6t4',
              textDisplay: 'เท่ห์สุดๆ',
              textOriginal: 'เท่ห์สุดๆ',
              authorDisplayName: '@user-cr9zq9eb1l',
              authorProfileImageUrl:
                'https://yt3.ggpht.com/ytc/AIdro_l-sTb0TDAUjJSzXF0YMIxm-GPOSJ-JBJhTfq0RFjZ6wBnYWdvZDSMmBi5u9Ay9p1Dp1Q=s48-c-k-c0x00ffffff-no-rj',
              authorChannelUrl: 'http://www.youtube.com/@user-cr9zq9eb1l',
              authorChannelId: {
                value: 'UCEQNXmJ-JNt_jszw1KyL0MQ',
              },
              canRate: true,
              viewerRating: 'none',
              likeCount: 0,
              publishedAt: '2024-04-20T04:57:48Z',
              updatedAt: '2024-04-20T04:57:48Z',
            },
          },
          canReply: true,
          totalReplyCount: 0,
          isPublic: true,
        },
      },
      {
        kind: 'youtube#commentThread',
        id: 'UgxuPCBoODsXYTIGTEB4AaABAg',
        snippet: {
          channelId: 'UCN1hnUccO4FD5WfM7ithXaw',
          videoId: '7ghhRHRP6t4',
          topLevelComment: {
            kind: 'youtube#comment',
            id: 'UgxuPCBoODsXYTIGTEB4AaABAg',
            snippet: {
              channelId: 'UCN1hnUccO4FD5WfM7ithXaw',
              videoId: '7ghhRHRP6t4',
              textDisplay: '❤❤❤',
              textOriginal: '❤❤❤',
              authorDisplayName: '@user-dx7ui2el7m',
              authorProfileImageUrl:
                'https://yt3.ggpht.com/ytc/AIdro_nSNiYSvPvCCpOaA3XQDR5Z1JbETTCUrC0epju2BYRcUAhWBpYB6ETxcv4epfmtCNjofw=s48-c-k-c0x00ffffff-no-rj',
              authorChannelUrl: 'http://www.youtube.com/@user-dx7ui2el7m',
              authorChannelId: {
                value: 'UCoPtLkjIj4Vcifw82ka-VCw',
              },
              canRate: true,
              viewerRating: 'none',
              likeCount: 0,
              publishedAt: '2024-04-19T20:08:41Z',
              updatedAt: '2024-04-19T20:08:41Z',
            },
          },
          canReply: true,
          totalReplyCount: 0,
          isPublic: true,
        },
      }
  
]
}
/*  fetchVideoDetailsAndRelatedVideos(videoId: string,channelId:string): void {
    forkJoin([
      this.youtubeApiService.getVideoDetails(videoId),
      this.youtubeApiService.getRelatedVideos(videoId),
      this.youtubeApiService.getChannelDetails(channelId),
      this.youtubeApiService.getVideoComments(videoId),
    ])
      .pipe(
        mergeMap(([videoDetails, relatedVideos , channelDetails, comments]) => {
          // Process video details, related videos, comments, and channel details here
          console.log('Video Details:', videoDetails);
          console.log('Related Videos:', relatedVideos);
          console.log('Channel Details:', channelDetails);
          console.log('Comments:', comments);
          return [videoDetails, relatedVideos, channelDetails, comments];
        })
      )
      .subscribe(
        ([videoDetails, relatedVideos, channelDetails, comments]) => {
          // Handle successful response
          // Assign data to component properties or perform other actions
          this.videoDetail = videoDetails.items[0];
          this.relatedVideos = relatedVideos.items;
          this.channelDetails = channelDetails.items[0];
          this.videoComments = comments;
          console.log( this.videoDetail )
          console.log( this.relatedVideos )
          console.log( this.channelDetails )
          console.log( this.videoComments )
        },
        (error) => {
          // Handle error
        }
      );
  }*/

/*

  RelatedVideos = [
    {
      kind: 'youtube#searchResult',
      id: {
        kind: 'youtube#video',
        videoId: 'ONVmRIc3kTQ',
      },
      snippet: {
        publishedAt: '2024-05-07T00:00:00Z',
        channelId: 'UCc3D8R6m-0jH-y9DM6Zw3rg',
        title:
          '😱 WrestleMania 41 MAIN EVENT LOCKED! Roman Reigns Vs The Rock | Demon Balor Bad News, Raw| WWE News',
        description: '',
        thumbnails: {
          default: {
            url: 'https://i.ytimg.com/vi/ONVmRIc3kTQ/default.jpg',
            width: 120,
            height: 90,
          },
          medium: {
            url: 'https://i.ytimg.com/vi/ONVmRIc3kTQ/mqdefault.jpg',
            width: 320,
            height: 180,
          },
          high: {
            url: 'https://i.ytimg.com/vi/ONVmRIc3kTQ/hqdefault.jpg',
            width: 480,
            height: 360,
          },
        },
        channelTitle: 'Wrestling Fans Network',
        liveBroadcastContent: 'none',
        publishTime: '2024-05-07T00:00:00Z',
      },
    },
    {
      kind: 'youtube#searchResult',
      id: {
        kind: 'youtube#video',
        videoId: '4s2NvAQlzq4',
      },
      snippet: {
        publishedAt: '2024-05-06T00:00:00Z',
        channelId: 'UC1-BQ2oxqBVtCjMHF-Wf98w',
        title:
          'The Great Indian Kapil Show - Dazzling Deol Brothers | Bacha Hua Content | Sunny Deol, Bobby Deol',
        description: '',
        thumbnails: {
          default: {
            url: 'https://i.ytimg.com/vi/4s2NvAQlzq4/default.jpg',
            width: 120,
            height: 90,
          },
          medium: {
            url: 'https://i.ytimg.com/vi/4s2NvAQlzq4/mqdefault.jpg',
            width: 320,
            height: 180,
          },
          high: {
            url: 'https://i.ytimg.com/vi/4s2NvAQlzq4/hqdefault.jpg',
            width: 480,
            height: 360,
          },
        },
        channelTitle: 'Kapil Sharma',
        liveBroadcastContent: 'none',
        publishTime: '2024-05-06T00:00:00Z',
      },
    },
    {
      kind: 'youtube#searchResult',
      id: {
        kind: 'youtube#video',
        videoId: 'Pi3wu2IOAAY',
      },
      snippet: {
        publishedAt: '2024-05-06T00:00:00Z',
        channelId: 'UCc3D8R6m-0jH-y9DM6Zw3rg',
        title:
          '😳 WrestleMania LONDON CONFIRMED! BIGGEST MANIA? GODDESS Alexa Bliss RETURN | Orton & Cody | WWE News',
        description: '',
        thumbnails: {
          default: {
            url: 'https://i.ytimg.com/vi/Pi3wu2IOAAY/default.jpg',
            width: 120,
            height: 90,
          },
          medium: {
            url: 'https://i.ytimg.com/vi/Pi3wu2IOAAY/mqdefault.jpg',
            width: 320,
            height: 180,
          },
          high: {
            url: 'https://i.ytimg.com/vi/Pi3wu2IOAAY/hqdefault.jpg',
            width: 480,
            height: 360,
          },
        },
        channelTitle: 'Wrestling Fans Network',
        liveBroadcastContent: 'none',
        publishTime: '2024-05-06T00:00:00Z',
      },
    },
    {
      kind: 'youtube#searchResult',
      id: {
        kind: 'youtube#video',
        videoId: 'TRiSQdR0oYA',
      },
      snippet: {
        publishedAt: '2024-05-05T00:00:00Z',
        channelId: 'UChovM9SXuNiCozh4xbKiUpg',
        title:
          'The Philosophy of Hinduism - Bhagavad Gita & Vedanta - Sri Ramakrishna - What is Hinduism (Part 2)',
        description: '',
        thumbnails: {
          default: {
            url: 'https://i.ytimg.com/vi/TRiSQdR0oYA/default.jpg',
            width: 120,
            height: 90,
          },
          medium: {
            url: 'https://i.ytimg.com/vi/TRiSQdR0oYA/mqdefault.jpg',
            width: 320,
            height: 180,
          },
          high: {
            url: 'https://i.ytimg.com/vi/TRiSQdR0oYA/hqdefault.jpg',
            width: 480,
            height: 360,
          },
        },
        channelTitle: 'Book Buddy',
        liveBroadcastContent: 'none',
        publishTime: '2024-05-05T00:00:00Z',
      },
    },
    {
      kind: 'youtube#searchResult',
      id: {
        kind: 'youtube#video',
        videoId: 'TtRWB58DN5A',
      },
      snippet: {
        publishedAt: '2024-03-07T00:00:00Z',
        channelId: 'UCup3Ps1k47sZztmP0m95hPg',
        title:
          'WrestleMania 40 1 & 2 Night Date And Time in India 🇮🇳 | Full Detailes 🔥 || #wwe #wrestlemania',
        description: '',
        thumbnails: {
          default: {
            url: 'https://i.ytimg.com/vi/TtRWB58DN5A/default.jpg',
            width: 120,
            height: 90,
          },
          medium: {
            url: 'https://i.ytimg.com/vi/TtRWB58DN5A/mqdefault.jpg',
            width: 320,
            height: 180,
          },
          high: {
            url: 'https://i.ytimg.com/vi/TtRWB58DN5A/hqdefault.jpg',
            width: 480,
            height: 360,
          },
        },
        channelTitle: 'Wrestle Story',
        liveBroadcastContent: 'none',
        publishTime: '2024-03-07T00:00:00Z',
      },
    },
    {
      kind: 'youtube#searchResult',
      id: {
        kind: 'youtube#video',
        videoId: '3B6w_QHzWck',
      },
      snippet: {
        publishedAt: '2024-05-06T00:00:00Z',
        channelId: 'UCc3D8R6m-0jH-y9DM6Zw3rg',
        title:
          "BIG PROBLEM For BLOODLINE'S 'TANGA LOA' 😰! | HUGE BOTCH At Backlash 2024, Finn Balor Vs Priest | WWE",
        description: '',
        thumbnails: {
          default: {
            url: 'https://i.ytimg.com/vi/3B6w_QHzWck/default.jpg',
            width: 120,
            height: 90,
          },
          medium: {
            url: 'https://i.ytimg.com/vi/3B6w_QHzWck/mqdefault.jpg',
            width: 320,
            height: 180,
          },
          high: {
            url: 'https://i.ytimg.com/vi/3B6w_QHzWck/hqdefault.jpg',
            width: 480,
            height: 360,
          },
        },
        channelTitle: 'Wrestling Fans Network',
        liveBroadcastContent: 'none',
        publishTime: '2024-05-06T00:00:00Z',
      },
    },
    {
      kind: 'youtube#searchResult',
      id: {
        kind: 'youtube#video',
        videoId: 'nO88tGswinY',
      },
      snippet: {
        publishedAt: '2024-05-06T00:00:00Z',
        channelId: 'UCc3D8R6m-0jH-y9DM6Zw3rg',
        title:
          "Paul Heyman's MASTERPLAN To STOP Solo Sikoa! LEAKED | Uncle Howdy FACTION SPOILER, Cody NEXT MATCH",
        description: '',
        thumbnails: {
          default: {
            url: 'https://i.ytimg.com/vi/nO88tGswinY/default.jpg',
            width: 120,
            height: 90,
          },
          medium: {
            url: 'https://i.ytimg.com/vi/nO88tGswinY/mqdefault.jpg',
            width: 320,
            height: 180,
          },
          high: {
            url: 'https://i.ytimg.com/vi/nO88tGswinY/hqdefault.jpg',
            width: 480,
            height: 360,
          },
        },
        channelTitle: 'Wrestling Fans Network',
        liveBroadcastContent: 'none',
        publishTime: '2024-05-06T00:00:00Z',
      },
    },
    {
      kind: 'youtube#searchResult',
      id: {
        kind: 'youtube#video',
        videoId: '5l3ekSo8yTo',
      },
      snippet: {
        publishedAt: '2024-05-06T00:00:00Z',
        channelId: 'UCc3D8R6m-0jH-y9DM6Zw3rg',
        title:
          "'ROMAN Reigns Ki WAAPSI' BIG RETURN UPDATE ! Jacob Fatu WWE DEBUT DATE | Cody Vs Gunther? WWE News",
        description: '',
        thumbnails: {
          default: {
            url: 'https://i.ytimg.com/vi/5l3ekSo8yTo/default.jpg',
            width: 120,
            height: 90,
          },
          medium: {
            url: 'https://i.ytimg.com/vi/5l3ekSo8yTo/mqdefault.jpg',
            width: 320,
            height: 180,
          },
          high: {
            url: 'https://i.ytimg.com/vi/5l3ekSo8yTo/hqdefault.jpg',
            width: 480,
            height: 360,
          },
        },
        channelTitle: 'Wrestling Fans Network',
        liveBroadcastContent: 'none',
        publishTime: '2024-05-06T00:00:00Z',
      },
    },
    {
      kind: 'youtube#searchResult',
      id: {
        kind: 'youtube#video',
        videoId: 'a4pEN23bylQ',
      },
      snippet: {
        publishedAt: '2024-05-05T00:00:00Z',
        channelId: 'UCc3D8R6m-0jH-y9DM6Zw3rg',
        title:
          'Another NEW BLOODLINE MEMBER DEBUTING 😱! WTF | WrestleMania 41 ANNOUNCED| Seth Rollins New Look, WWE',
        description: '',
        thumbnails: {
          default: {
            url: 'https://i.ytimg.com/vi/a4pEN23bylQ/default.jpg',
            width: 120,
            height: 90,
          },
          medium: {
            url: 'https://i.ytimg.com/vi/a4pEN23bylQ/mqdefault.jpg',
            width: 320,
            height: 180,
          },
          high: {
            url: 'https://i.ytimg.com/vi/a4pEN23bylQ/hqdefault.jpg',
            width: 480,
            height: 360,
          },
        },
        channelTitle: 'Wrestling Fans Network',
        liveBroadcastContent: 'none',
        publishTime: '2024-05-05T00:00:00Z',
      },
    },
    {
      kind: 'youtube#searchResult',
      id: {
        kind: 'youtube#video',
        videoId: 'e-dXCAX_hoA',
      },
      snippet: {
        publishedAt: '2024-05-05T00:00:00Z',
        channelId: 'UCYalWwW79BdxmMTKUyBFj5g',
        title:
          'Virat Kohli और Star Sports पर जमकर Live भड़के Sunil Gavaskar | Kohli के Strikerate से जुड़ा है विवाद',
        description: '',
        thumbnails: {
          default: {
            url: 'https://i.ytimg.com/vi/e-dXCAX_hoA/default.jpg',
            width: 120,
            height: 90,
          },
          medium: {
            url: 'https://i.ytimg.com/vi/e-dXCAX_hoA/mqdefault.jpg',
            width: 320,
            height: 180,
          },
          high: {
            url: 'https://i.ytimg.com/vi/e-dXCAX_hoA/hqdefault.jpg',
            width: 480,
            height: 360,
          },
        },
        channelTitle: 'Shubhankar Mishra ',
        liveBroadcastContent: 'none',
        publishTime: '2024-05-05T00:00:00Z',
      },
    },
    {
      kind: 'youtube#searchResult',
      id: {
        kind: 'youtube#video',
        videoId: 'WD5p_GpFyI0',
      },
      snippet: {
        publishedAt: '2024-05-06T00:00:00Z',
        channelId: 'UCtvDbLquaT511bZ_qUESrkA',
        title:
          'SKY ने भेजा हैदराबाद को पाताल. मुंबई को घर पर मिली बड़ी जीत | MI vs SRH | Rj RAUNAK',
        description: '',
        thumbnails: {
          default: {
            url: 'https://i.ytimg.com/vi/WD5p_GpFyI0/default.jpg',
            width: 120,
            height: 90,
          },
          medium: {
            url: 'https://i.ytimg.com/vi/WD5p_GpFyI0/mqdefault.jpg',
            width: 320,
            height: 180,
          },
          high: {
            url: 'https://i.ytimg.com/vi/WD5p_GpFyI0/hqdefault.jpg',
            width: 480,
            height: 360,
          },
        },
        channelTitle: 'RJ Raunac No-Po',
        liveBroadcastContent: 'none',
        publishTime: '2024-05-06T00:00:00Z',
      },
    },
    {
      kind: 'youtube#searchResult',
      id: {
        kind: 'youtube#video',
        videoId: 'd54YDndJDrU',
      },
      snippet: {
        publishedAt: '2024-05-03T00:00:00Z',
        channelId: 'UCc3D8R6m-0jH-y9DM6Zw3rg',
        title:
          'ROCK Vs WWE 😨! BIG CONTROVERSY STARTED!? | WYATT 6 MEMBERS LEAKED? Backlash 2024 STAGE | WWE News',
        description: '',
        thumbnails: {
          default: {
            url: 'https://i.ytimg.com/vi/d54YDndJDrU/default.jpg',
            width: 120,
            height: 90,
          },
          medium: {
            url: 'https://i.ytimg.com/vi/d54YDndJDrU/mqdefault.jpg',
            width: 320,
            height: 180,
          },
          high: {
            url: 'https://i.ytimg.com/vi/d54YDndJDrU/hqdefault.jpg',
            width: 480,
            height: 360,
          },
        },
        channelTitle: 'Wrestling Fans Network',
        liveBroadcastContent: 'none',
        publishTime: '2024-05-03T00:00:00Z',
      },
    },
    {
      kind: 'youtube#searchResult',
      id: {
        kind: 'youtube#video',
        videoId: '9RM52tJ0wLo',
      },
      snippet: {
        publishedAt: '2024-05-06T00:00:00Z',
        channelId: 'UC4UtgDae_gg97w0eVEezeTw',
        title: 'MEN IN BLUE की नई JERSEY आ गई I | CRICO | Rj Raunak',
        description: '',
        thumbnails: {
          default: {
            url: 'https://i.ytimg.com/vi/9RM52tJ0wLo/default.jpg',
            width: 120,
            height: 90,
          },
          medium: {
            url: 'https://i.ytimg.com/vi/9RM52tJ0wLo/mqdefault.jpg',
            width: 320,
            height: 180,
          },
          high: {
            url: 'https://i.ytimg.com/vi/9RM52tJ0wLo/hqdefault.jpg',
            width: 480,
            height: 360,
          },
        },
        channelTitle: 'Crico - The Cricket Company',
        liveBroadcastContent: 'none',
        publishTime: '2024-05-06T00:00:00Z',
      },
    },
    {
      kind: 'youtube#searchResult',
      id: {
        kind: 'youtube#video',
        videoId: 'aBul_a6a1Zs',
      },
      snippet: {
        publishedAt: '2024-05-07T00:00:00Z',
        channelId: 'UCGOowbARQ8qAr1Vmh9z-4Iw',
        title:
          'Doraemon New Episode 07-05-2024 - Episode 08 - Doraemon Cartoon - Doraemon In Hindi - Doraemon Movie',
        description: '',
        thumbnails: {
          default: {
            url: 'https://i.ytimg.com/vi/aBul_a6a1Zs/default.jpg',
            width: 120,
            height: 90,
          },
          medium: {
            url: 'https://i.ytimg.com/vi/aBul_a6a1Zs/mqdefault.jpg',
            width: 320,
            height: 180,
          },
          high: {
            url: 'https://i.ytimg.com/vi/aBul_a6a1Zs/hqdefault.jpg',
            width: 480,
            height: 360,
          },
        },
        channelTitle: 'Wicked Temper',
        liveBroadcastContent: 'none',
        publishTime: '2024-05-07T00:00:00Z',
      },
    },
    {
      kind: 'youtube#searchResult',
      id: {
        kind: 'youtube#video',
        videoId: '13vzKbijSYk',
      },
      snippet: {
        publishedAt: '2022-05-07T00:00:00Z',
        channelId: 'UCi2Y_FYNcbAtn8Jqf_xBngg',
        title:
          '#wwe, #wwe world heavyweight championship Belt, #wwe Belt, #shorts',
        description: '',
        thumbnails: {
          default: {
            url: 'https://i.ytimg.com/vi/13vzKbijSYk/default.jpg',
            width: 120,
            height: 90,
          },
        },
        channelTitle: 'Rv World Shorts',
        liveBroadcastContent: 'none',
        publishTime: '2022-05-07T00:00:00Z',
      },
    },
    {
      kind: 'youtube#searchResult',
      id: {
        kind: 'youtube#video',
        videoId: 'pXhYNy9Igw0',
      },
      snippet: {
        publishedAt: '2024-05-04T00:00:00Z',
        channelId: 'UCr4Z40lNLlRQ5hZCorJvWrQ',
        title:
          'HARDIK PANDYA AND TILAK VARMA CONTROVERSY 😳😳 | STARC LAST OVER VS MI | MI VS KKR TOSS',
        description: '',
        thumbnails: {
          default: {
            url: 'https://i.ytimg.com/vi/pXhYNy9Igw0/default.jpg',
            width: 120,
            height: 90,
          },
          medium: {
            url: 'https://i.ytimg.com/vi/pXhYNy9Igw0/mqdefault.jpg',
            width: 320,
            height: 180,
          },
          high: {
            url: 'https://i.ytimg.com/vi/pXhYNy9Igw0/hqdefault.jpg',
            width: 480,
            height: 360,
          },
        },
        channelTitle: 'Tanay',
        liveBroadcastContent: 'none',
        publishTime: '2024-05-04T00:00:00Z',
      },
    },
    {
      kind: 'youtube#searchResult',
      id: {
        kind: 'youtube#video',
        videoId: 'afRN9ZSuBa4',
      },
      snippet: {
        publishedAt: '2024-05-06T00:00:00Z',
        channelId: 'UCtvDbLquaT511bZ_qUESrkA',
        title:
          'सुनील नारायण की एक और तबाही पारी से जीत गया कोलकाता. Points Table में टॉप पर पहुंचा | Rj RAUNAK',
        description: '',
        thumbnails: {
          default: {
            url: 'https://i.ytimg.com/vi/afRN9ZSuBa4/default.jpg',
            width: 120,
            height: 90,
          },
          medium: {
            url: 'https://i.ytimg.com/vi/afRN9ZSuBa4/mqdefault.jpg',
            width: 320,
            height: 180,
          },
          high: {
            url: 'https://i.ytimg.com/vi/afRN9ZSuBa4/hqdefault.jpg',
            width: 480,
            height: 360,
          },
        },
        channelTitle: 'RJ Raunac No-Po',
        liveBroadcastContent: 'none',
        publishTime: '2024-05-06T00:00:00Z',
      },
    },
    {
      kind: 'youtube#searchResult',
      id: {
        kind: 'youtube#video',
        videoId: 'kjT6KcX25Yo',
      },
      snippet: {
        publishedAt: '2024-05-02T00:00:00Z',
        channelId: 'UCc3D8R6m-0jH-y9DM6Zw3rg',
        title:
          'BIG TRADES After DRAFT 2024 🤯! RAW - SMACKDOWN | Ronda Rousey CONTROVERSY, WrestleMania 41| WWE News',
        description: '',
        thumbnails: {
          default: {
            url: 'https://i.ytimg.com/vi/kjT6KcX25Yo/default.jpg',
            width: 120,
            height: 90,
          },
          medium: {
            url: 'https://i.ytimg.com/vi/kjT6KcX25Yo/mqdefault.jpg',
            width: 320,
            height: 180,
          },
          high: {
            url: 'https://i.ytimg.com/vi/kjT6KcX25Yo/hqdefault.jpg',
            width: 480,
            height: 360,
          },
        },
        channelTitle: 'Wrestling Fans Network',
        liveBroadcastContent: 'none',
        publishTime: '2024-05-02T00:00:00Z',
      },
    },
    {
      kind: 'youtube#searchResult',
      id: {
        kind: 'youtube#video',
        videoId: 'JK1b6W-_N5A',
      },
      snippet: {
        publishedAt: '2024-05-07T00:00:00Z',
        channelId: 'UC9NWjXbt97jHJ1O-jtzBipg',
        title:
          'SURYA ki CENTURY ne SILENCE kardia 😍 | Rohit Sharma sad 😕 | MI vs SRH',
        description: '',
        thumbnails: {
          default: {
            url: 'https://i.ytimg.com/vi/JK1b6W-_N5A/default.jpg',
            width: 120,
            height: 90,
          },
          medium: {
            url: 'https://i.ytimg.com/vi/JK1b6W-_N5A/mqdefault.jpg',
            width: 320,
            height: 180,
          },
          high: {
            url: 'https://i.ytimg.com/vi/JK1b6W-_N5A/hqdefault.jpg',
            width: 480,
            height: 360,
          },
        },
        channelTitle: 'Pahul Walia',
        liveBroadcastContent: 'none',
        publishTime: '2024-05-07T00:00:00Z',
      },
    },
    {
      kind: 'youtube#searchResult',
      id: {
        kind: 'youtube#video',
        videoId: 'QqQiy6yGLWo',
      },
      snippet: {
        publishedAt: '2024-05-05T00:00:00Z',
        channelId: 'UCc3D8R6m-0jH-y9DM6Zw3rg',
        title:
          '😱OMG! New BLOODLINE Member TANGA LOA DEBUTS At Backlash 2024| Tanga Loa WWE Debut, WWE Backlash 2024',
        description: '',
        thumbnails: {
          default: {
            url: 'https://i.ytimg.com/vi/QqQiy6yGLWo/default.jpg',
            width: 120,
            height: 90,
          },
          medium: {
            url: 'https://i.ytimg.com/vi/QqQiy6yGLWo/mqdefault.jpg',
            width: 320,
            height: 180,
          },
          high: {
            url: 'https://i.ytimg.com/vi/QqQiy6yGLWo/hqdefault.jpg',
            width: 480,
            height: 360,
          },
        },
        channelTitle: 'Wrestling Fans Network',
        liveBroadcastContent: 'none',
        publishTime: '2024-05-05T00:00:00Z',
      },
    },
  ];*/
