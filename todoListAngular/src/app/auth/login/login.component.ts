
import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormArray, FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatStepperModule} from '@angular/material/stepper';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {catchError, merge, of, tap} from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { TaskService } from '../../task/task-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule,MatCardModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatIconModule,MatStepperModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LogInComponent {
  form = new FormArray<FormGroup>([
    new FormGroup({ email: new FormControl("", { validators: [Validators.required, Validators.email,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    ]}) }),
    new FormGroup({ password: new FormControl("", { validators: [Validators.required,Validators.minLength(6)]}) }),
  ]);

  submit=false;
  readonly email = this.form.at(0).get('email') as FormControl;
  readonly password = this.form.at(1).get('password') as FormControl;

  errorMessage = signal('');
  hide = signal(true);

  constructor(private authService:AuthService,private router:Router, private taskService:TaskService) {
    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  SignInRoute() {this.router.navigate(['/signUp']);}


  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  updateErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else if (this.email.hasError('email')) {
      this.errorMessage.set('Not a valid email');
    }else if (this.password.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    }
    else if (this.email.hasError('pattern')){
      this.errorMessage.set('Not a valid email');
    }
    else if (this.password.hasError('minlength')) {
      this.errorMessage.set('Password must be at least 6 characters');
    } else {
      this.errorMessage.set('');}
  }
  onSubmit() {
    this.submit=!this.submit
    if (this.email.valid && this.password.valid) {
      this.authService.signIn(this.email.value!, this.password.value!).pipe(
        tap(response => {
          this.taskService.fetchAllTasks();
          this.router.navigate(['/tasks']);
        }),
        catchError(error => {
          if (this.errorMessage() === '') {
            this.errorMessage.set(error.error.error.message);
            console.log('Error: ', this.errorMessage());
          } else {
            console.log(this.errorMessage());
          }
          return of(null);
        })
      ).subscribe();
    } else {
      console.log(this.errorMessage());
    }

  }
}
