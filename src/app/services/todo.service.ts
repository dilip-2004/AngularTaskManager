import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TaskItem } from '../models/task.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = 'https://taskmanager.runasp.net/api/Tasks';

  constructor(private http: HttpClient, private authService:AuthService) { }

  private getHeaders(): HttpHeaders{
    const token=this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getTasks() {
    return this.http.get<TaskItem[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  createTask(task: Omit<TaskItem, 'id' | 'userId'>) {
    return this.http.post<TaskItem>(this.apiUrl, task, { headers: this.getHeaders() });
  }

  updateTask(id: string, task: Omit<TaskItem, 'id' | 'userId'>) {
    return this.http.put<TaskItem>(`${this.apiUrl}/${id}`, task, { headers: this.getHeaders() });
  }

  deleteTask(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`,{ headers: this.getHeaders() });
  }
}
