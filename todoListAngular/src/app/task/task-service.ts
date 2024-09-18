import { inject, Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Task_Input } from './task-input.model';
import { Firestore, collectionData, collection, doc, deleteDoc, addDoc, updateDoc, setDoc } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  pendingTasks = signal<Task_Input[]>([]);
  private completedTasks = signal<Task_Input[]>([]);
  filteredPendingTasks=signal<Task_Input[]>([]);
  pending$=toObservable(this.pendingTasks);
  filtered$=toObservable(this.filteredPendingTasks);
  completed$=toObservable(this.completedTasks);

  pendingTasksRead = this.pendingTasks.asReadonly();
  completedTasksRead = this.completedTasks.asReadonly();


  firestore:Firestore =inject(Firestore);

  constructor(){this.fetchAllTasks();}

 fetchAllTasks() {
  const taskCollection = collection(this.firestore, 'tasks');
  collectionData<Task_Input>(taskCollection, { idField: 'id' }).subscribe((tasks: Task_Input[]) => {
    this.pendingTasks.set(tasks.filter(t => !t.isDone));
    this.completedTasks.set(tasks.filter(t => t.isDone));
    this.filteredPendingTasks.set(tasks.filter(t=>!t.isDone));
  });
  this.filteredPendingTasks.set(this.pendingTasksRead());
}

  findByName(name:string){
    return this.pendingTasks().filter(t=>t.task.includes(name));
  }

  addTask(task: Task_Input): Observable<void> {
    return from(setDoc(doc(this.firestore, `tasks/${task.task}`), task).then(() => {}));
  }

  completeTask(task: Task_Input) {
    const taskDoc=doc(this.firestore, 'tasks', task.task);
    updateDoc(taskDoc, {isDone: true});
    this.completedTasks.update((oldTasks)=>[...oldTasks, task]);
    this.pendingTasks.update((oldTasks)=>oldTasks.filter(t=>t.task!==task.task));
  }
  deleteDoneTasks(){
    const deleteOps = this.completedTasks().map(task => {
      const taskDocRef = doc(this.firestore, `tasks/${task.task}`);
      return from(deleteDoc(taskDocRef));
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
          // this.pendingTasks.set(filteredTasks);





    }
  }
}

