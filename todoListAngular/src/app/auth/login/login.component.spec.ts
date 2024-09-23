import { provideHttpClient } from '@angular/common/http';
import { AuthGuard } from '../auth.guard';
import { LogInComponent } from './login.component';
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


describe('LogInComponent', () => {
  let component: LogInComponent;
  let fixture: ComponentFixture<LogInComponent>;
  let router: Router;
  let authService: jasmine.SpyObj<AuthService>;
  let taskService: jasmine.SpyObj<TaskService>;
  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', ['signIn']);
    taskService = jasmine.createSpyObj('TaskService', ['fetchAllTasks']);
    await TestBed.configureTestingModule({
      imports: [LogInComponent],
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
    fixture = TestBed.createComponent(LogInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /tasks on successful login', () => {
    const mockResponse: AuthResponseData = {
      idToken: 'mockIdToken',
      email: 't@t.com',
      refreshToken: 'mockRefreshToken',
      expiresIn: '3600',
      localId: 'mockLocalId',
    };
    authService.signIn.and.returnValue(of(mockResponse));
    component.email.setValue('t@t.com');
    component.password.setValue('123123');
    spyOn(router, 'navigate');
    component.onSubmit({ reset: () => {} } as NgForm);
    expect(authService.signIn).toHaveBeenCalledWith('t@t.com', '123123');
    expect(taskService.fetchAllTasks).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/tasks']);
  });

  it('should set error message on login failure', () => {
    const errorMessage = 'Invalid email or password';
        authService.signIn.and.returnValue(throwError({
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
