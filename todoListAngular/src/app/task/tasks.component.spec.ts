import { provideHttpClient } from '@angular/common/http';
import { TasksComponent } from './tasks.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router, RouterOutlet } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideLocationMocks } from '@angular/common/testing';
import { routes } from '../app.routes';
import { AuthGuard } from '../auth/auth.guard';
import { AuthService } from '../auth/auth.service';
import { TaskService } from './task-service';
import { of } from 'rxjs';
import { SearchTaskComponent } from './search-task/search-task.component';
import { NewTaskComponent } from './new-task/new-task.component';
import { TasksListComponent } from './taskList/taskList.component';
import { FormsModule } from '@angular/forms';
import { TaskDoneElementComponent } from './task-done-element/task-done-element.component';
import { TaskPendingElementComponent } from './task-pending-element/task-pending-element.component';
import { AuthResponseData } from '../auth/auth-response.model';


describe('TasksComponent', () => {
  let component: TasksComponent;
  let fixture: ComponentFixture<TasksComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let taskService: jasmine.SpyObj<TaskService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', ['autoLogin', 'logOut','signIn','handleAuthentication']);
    taskService = jasmine.createSpyObj('TaskService', ['fetchAllTasks', 'filterTasks']);
    router = jasmine.createSpyObj('Router', ['navigate']);
    taskService.pending$ = of([]);
    taskService.completed$=of([]);
    taskService.filtered$=of([]);
     TestBed.configureTestingModule({
      imports: [TasksComponent,RouterOutlet,SearchTaskComponent, NewTaskComponent, TasksListComponent,FormsModule,TaskPendingElementComponent,TaskDoneElementComponent],
      providers:[
        AuthGuard,
        provideHttpClient(),
        provideHttpClientTesting() ,
        provideRouter(routes),
        provideAnimations(),
        provideLocationMocks(),
        { provide: AuthService, useValue: authService },
        { provide: TaskService, useValue: taskService },
        { provide: Router, useValue: router }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call autoLogin and fetchAllTasks on init', () => {
    expect(authService.autoLogin).toHaveBeenCalled();
    expect(taskService.fetchAllTasks).toHaveBeenCalled();
  });

  it('should log out and navigate to /logIn on logout', () => {
    component.onLogout();
    expect(authService.logOut).toHaveBeenCalled();
    expect(localStorage.getItem('userData')).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/logIn']);
  });
});
