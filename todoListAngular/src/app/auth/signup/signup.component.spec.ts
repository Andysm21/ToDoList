import { SignUpComponent } from './signup.component';
import { provideHttpClient } from '@angular/common/http';
import { AuthGuard } from '../auth.guard';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { routes } from '../../app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideLocationMocks } from '@angular/common/testing';
import { AuthService } from '../auth.service';
import { TaskService } from '../../task/task-service';
import { NgForm } from '@angular/forms';
import { AuthResponseData } from '../auth-response.model';
import { of, throwError } from 'rxjs';


describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;
  let router: Router;
  let authService: jasmine.SpyObj<AuthService>;
  let taskService: jasmine.SpyObj<TaskService>;
  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', ['signUp']);
    taskService = jasmine.createSpyObj('TaskService', ['fetchAllTasks']);
    await TestBed.configureTestingModule({
      imports: [SignUpComponent],
      providers: [
        AuthGuard,
        provideHttpClient(),
        provideHttpClientTesting() ,
        provideRouter(routes),
        provideAnimations(),
        provideLocationMocks(),
        { provide: AuthService, useValue: authService },
        { provide: TaskService, useValue: taskService }
      ],
    })
    .compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /tasks on successful signUp', () => {
    const mockResponse: AuthResponseData = {
      idToken: 'mockIdToken',
      email: 't@t.com',
      refreshToken: 'mockRefreshToken',
      expiresIn: '3600',
      localId: 'mockLocalId',
    };
    authService.signUp.and.returnValue(of(mockResponse));
    component.email.setValue('t@t.com');
    component.password.setValue('123123');
    spyOn(router, 'navigate');
    component.onSubmit({ reset: () => {} } as NgForm);
    expect(authService.signUp).toHaveBeenCalledWith('t@t.com', '123123');
    expect(router.navigate).toHaveBeenCalledWith(['/tasks']);
  });

  it('should set error message on signUp failure', () => {
    const errorMessage = 'Invalid email or password';
        authService.signUp.and.returnValue(throwError({
      error: {
        error: {
          message: errorMessage
        }
      }
    }));
    component.email.setValue('wrong@wrong.com');
    component.password.setValue('wrongpassword');
    component.onSubmit({ reset: () => {} } as NgForm);
    expect(component.errorMessage()).toBe(errorMessage);
    expect(taskService.fetchAllTasks).not.toHaveBeenCalled();
  });
});
