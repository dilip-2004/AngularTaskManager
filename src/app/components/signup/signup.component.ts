import { Component } from '@angular/core';
import { FormsModule,ReactiveFormsModule,FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [FormsModule,ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  submitted = false;
  error = '';
  success = '';
  signupForm: FormGroup;
  isLoading = false;
 

  constructor(private authService:AuthService,private router:Router) {
      this.signupForm = new FormGroup({
      userName: new FormControl('',[Validators.required,Validators.minLength(3)]),
      userPassword: new FormControl('',[Validators.required,Validators.minLength(10),Validators.maxLength(20)]),
    });
  }

  onSubmit() {
    this.submitted = true;
    this.error = '';
    this.success = '';

    if(this.signupForm.invalid) {
      this.error = 'Please fill all fields correctly';
      return;
    }

    this.isLoading = true;
    const { userName, userPassword } = this.signupForm.value;

    this.authService.signup({ Name: userName, Password: userPassword })
      .subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.success = response.Message || 'Account created successfully!';
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: (err) => {
          this.isLoading = false;
          if (err.status === 409) {
            this.error = 'Username already exists';
          } else {
            this.error = err.error?.Message || 'Signup failed. Please try again.';
          }
        }
      });
  }

  navigateToLogin(){
    this.router.navigate(['/login']);
  }
}
