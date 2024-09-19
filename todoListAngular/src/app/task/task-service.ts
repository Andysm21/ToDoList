import { AuthService } from './../auth/auth.service';
import { Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Task_Input } from './task-input.model';
import {  map, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class TaskService  {
  pendingTasks = signal<Task_Input[]>([]);
  private completedTasks = signal<Task_Input[]>([]);
  filteredPendingTasks=signal<Task_Input[]>([]);

  pending$=toObservable(this.pendingTasks);
  filtered$=toObservable(this.filteredPendingTasks);
  completed$=toObservable(this.completedTasks);

  pendingTasksRead = this.pendingTasks.asReadonly();
  completedTasksRead = this.completedTasks.asReadonly();
  private baseUrl="https://todorealtime-3089c-default-rtdb.europe-west1.firebasedatabase.app/"

  token="";
  currentUser: string ="";
  constructor(private http:HttpClient ){}

  updateArrays(response : Task_Input[]){
    this.pendingTasks.set(response.filter(t => !t.isDone && t.userEmail===this.currentUser));
    this.completedTasks.set(response.filter(t => t.isDone && t.userEmail===this.currentUser));
    this.filteredPendingTasks.set(this.pendingTasksRead());

  }

  fetchAllTasks() {
    const userData :{
      email:string,
      id:string,
      _token:string,
      _tokenExpirationDate:string
    }= JSON.parse(localStorage.getItem('userData')!);
    this.token= "?auth="+userData._token;
    this.currentUser= userData.email;
    this.http.get<{ [key: string]: Task_Input }>(this.baseUrl + "tasks.json").pipe(
      map(response => {
        const tasksArray: Task_Input[] = [];
        for (const key in response) {
          if (response.hasOwnProperty(key)) {
            tasksArray.push({ ...response[key], id: key });
          }
        }
        return tasksArray;
      }),
      tap(response => {
        this.updateArrays(response);
      })
    ).subscribe();
  }



  findByName(name:string){
    this.fetchAllTasks()
    console.log( this.pendingTasks().filter(t=>t.task===name && t.userEmail===this.currentUser))
    return this.pendingTasks().filter(t=>t.task===name && t.userEmail===this.currentUser);
  }

  addTask(task: Task_Input) {

    if(this.findByName(task.task).length==0){
      this.http.post<{ name: string }>(this.baseUrl+"tasks.json", task).subscribe(response => {
        const firebaseId = response.name;
        const updatedTask: Task_Input = { ...task, id: firebaseId };
        this.http.put(this.baseUrl+"tasks/"+firebaseId+".json", updatedTask).subscribe(() => {
          this.pendingTasks.update(oldTasks => [...oldTasks, updatedTask]);
          this.filteredPendingTasks.update(oldTasks => [...oldTasks, updatedTask]);
        });
      },
      error => {console.log(error)});
    }
    else{
      alert("Task Exists with this name")
      return;
    }
  }

  completeTask(task: Task_Input) {
    this.http.put(this.baseUrl+"tasks/"+task.id +".json",task).subscribe((response)=>{console.log(response)});
    this.completedTasks.update((oldTasks)=>[...oldTasks, task]);
    this.pendingTasks.update((oldTasks)=>oldTasks.filter(t=>t.task!==task.task));
    this.fetchAllTasks()
  }
  deleteDoneTasks(){
    this.completedTasks().forEach(task => {
      this.http.delete(`${this.baseUrl}tasks/${task.id}.json`).subscribe(response => {
      });
    });
    this.completedTasks.set([]);

  }
  filterTasks(priority: 'Low' | 'Medium' | 'High' | 'All', search: string) {
    if(priority=='All'&&search==''){
           this.fetchAllTasks();
    }
    else{
          let filteredTasks = this.pendingTasks();
          if(priority!='All'&&search&&search.trim()!=''){
            this.filteredPendingTasks.set(this.pendingTasksRead().filter(task => task.priority === priority&&task.task.toLowerCase().includes(search.toLowerCase())));

          }
          else if (priority !== 'All') {
            this.filteredPendingTasks.set(this.pendingTasksRead().filter(task => task.priority === priority));
          }
          else if (search && search.trim() !== '') {
            this.filteredPendingTasks.set(filteredTasks = filteredTasks.filter(task =>
              task.task.toLowerCase().includes(search.toLowerCase())
            ));
          }
    }
  }
}

