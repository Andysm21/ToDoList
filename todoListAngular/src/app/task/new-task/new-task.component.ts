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
    console.log(this.taskName);
    console.log(this.taskPriority);
    if(!this.taskName||this.taskName==null){
      alert("Task name is required");
      return;
    }
    if(this.taskPriority=='Priority'||this.taskPriority==null){
      this.taskPriority='Priority';
      alert("please select a priority");

      return;
    }
    this.TaskService.addTask({task:this.taskName,priority:this.taskPriority,isDone:false,id:"",userEmail:this.TaskService.currentUser});
    this.formEl.nativeElement.reset();

  }
}
