import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiURL="https://taskmanager.runasp.net/api/Auth"

  constructor(private http:HttpClient,private router:Router) { }

  login(obj:any) {
    return this.http.post(`${this.apiURL}/login`,obj);
  }

  signup(obj:any) {
    return this.http.post(`${this.apiURL}/signup`,obj);
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  removeToken() {
    localStorage.removeItem('token');
  }

  logout() {
    this.removeToken();
    this.router.navigate(['/login']);
  }
}
