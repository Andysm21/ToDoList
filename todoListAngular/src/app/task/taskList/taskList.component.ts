import { TaskService } from './../task-service';
import { Component } from '@angular/core';
import { Task_Input } from '../task-input.model';
import { TaskPendingElementComponent } from '../task-pending-element/task-pending-element.component';
import { TaskDoneElementComponent } from '../task-done-element/task-done-element.component';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [TaskPendingElementComponent,TaskDoneElementComponent],
  templateUrl: './taskList.component.html',
  styleUrl: './taskList.component.css'
})
export class TasksComponent {
  completed: Task_Input[] = [];
  constructor(private TaskService: TaskService) {
    this.TaskService.completed$.subscribe((tasks)=>this.completed=tasks);
  }

  deleteDone(){
    this.TaskService.deleteDoneTasks();
  }
}
