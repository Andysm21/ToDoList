import { Task_Input } from './../task-input.model';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../task-service';

@Component({
  selector: 'app-search-task',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-task.component.html',
  styleUrl: './search-task.component.css'
})

export class SearchTaskComponent  {
  searchInput: string = '';
  searchPriority: 'Low' | 'Medium' | 'High'| 'All' = 'All';
  Tasks: Task_Input[] = [];
  filteredPendingTasks: Task_Input[] = [];
  constructor(private TaskService: TaskService) {
    this.TaskService.pending$.subscribe((tasks)=>this.Tasks=tasks);
  }

  searchSubmit() {
    this.TaskService.filterTasks(this.searchPriority, this.searchInput);
  }

}
