import { Component, EventEmitter, inject, Inject, Input, Output } from '@angular/core';
import { Task_Input } from '../task-input.model';
import { TaskService } from '../task-service';

@Component({
  selector: 'app-task-done-element',
  standalone: true,
  imports: [],
  templateUrl: './task-done-element.component.html',
  styleUrl: './task-done-element.component.css'
})
export class TaskDoneElementComponent {
  completedTasksArray: Task_Input[] = [];
  constructor(private TaskService: TaskService) {
    this.TaskService.completed$.subscribe((tasks)=>this.completedTasksArray=tasks);
  }


  }
