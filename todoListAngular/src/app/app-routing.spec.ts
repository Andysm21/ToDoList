import { TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from "./app.routes";
import { AuthComponent } from "./auth/auth.component";
import { LogInComponent } from "./auth/login/login.component";
import { SignUpComponent } from "./auth/signup/signup.component";
import { provideLocationMocks } from '@angular/common/testing';
import { AuthGuard } from "./auth/auth.guard";
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideAnimations } from "@angular/platform-browser/animations";
import { TasksComponent } from "./task/tasks.component";
import { AuthService } from "./auth/auth.service";

describe("App Routing", () => {
  let harness: RouterTestingHarness;
  let authServiceMock : jasmine.SpyObj<AuthService>;
  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj<AuthService>('AuthService', ['user']);
    await TestBed.configureTestingModule({
      imports: [
        AuthComponent,
        LogInComponent,
        SignUpComponent
      ],
      providers: [
        AuthGuard,
        provideHttpClient(),
        provideHttpClientTesting() ,
        provideRouter(routes),
        provideAnimations(),
        provideLocationMocks()
      ],
    }).compileComponents();
  });

  beforeEach(async () => {
    harness = await RouterTestingHarness.create('/');
  });

  it('should navigate to AuthComponent and create AuthComponent', async () => {
    const  fixture  = await harness.navigateByUrl('/');
    expect(fixture).toBeTruthy();
    expect(fixture instanceof AuthComponent).toBeTrue();
  });


  it('should navigate to SignUpComponent', async () => {
    const  fixture  = await harness.navigateByUrl('/signUp');
    harness.detectChanges();
    expect(fixture).toBeTruthy();
    expect(fixture instanceof SignUpComponent).toBeTrue();

  });

  it('should navigate to LogInComponent', async () => {
    const  fixture  = await harness.navigateByUrl('/logIn');
    harness.detectChanges();
    expect(fixture).toBeTruthy();
    expect(fixture instanceof LogInComponent).toBeTrue();
  });
  it('should not navigate to Tasks Component because of AuthGuard', async () => {
    const  fixture  = await harness.navigateByUrl('/tasks');
    harness.detectChanges();
    expect(fixture).toBeTruthy();
    expect(fixture instanceof LogInComponent || fixture instanceof SignUpComponent).toBeTrue();
  });



});
