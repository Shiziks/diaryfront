import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IQuote } from 'src/app/shared/interfaces/i-quote';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {

  constructor(private http: HttpClient) { }

  //GET RANDOM QUOTE
  getRandomQuote(token: any): Observable<any> {
    return this.http.get('http://127.0.0.1:8000/api/quote', token);
  }

  ///GET ALL QUOTES
  getAllQuotes(): Observable<IQuote[]> {
    return this.http.get<IQuote[]>('http://127.0.0.1:8000/api/allquotes');
  }

  ///DELETE QUOTE
  deleteQuote(id: any): Observable<IQuote[]> {
    return this.http.post<IQuote[]>('http://127.0.0.1:8000/api/deletequote', id);
  }

  ///ADD QUOTE
  addQuote(quote: IQuote): Observable<IQuote[]> {
    return this.http.post<IQuote[]>('http://127.0.0.1:8000/api/addquote', quote);
  }

  ///EDIT QUOTE
  editQuote(quote: IQuote): Observable<any> {
    return this.http.post<any>('http://127.0.0.1:8000/api/editquote', quote);
  }
}
