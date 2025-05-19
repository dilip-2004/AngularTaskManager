import { Component } from '@angular/core';
import { TaskItem } from '../../models/task.model';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TodoService } from '../../services/todo.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo-list',
  imports: [FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css'
})
export class TodoListComponent {

  submitted = false;
  error = '';
  success = '';
  taskForm: FormGroup;
  isLoading = false;
  tasks: TaskItem[] = [];
  newTask: Omit<TaskItem, 'id' | 'userId'> = {
    name: '',
    description: '',
    isCompleted: false
  };

  constructor(
    private todoService: TodoService,
    private authService: AuthService,
    private router: Router
  ) {
    this.taskForm = new FormGroup({
      taskName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      taskDescription: new FormControl('', [Validators.required, Validators.minLength(2)])
    });
  }

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadTasks();
  }

  loadTasks() {
    this.isLoading = true;
    this.todoService.getTasks().subscribe({
      next: tasks => this.tasks = tasks,
      error: err => {
        this.error = 'Error loading tasks';
        if (err.status === 401) this.authService.logout();
      },
      complete: () => this.isLoading = false
    });
  }

  createTask() {
    this.submitted = true;
    this.error = '';
    this.success = '';

    if (this.taskForm.invalid) {
      this.error = 'Please fill all fields correctly';
      return;
    }

    this.isLoading = true;
    const { taskName, taskDescription } = this.taskForm.value;
    this.newTask.name = taskName;
    this.newTask.description = taskDescription;

    this.todoService.createTask(this.newTask).subscribe({
      next: () => {
        this.success = 'Task created successfully!';
        this.taskForm.reset();
        this.submitted = false;
        this.loadTasks();
        setTimeout(() => this.success = '', 3000);
      },
      error: err => {
        this.error = 'Failed to create task';
        if (err.status === 401) this.authService.logout();
      },
      complete: () => this.isLoading = false
    });
  }

  updateTask(id: string) {
    const foundTask = this.tasks.find(task => id === task.id);
    if (foundTask) {
      foundTask.isCompleted = !foundTask.isCompleted;
      this.todoService.updateTask(id, foundTask).subscribe({
        next: () => {
          this.success = 'Task updated successfully';
          this.loadTasks();
          setTimeout(() => this.success = '', 3000);
        },
        error: () => {
          this.error = 'Failed to update task'
          setTimeout(() => this.error = '', 3000);
        }
      });
    }
  }

  deleteTask(id: string) {
    this.todoService.deleteTask(id).subscribe({
      next: () => {
        this.success = 'Task deleted successfully';
        this.loadTasks();
        setTimeout(() => this.success = '', 3000);
      },
      error: () => {
        this.error = 'Failed to delete task'
        setTimeout(() => this.error = '', 3000);
      }
    });
  }

  logout() {
    this.authService.removeToken();
    this.router.navigate(['/login']);
  }
}
