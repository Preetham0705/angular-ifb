import {
  Component,
  OnInit
} from '@angular/core';

import { Title } from './title';
import { XLargeDirective } from './x-large';

@Component({
  selector: 'home',  // <home></home>
  providers: [
    Title
  ],
  styleUrls: ['./home.component.css'],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  private studentName: string = '';
  private studentMark: number;
  private error: string;
  private studentList: Object[] = [];
  private minMark: number;
  private maxMark: number;
  private averageMark: number;
  constructor(
    public title: Title
  ) { }

  public ngOnInit() {
    this.getStudentList();
    if(this.studentList.length){
      this.getStudentSummary();
    }
  }

  private addStudent() {
    if (this.validateField(this.studentName, this.studentMark)) {
      const studentObject = {
        name: this.studentName,
        mark: this.studentMark
      }
      this.studentList.push(studentObject);
      this.getStudentSummary();
      this.studentName = '';
      this.studentMark = null;
      this.addToLocalStorage();
    }
  }

  private addToLocalStorage() {
    localStorage.setItem('studentList', JSON.stringify(this.studentList));
  }

  private getStudentList() {
    let list = localStorage.getItem('studentList');
    if (list) {
      this.studentList = JSON.parse(list);
    }

  }

  private validateField(studentName: string, studentMark: number): boolean {
    let isFieldValidated = false;
    if (!studentName || !studentMark) {
      this.error = 'Please provide proper input';
    } else if (studentMark > 100) {
      this.error = 'Marks cannt be greater than 100';
    } else if (this.isStudentAlreadyExist(studentName)) {
      this.error = 'student Name already exist';
    } else {
      isFieldValidated = true;
      this.error = '';
    }
    return isFieldValidated;
  }

  private isStudentAlreadyExist(studentName: string): boolean {
    let found = false;
    this.studentList.some(student => {
      found = student['name'] === studentName;
      return found;
    });
    return found;
  }

  private deleteStudent(index: number) {
    this.studentList.splice(index, 1);
    this.getStudentSummary();
    this.addToLocalStorage();
  }

  private updateName(student: Object) {
    if (this.validateField(student['name'], student['mark'])) {
      this.addToLocalStorage();
    }

  }

  private updateMark(student: Object) {
    if (this.validateField(student['name'], student['mark'])) {
      this.getStudentSummary();
      this.addToLocalStorage();
    }
  }

  private getStudentSummary() {
    let marks: number[] = [];
    this.studentList.forEach(student => {
      marks.push(student['mark']);
    });
    this.minMark = Math.min(...marks);
    this.maxMark = Math.max(...marks);
    let sum = marks.reduce((previous, current) => current += previous);
    this.averageMark = sum / marks.length;

  }

}