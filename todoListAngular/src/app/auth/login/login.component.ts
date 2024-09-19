
import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormControl, FormsModule, NgForm, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {catchError, merge, of, tap} from 'rxjs';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { TaskService } from '../../task/task-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule,MatCardModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LogInComponent {

  submit=false;
  readonly email = new FormControl('', [Validators.required, Validators.email]);
  readonly password = new FormControl('', [Validators.required,Validators.minLength(6)]);
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
    }else {
      this.errorMessage.set('');
    }
  }
  onSubmit(authForm: NgForm) {
    this.submit = !this.submit;

    if (this.email.valid && this.password.valid) {
      this.authService.signin(this.email.value!, this.password.value!).pipe(
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
    authForm.reset();
  }
}
