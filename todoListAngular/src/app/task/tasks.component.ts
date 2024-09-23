import { TaskService } from './task-service';
import { Component, OnInit} from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { TasksListComponent } from './taskList/taskList.component';
import { SearchTaskComponent } from './search-task/search-task.component';
import { NewTaskComponent } from './new-task/new-task.component';
import { AuthService } from '../auth/auth.service';



@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [RouterOutlet, TasksComponent, SearchTaskComponent, NewTaskComponent, TasksListComponent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent implements OnInit{
  constructor(private authService: AuthService,private taskService:TaskService,private router:Router) {}
  ngOnInit(): void {
    this.authService.autoLogin();
    this.taskService.fetchAllTasks();
  }
  onLogout(){
    this.authService.logOut();
    this.router.navigate(['/logIn']);
  }

}
