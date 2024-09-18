import { TaskService } from './../task-service';
import { FormsModule } from '@angular/forms';
import { Component, ElementRef,viewChild, ViewChild } from '@angular/core';

@Component({
  selector: 'app-new-task',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.css']
})

export class NewTaskComponent {
  taskName = '';
  taskPriority: 'Low' | 'Medium' | 'High' |'Priority'= 'Priority';
  @ViewChild('form') formEl!: ElementRef<HTMLFormElement>;
  constructor(private TaskService: TaskService) {}

  onAdd() {
    if(!this.taskName){
      alert("Task name is required");
      return;
    }
    if(this.taskPriority=="Priority") {this.taskPriority="Low";}
    this.TaskService.addTask({task:this.taskName,priority:this.taskPriority,isDone:false,id:""});
    this.formEl.nativeElement.reset();

  }
}
