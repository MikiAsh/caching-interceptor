import { Injectable } from '@angular/core';
import {
	HttpHandler,
	HttpInterceptor,
	HttpRequest,
	HttpResponse
} from '@angular/common/http';

import { of } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../models/user.interface';
import { idsToUniqueIdentifier } from '../utility/util';


@Injectable()
export class CachingInterceptorService implements HttpInterceptor {
	private requestCache = new Map<string, HttpResponse<User>>();
	private userCache = new Map<string, HttpResponse<User>>();

	constructor() {}

	public intercept(httpRequest: HttpRequest<any>, next: HttpHandler) {
		let hashedRequestId: string;
		let originalRequestBodyIds: string[];
		const cachedUsersPerCurrentRequest = new Map<string, HttpResponse<any>>();

		if (httpRequest.method === 'GET') {
			// only GET responses are cached fully
			hashedRequestId = idsToUniqueIdentifier(httpRequest);
			const cachedResponse = this.requestCache.get(httpRequest.urlWithParams+hashedRequestId);
			if (cachedResponse) {
				return of(cachedResponse);
			}
		} 
		else if (httpRequest.method === 'POST') {
			originalRequestBodyIds = [...httpRequest.body.ids];
			for (let i = httpRequest.body.ids.length-1; i >= 0; i--) {
				const id = httpRequest.body.ids[i];
				if (this.userCache.has(id)) {
					cachedUsersPerCurrentRequest.set(id, this.userCache.get(id));
					httpRequest.body.ids.splice(i, 1); // remove cached users from request
				}
			}
			if (cachedUsersPerCurrentRequest.size === originalRequestBodyIds.length) {
				// if the whole page is being fetched from cache don't go to server
				// I'm using map to preserve the correct order
				const res = new HttpResponse({body: originalRequestBodyIds.map(id => cachedUsersPerCurrentRequest.get(id))});
				return of(res);
			}
		}
		// EXECUTE REQUEST
		const requestHandle = next.handle(httpRequest).pipe(
			map((event) => {
			if (event instanceof HttpResponse) {
				if (httpRequest.method === 'GET') {
					// cache full response
					this.requestCache.set(
						httpRequest.urlWithParams+hashedRequestId,
						event.clone()
					);
				} else if (httpRequest.method === 'POST') {
					// cache users one by one
					httpRequest.body.ids.forEach(id => {
						this.userCache.set(id, event.clone().body.find(user => user.id === id));
					});
					const BodyAsMap: Map<string, User> = new Map(event.body.map(item => [item.id, item]));
					const returnedUsers = [];

					originalRequestBodyIds.forEach(id => {
						const bodyUser = BodyAsMap.get(id);
						const cacheUser = cachedUsersPerCurrentRequest.get(id);
						if (bodyUser) {
							returnedUsers.push(bodyUser);
						} else if (cacheUser) {
							returnedUsers.push(cacheUser);
						}
					});
					return event.clone({body: returnedUsers})
				}
			}
				return event;
			})
		);
		return requestHandle;
	}
}
