import { Component, Inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  FormArray,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../services/api.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

interface Role {
  value: string;
  viewValue: string;

}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
})
export class DialogComponent implements OnInit {
  registerForm!: FormGroup;
  actionBtn: string = 'Submit';
  genderList = ['Male', 'Female'];
  isLoading = false;
  faError = faCircleExclamation;


  roles: Role[] = [
    { value: 'Developer', viewValue: 'Developer' },
    { value: 'Tester', viewValue: 'Tester' },
    { value: 'Manager', viewValue: 'Manager' },
    { value: 'TeamLeader', viewValue: 'TeamLeader' },
  ];

  skills = this.formBuilder.group(
    {
      java: false,
      nodejs: false,
      react: false,
      angular: false,
      android: false,
    },
    { validators: this.checkSkills }
  );

  checkSkills(group: FormGroup) {
    const values = Object.values(group.value);
    const isChecked = values.some((val) => val === true);
    return isChecked ? null : { skillRequired: true };
  }
  public errorMsg = (controlName: string, errorName: string) => {
    return this.registerForm.controls[controlName].hasError(errorName);
  };

  constructor(
    private API: ApiService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: any
  ) {}

  ngOnInit(): void {

    this.registerForm = this.formBuilder.group({
      FirstName: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z]+$'),
        numericValidator,
      ]),
      LastName: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z]+$'),
        numericValidator,
      ]),

      Gender: ['', Validators.required],
      Role: ['', Validators.required],
      date: ['', Validators.required],
      AboutEmployee: ['', [Validators.required, Validators.maxLength(30)]], 
      skills: this.skills, 
    });

    if (this.editData) {
      this.actionBtn = 'Edit';
      this.registerForm.controls['FirstName'].setValue(this.editData.FirstName);
      this.registerForm.controls['LastName'].setValue(this.editData.LastName);
      this.registerForm.controls['Gender'].setValue(this.editData.Gender);
      this.registerForm.controls['date'].setValue(this.editData.date);
      this.registerForm.controls['Role'].setValue(this.editData.Role);
      this.registerForm.controls['skills'].setValue(this.editData.skills);
      this.registerForm.controls['AboutEmployee'].setValue(
        this.editData.AboutEmployee
      );
    }

    function numericValidator(
      control: FormControl
    ): { [key: string]: boolean } | null {
      const isNumeric = /^[0-9]+$/.test(control.value);
      return isNumeric ? { numeric: true } : null;
    }
  }
  

  registerUser(): void {
    console.log(this.registerForm.value);
    if (!this.editData) {
      if (this.registerForm.valid) {
        this.API.postEmployee(this.registerForm.value).subscribe({
          next: (res) => {
            alert('Registration Successfully Done!!');
            this.registerForm.reset();
            this.dialogRef.close('Register');
          },
          error: () => {
            alert('Error while registration');
          },
        });
      }
    } else {
      this.updateEmployee();
    }

    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }
  updateEmployee() {
    this.API.putEmployee(this.registerForm.value, this.editData.id).subscribe({
      next: (res) => {
        alert('Employee details updated!!');
        this.registerForm.reset();
        this.dialogRef.close('edit');
      },
      error: () => {
        alert('Error');
      },
    });
  }
}
