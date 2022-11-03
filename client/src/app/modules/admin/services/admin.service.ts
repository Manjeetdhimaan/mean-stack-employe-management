import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Admin } from '../models/admin.model';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AdminService {
  selectedAdmin: Admin = {
    fullName: '',
    email: '',
    password: '',
  };

  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };
   
  constructor(private http: HttpClient) { }

  //HttpMethods
  isAdmin: boolean = false;

  postUser(user: Admin){
    this.isAdmin = true;
    return this.http.post(environment.apiBaseUrl+'/admin/register',user,this.noAuthHeader);
  }

  login(authCredentials: any) {
    this.isAdmin = true;
    return this.http.post(environment.apiBaseUrl + '/admin/authenticate', authCredentials,this.noAuthHeader);
  }

  updateUserProfile(userBody: any) {
    this.isAdmin = true;
    return this.http.put(environment.apiBaseUrl + '/admin/updateUserProfile', userBody);
  }

  getAdminProfile() {
    this.isAdmin = true;
    return this.http.get(environment.apiBaseUrl + '/admin/adminProfile');
  }

  getUsers() {
    this.isAdmin = true;
    return this.http.get(environment.apiBaseUrl + '/admin/getUsers');
  }


  checkIn(id: string) {
    this.isAdmin = true;
    return this.http.post(environment.apiBaseUrl + `/admin/checkIn/${id}`, id);
  }

  checkOut(id: string, exitType:string) {
    this.isAdmin = true;
    return this.http.post(environment.apiBaseUrl + `/admin/checkOut/${id}`, exitType);
  }

  respondToLeaves(id: string, userBody:any) {
    this.isAdmin = true;
    return this.http.put(environment.apiBaseUrl + `/admin/respondToLeaves/${id}`, userBody);
  }

  getUser(id:string) {
    this.isAdmin = true;
    return this.http.get(environment.apiBaseUrl + `/admin/getUser/${id}`);
  }



  //Helper Methods

  setToken(token: string) {
    localStorage.setItem('admin-token', token);
  }

  getToken() {
    return localStorage.getItem('admin-token');
  }

  deleteToken() {
    this.isAdmin = false;
    localStorage.removeItem('admin-token');
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
