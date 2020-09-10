import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { Subscription } from 'rxjs';

import { DataService } from 'src/app/services/data.service';
import { User } from '../models/user.interface';
import { PaginationStateInterface } from '../models/pagination-state.interface';
import { SortEventInterface } from '../models/sort-event.interface';
import { paginationState, usersCount } from '../constants/paginationState';

@Component({
  selector: 'tst-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {
  private subscription1: Subscription;
  displayedColumns: string[] = ['id', 'name', 'age'];
  dataSource: MatTableDataSource<User>;
  currentPaginationState: PaginationStateInterface;

  constructor(private dataService: DataService) { }

  get lastPageNumber() : number {
    return  Math.ceil(usersCount/paginationState.limit) - 1;
  }
  
  ngOnInit() {
    this.subscription1 = this.dataService.paginationState$.subscribe(msg => {
      this.populateDataSource(msg);
      this.currentPaginationState = msg;
    });
  }

  sortData(event: SortEventInterface): void {
    const currentState = {...this.dataService.paginationState$.value}
    currentState.sort = event.active;
    currentState.sortDir = event.direction;
    this.dataService.paginationState$.next(currentState);
  }

  populateDataSource(paginationState): void {
    const idsRoute = `users?page=${paginationState.page}&limit=${paginationState.limit}&sort=${paginationState.sort}&sortDir=${paginationState.sortDir}`;
    const usersRoute = 'users';

    this.dataService.get(idsRoute).toPromise().then(idsResponse => {
      this.dataService.post(usersRoute, {"ids": [...idsResponse]})
      .toPromise().then(usersResponse => {
        this.dataSource = new MatTableDataSource(usersResponse);
       });
    })
  }

  onNext(): void {
    if (this.currentPaginationState.page === this.lastPageNumber) {
      return;
    }
    const currentState = {...this.dataService.paginationState$.value}
    currentState.page++;
    this.dataService.paginationState$.next(currentState);
  }

  onBack(): void {
    if (this.currentPaginationState.page === 0) {
      return;
    }
    const currentState = {...this.dataService.paginationState$.value}
    currentState.page--;
    this.dataService.paginationState$.next(currentState);
  }

  onFirst(): void {
    const currentState = {...this.dataService.paginationState$.value}
    currentState.page = 0;
    this.dataService.paginationState$.next(currentState);
  }

  onLast(): void {
    const currentState = {...this.dataService.paginationState$.value}
    currentState.page = this.lastPageNumber;
    this.dataService.paginationState$.next(currentState);
  }

  ngOnDestroy() {
    this.subscription1.unsubscribe();
  }

}
