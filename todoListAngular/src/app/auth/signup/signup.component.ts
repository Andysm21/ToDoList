import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormControl, FormsModule, NgForm, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {merge} from 'rxjs';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule,MatCardModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})

export class SignUpComponent {

  submit=false;
  readonly email = new FormControl('', [Validators.required, Validators.email]);
  readonly password = new FormControl('', [Validators.required,Validators.minLength(6)]);
  errorMessage = signal('');
  hide = signal(true);

  constructor(private authService:AuthService,private router:Router) {
    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }
  SignInRoute() {
    this.router.navigate(['/logIn']);}

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

onSubmit(authForm:NgForm){
  this.submit=!this.submit;
  if(this.email.valid && this.password.valid){
    this.authService.signUp(this.email.value!,this.password.value!).subscribe(
      response=>{
        console.log("Response",response);
        this.router.navigate(['/tasks']);
      },
      error=>{
        if(this.errorMessage()===''){
          console.log("Error: ",error);
          this.errorMessage.set(error.error.error.message);
        }
        else{
          console.log(this.errorMessage());
        }
      }
    );
  }
  else{
    console.log(this.errorMessage());
  }
  authForm.reset();
}
}
