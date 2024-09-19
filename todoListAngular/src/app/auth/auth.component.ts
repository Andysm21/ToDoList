import { ChangeDetectionStrategy, Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ MatButtonModule,MatCardModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class AuthComponent {

  constructor(private router:Router) { }
SignInRoute() {
  this.router.navigate(['/logIn']);

}
SignUpRoute() {
  this.router.navigate(['/signUp']);
}


}
