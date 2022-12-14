import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  selectedUser: User = {
    fullName: '',
    email: '',
    password: '',
    phone: ''
  };

  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };

  constructor(private http: HttpClient, private router: Router) { }

  //HttpMethods

  postUser(user: any){
    return this.http.post(environment.apiBaseUrl+'/register',user,this.noAuthHeader);
  }

  login(authCredentials:any) {
    return this.http.post(environment.apiBaseUrl + '/authenticate', authCredentials,this.noAuthHeader);
  }

  updateUserProfile(userBody:any) {
    let postData: any;
    if (typeof userBody.image === "object") {
      postData = new FormData();
      postData.append("image", userBody.image);
    } else {
      postData = userBody;
    }
    return this.http.patch(environment.apiBaseUrl + '/updateUserProfile', postData);
  }

  applyLeave(leaveBody:any) {
    return this.http.post(environment.apiBaseUrl + '/applyLeave', leaveBody);
  }

  getUserProfile() {
    return this.http.get(environment.apiBaseUrl + '/userProfile');
  }

  changePassword(passwordBody:any) {
    return this.http.put(environment.apiBaseUrl + `/change-password`, passwordBody);
  }

  redirectToLogin() {
    this.router.navigate([`/employee/login`]);
  }

  //Helper Methods

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  deleteToken() {
    localStorage.removeItem('token');
  }

  getUserPayload() {
    const token = this.getToken();
    if (token) {
      const userPayload = atob(token.split('.')[1]);
      return JSON.parse(userPayload);
    }
    else
      return null;
  }

  isLoggedIn() {
    const userPayload = this.getUserPayload();
    if (userPayload)
      return userPayload.exp > Date.now() / 1000;
    else
      return false;
  }
}
