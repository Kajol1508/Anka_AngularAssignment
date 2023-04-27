import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

interface Role {
  value: string;
  viewData: string;
}

@Component({
  selector: "app-registration-form",
  templateUrl: "./registration-form.component.html",
  styleUrls: ["./registration-form.component.css"],
})
export class SampleFormComponent implements OnInit {
  sampleFormGroup!: FormGroup;
  isFormSubmitted: boolean = false;
  faError = faCircleExclamation;

  roles: Role[] = [
    { value: "developer", viewData: "Developer" },
    { value: "tester", viewData: "Tester" },
    { value: "manager", viewData: "Manager" },
    { value: "team leader", viewData: "Team Leader" },
  ];

  skills = ["Java", "NodeJS", "React", "Angular", "Android"];

  // constructor(private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.sampleFormGroup = new FormGroup({
      firstName: new FormControl("", [
        Validators.pattern(/^[A-Z]+[a-zA-Z]*$/),

        // Validators.pattern(/^[a-zA-Z_-]{1,100}$/),
        Validators.required,
      ]),
      lastName: new FormControl("", [
        Validators.pattern(/^[A-Z]+[a-zA-Z]*$/),
        Validators.required,
      ]),
      role: new FormControl("", [Validators.required]),
      date: new FormControl("", [Validators.required]),
      gender: new FormControl(""),
      about: new FormControl("", [
        Validators.required,
        Validators.maxLength(300),
      ]),
    });
  }

  public errorMsg = (controlName: string, errorName: string) => {
    return this.sampleFormGroup.controls[controlName].hasError(errorName);
  };

  onSubmit() {
    console.log(this.sampleFormGroup.value);
  }
}
