import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormArray, FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatStepperModule} from '@angular/material/stepper';
import {merge} from 'rxjs';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule,MatCardModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatIconModule,MatStepperModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})

export class SignUpComponent {
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

onSubmit(){
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

}
}
