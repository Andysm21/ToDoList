import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TasksComponent } from "./task/tasks/tasks.component";
import { SearchTaskComponent } from "./task/search-task/search-task.component";
import { NewTaskComponent } from "./task/new-task/new-task.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TasksComponent, SearchTaskComponent, NewTaskComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Personal To Do List';
}
