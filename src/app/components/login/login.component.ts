import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm: FormGroup;
  submitted = false;
  error = '';

  constructor(private router:Router,private formBuilder:FormBuilder,private authService:AuthService){
    if(localStorage.getItem('token')) {
      this.router.navigate(['/todo'])
    }

    this.loginForm = this.formBuilder.group({
      userName: ['', [Validators.required, Validators.minLength(3),Validators.maxLength(20)]],
      userPassword: ['', [Validators.required, Validators.minLength(8),Validators.maxLength(20)]]
    });    
  }  

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.error = '';

    if (this.loginForm.invalid) {
      this.error = 'login failed';
      return;
    }

    const { userName, userPassword } = this.loginForm.value;
    
    this.authService.login({Name:userName, Password:userPassword})
      .subscribe({
      next: (response: any) => {
        this.authService.saveToken(response.token);
        this.router.navigate(['/todo']);
      },
      error: (err) => {
        if (err.status === 401) {
          this.error = 'Invalid username or password';
        } else {
          this.error = err.error?.Message || 'Login failed. Please try again.';
        }
      }
    });
  }

  navigateToSignup() {
    this.router.navigate(['/signup']);
  }
}
