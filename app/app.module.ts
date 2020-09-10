import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { UsersComponent } from './users/users.component';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material/material.module';
import { CachingInterceptorService } from './services/caching-interceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    MaterialModule
  ],
  providers: [
    {
			provide: HTTP_INTERCEPTORS,
			useClass: CachingInterceptorService,
			multi: true
		},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
