import { Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TasksListComponent } from './taskList/taskList.component';
import { SearchTaskComponent } from './search-task/search-task.component';
import { NewTaskComponent } from './new-task/new-task.component';



@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [RouterOutlet, TasksComponent, SearchTaskComponent, NewTaskComponent, TasksListComponent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent {
  title = 'Personal To Do List';
;
}
