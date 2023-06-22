import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { AffirmationsService } from 'src/app/private/services/affirmations.service';

@Component({
  selector: 'app-affirmations',
  templateUrl: './affirmations.component.html',
  styleUrls: ['./affirmations.component.css']
})
export class AffirmationsComponent implements OnInit, OnDestroy {


  affirmationForm!: FormGroup;
  subtitle: string = "Add new affirmation:";
  addNewBool: boolean = true;
  faPen = faPen;
  allAffirmations!: any[];
  length: number = 0;

  @ViewChild('paginator') paginator!: MatPaginator;
  pageIndex: number = 0;
  pageSize: number = 10;

  buttonText: string = "add";
  affError: boolean = false;

  existingId: number = 0;
  existingText: string = "";
  affText: string = "";
  successMessage: boolean = false;
  regExAffirmation: string = '^([a-z0-9]{1,20})(\\s[a-z0-9]{1,20})*$';
  sub: Subscription[] = [];


  constructor(private affirmationService: AffirmationsService) {
    this.affirmationForm = new FormGroup({
      textTs: new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(20), Validators.pattern(this.regExAffirmation)]),
      affTs: new FormControl("", Validators.nullValidator)

    });
  }

  ngOnInit(): void {
    let sub1 = this.affirmationService.getAffirmations().subscribe({
      next: result => {
        this.allAffirmations = result;
        this.affError = false;
        this.length = this.allAffirmations.length;
      },
      error: er => {
        console.log(er);
        this.affError = true;
      }
    });
    this.sub.push(sub1);
  }

  addAffirmation() {
    this.affText = this.affirmationForm?.get('textTs')?.value;
    this.existingId = Number(this.affirmationForm?.get('affTs')?.value);
    let aff: any;
    if (this.existingId != 0 && this.existingId) {
      this.edtiThisAffirmation(this.affText, this.existingId);
    }
    else {
      let data = {
        'affirmation': this.affText
      }
      let sub2 = this.affirmationService.addAffirmation(data).subscribe({
        next: result => {
          this.allAffirmations = result;
          this.length = result.length;
          this.affError = false;
          this.affirmationForm.reset();
          //ADD SUCCESS MESSAGE
          this.successMessage = true;
          setTimeout(() => {
            this.successMessage = false;
          }, 2000);
        },
        error: er => {
          console.log(er);
          this.affError = true;
        }
      });
      this.sub.push(sub2);
    }

  }

  addNew() {
    this.affirmationForm.reset();
    this.subtitle = "Add new quote:";
    this.buttonText = "add";
    this.addNewBool = true;
  }



  editAffirmation(element: HTMLElement) {
    this.addNewBool = false;
    this.subtitle = "Edit affirmation:";
    this.buttonText = "edit";
    this.existingId = Number(element.id);
    this.existingText = element.innerHTML;
    this.affirmationForm?.patchValue({
      textTs: this.existingText,
      affTs: this.existingId
    });
  }

  edtiThisAffirmation(text: string, id: number) {
    let data = {
      'id': id,
      'affirmation': text
    }
    let sub3 = this.affirmationService.editAffirmation(data).subscribe({
      next: result => {
        this.affError = false;
        this.allAffirmations = result;
        this.length = result.length;
        this.affirmationForm.reset();
        this.successMessage = true;
        this.addNewBool = true;
        setTimeout(() => {
          this.successMessage = false;
        }, 2000);
      },
      error: er => {
        console.log(er);
        this.affError = true;
        setTimeout(() => {
          this.affError = false;
        }, 2000);
      }
    });
    this.sub.push(sub3);

  }

  deleteAffirmation(element: HTMLElement) {
    let id = element.id;
    let affirmation = element.innerHTML;
    let data = {
      'id': id
    }

    let sub4 = this.affirmationService.deleteAffirmation(data).subscribe({
      next: result => {
        this.allAffirmations = result;
        this.length = result.length;
        this.affError = false;
        //this.successMessage="Affiramtion has been deleted";
      },
      error: er => {
        console.log(er);
        this.affError = true;
      }
    });
    this.sub.push(sub4);

  }

  ngOnDestroy() {
    if (this.sub.length > 0) {
      this.sub.forEach((subscription) => subscription.unsubscribe());
    }
  }

}
