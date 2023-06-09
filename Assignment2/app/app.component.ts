import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from './services/api.service';
import { faSearch } from '@fortawesome/free-solid-svg-icons';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Assign2';
  faSearch = faSearch;
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [
    'FirstName',
    'LastName',
    'Gender',
    'skills',
    'date',
    'Role',
    'AboutEmployee',
    'action',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort = new MatSort();

  getSkillsList(skills: any): string {
    const skillNames = Object.keys(skills).filter((key) => skills[key]);
    return skillNames.join(', ');
  }

  constructor(private dialog: MatDialog, private API: ApiService) {}

  ngOnInit(): void {
    this.getAllRegisters();
  }

  openDialog() {
    this.dialog
      .open(DialogComponent, {
        width: '40%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'Register') {
          this.getAllRegisters();
        }
      });
  }

  getAllRegisters() {
    this.API.getEmployee().subscribe({
      next: (res) => {
        console.log(res);
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator!;
        this.dataSource.sort = this.sort!;
      },
      error: (err) => {
        alert('Error while fetching the Register');
      },
    });
  }

  deleteEmployee(id: number) {
    this.API.deleteEmployee(id).subscribe({
      next: (res) => {
        alert('Employee Details Deleted Successfully');
        this.getAllRegisters();
      },
      error: () => {
        alert('Error while deleting the Employee Details!!');
      },
    });
  }

  editEmployee(row: any) {
    this.dialog
      .open(DialogComponent, {
        width: '40%',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'edit') {
          this.getAllRegisters();
        }
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
