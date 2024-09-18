import { TaskService } from './../task-service';
import { Component } from '@angular/core';
import { Task_Input } from '../task-input.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pendingtask-element',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-pending-element.component.html',
  styleUrl: './task-pending-element.component.css'
})
export class TaskPendingElementComponent {
  pending: Task_Input[] = [];
  constructor(private TaskService: TaskService) {
    this.TaskService.filtered$.subscribe((tasks)=>this.pending=tasks);
  }
  completed(taskName:string) {
    const taskToComplete = this.TaskService.findByName(taskName);
    taskToComplete[0].isDone = true;
    this.TaskService.completeTask(taskToComplete[0]);
  }
}
