export interface Task_Input {
    task: string;
    priority: 'Low' | 'Medium' | 'High';
    isDone: boolean;
    id:string;
    userEmail:string;
}
