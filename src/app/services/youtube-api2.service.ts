import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class YoutubeApi2Service {
  private apiUrl = 'https://iv.nboeck.de/api/v1/search';
  private apiUrlSuggestions =
    'https://invidious.baczek.me/api/v1/search/suggestions';
  // https://iv.nboeck.de/api/v1/search?q=wwe&region=IN
  private apiUrlTrending = 'https://iv.nboeck.de/api/v1/trending';
  public region = 'IN';
  constructor(private http: HttpClient) {}

  showHomePageContent(): Observable<any> {
    return this.http.get<any>(this.apiUrlTrending).pipe(
      catchError((error) => {
        console.error('Error fetching home page content:', error);
        return throwError('Error fetching home page content');
      })
    );
  }

  search(query: string, region: string): Observable<any> {
    const params = new HttpParams().set('q', query).set('region', region);
    return this.http.get<any>(this.apiUrl, { params }).pipe(
      catchError((error) => {
        console.error('Error searching:', error);
        return throwError('Error searching');
      })
    );
  }

  getSuggestions(query: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrlSuggestions}?q=${query}`).pipe(
      catchError((error) => {
        console.error('Error fetching suggestions:', error);
        return throwError('Error fetching suggestions');
      })
    );
  }
}


/*
  showHomePagecontent(){
    return this.http.get<any>(this.apiUrlTrending);
  }
  search(query: string, region: string): Observable<any> {
    const params = { q: query, region: region };
    return this.http.get<any>(this.apiUrl, { params });
  }

  getSuggestions(query: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrlSuggestions}?q=${query}`);
  }
}
*/
