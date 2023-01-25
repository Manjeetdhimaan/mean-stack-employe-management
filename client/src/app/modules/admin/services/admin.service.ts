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

  postAdmin(user: Admin){
    this.isAdmin = true;
    return this.http.post(environment.apiBaseUrl+'/admin/register',user,this.noAuthHeader);
  }

  verifyOtp(otpBody: any){
    this.isAdmin = true;
    return this.http.post(environment.apiBaseUrl+'/admin/verifyOtp',otpBody,this.noAuthHeader);
  }

  login(authCredentials: any) {
    this.isAdmin = true;
    return this.http.post(environment.apiBaseUrl + '/admin/authenticate', authCredentials,this.noAuthHeader);
  }

  updateUserProfile(userBody: any) {
    this.isAdmin = true;
    return this.http.patch(environment.apiBaseUrl + '/admin/updateUserProfile', userBody);
  }

  getAdminProfile() {
    this.isAdmin = true;
    return this.http.get(environment.apiBaseUrl + '/admin/adminProfile');
  }

  getUsers(page: number, perPage: number) {
    this.isAdmin = true;
    return this.http.get(environment.apiBaseUrl + `/admin/getUsers/${page}/${perPage}`);
  }


  checkIn(id: string) {
    this.isAdmin = true;
    return this.http.post(environment.apiBaseUrl + `/admin/checkIn/${id}`, id);
  }

  checkAllUsers(data: any) {
    this.isAdmin = true;
    return this.http.post(environment.apiBaseUrl + `/admin/checkAllUsers`, data);
  }

  checkOut(id: string, exitType:string) {
    this.isAdmin = true;
    return this.http.post(environment.apiBaseUrl + `/admin/checkOut/${id}`, exitType);
  }

  respondToLeaves(id: string, leaveBody:any) {
    this.isAdmin = true;
    return this.http.patch(environment.apiBaseUrl + `/admin/respondToLeaves/${id}`, leaveBody);
  }

  getUser(id:string) {
    this.isAdmin = true;
    return this.http.get(environment.apiBaseUrl + `/admin/getUser/${id}`);
  }

  createPayroll(id: string, payrollBody:any) {
    this.isAdmin = true;
    return this.http.post(environment.apiBaseUrl + `/admin/createPayroll/${id}`, payrollBody);
  }

  changePassword(passwordBody:any) {
    this.isAdmin = true;
    return this.http.put(environment.apiBaseUrl + `/admin/change-password`, passwordBody);
  }

  postEmp(emp: any){
    this.isAdmin = true;
    return this.http.post(environment.apiBaseUrl+'/admin/registerEmp',emp);
  }

  deleteEmp(empId: any){
    this.isAdmin = true;
    return this.http.delete(environment.apiBaseUrl+`/admin/deleteUser/${empId}`);
  }



  //Helper Methods

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  deleteToken() {
    this.isAdmin = false;
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
