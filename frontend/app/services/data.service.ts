import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { Id } from '../models/id.interface';
import { User } from '../models/user.interface';
import { PaginationStateInterface } from '../models/pagination-state.interface';
import { paginationState } from '../constants/paginationState';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private baseUrl: string;
  public paginationState$ = new BehaviorSubject<PaginationStateInterface>(paginationState);

  constructor(private http: HttpClient) {
    this.baseUrl = environment.baseUrl;
  }

  get(path: string): Observable<Id[]>  {
    const url = new URL(path, this.baseUrl).toString();
    return this.http.get<Id[]>(url);
  }

  post(path: string, body): Observable<User[]>  {
    const url = new URL(path, this.baseUrl).toString();
    return this.http.post<User[]>(url, body);
  }
}
