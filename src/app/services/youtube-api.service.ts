import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class YoutubeApiService {

  private apiUrl = 'https://youtube-v31.p.rapidapi.com/search';
  private videoDetailApiURL = 'https://youtube-v31.p.rapidapi.com/videos';
  private commentsApiURL = 'https://youtube-v31.p.rapidapi.com/commentThreads';
  private channelApiURL = 'https://youtube-v31.p.rapidapi.com/channels';
  private rapidApiKey = '916d2df44emsh40dd21cb4cfc667p132195jsn434e8686479d';
  nextPageToken: string = '';
  constructor(private http: HttpClient) { }

  searchVideos(query: string, pageToken?: string): Observable<any> {
    const headers = new HttpHeaders({
      'X-RapidAPI-Key': this.rapidApiKey,
      'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com'
    });

    let paramsObj: any = {
      q: query,
      part: 'snippet,id',
      regionCode: 'IN',
      maxResults: '10',
      type: 'video',
      videoDuration: 'medium'
    };
  
    // If pageToken is provided, add it to the parameters
    if (pageToken) {
      paramsObj.pageToken = pageToken;
    }
  
    const params = new HttpParams({ fromObject: paramsObj });
  
    return this.http.get(this.apiUrl, { headers, params });
  }

  getVideoDetails(videoId: string): Observable<any> {
    const options = {
      params: {
        part: 'contentDetails,snippet,statistics',
        id: videoId
      },
      headers: {
        'X-RapidAPI-Key': this.rapidApiKey,
        'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com'
      }
    };

    return this.http.get(this.videoDetailApiURL, options);
  }
  

  getRelatedVideos(videoId: string): Observable<any> {
    const options = {
      params: {
        relatedToVideoId: videoId,
        part: 'id,snippet',
        type: 'video',
        maxResults: '50'
      },
      headers: {
        'X-RapidAPI-Key': this.rapidApiKey,
        'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com'
      }
    };

    return this.http.get(this.apiUrl, options);
  }

  getVideoComments(videoId: string): Observable<any> {
    const options = {
      params: {
        part: 'snippet',
        videoId: videoId,
        maxResults: '10'
      },
      headers: {
        'X-RapidAPI-Key': this.rapidApiKey,
        'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com'
      }
    };

    return this.http.get(this.commentsApiURL, options);
  }


getChannelDetails(channelId: string): Observable<any> {
  const options = {
    params: {
      part: 'snippet,statistics',
      id: channelId,
      
    },
    headers: {
      'X-RapidAPI-Key': this.rapidApiKey,
      'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com'
    }
  };

  return this.http.get(this.channelApiURL, options);
}
}
