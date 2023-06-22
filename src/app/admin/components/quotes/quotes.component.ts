import { TitleCasePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { QuoteService } from 'src/app/private/services/quote.service';
import { IQuote } from 'src/app/shared/interfaces/i-quote';


@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.css'],
  providers: [TitleCasePipe]
})
export class QuotesComponent implements OnInit, OnDestroy {

  quoteError: boolean = false;
  authorError: boolean = false;
  subtitle: string = "Add new quote:";
  buttonText: string = "add";
  allQuotes!: IQuote[];
  quoteText: string = "";
  quoteAuthor: string = "";
  quoteForm: FormGroup;
  quotePattern: string = "^([A-Z][^.]*\\.)(\\s[A-Z][^.]*\\.)*$";
  authorPattern = "^[A-Za-z]+(([,.] |[ '-])[A-Za-z]+)*([.,'-]?)$";
  faPen = faPen;
  textPlaceholder: string = 'Enter new Quote';
  authorPlaceholder: string = 'Quote Author';
  quoteId = 0;
  existingId: any;
  existingText: string = '';
  existingAuthor: string = '';
  addNewBool: boolean = true;
  length: number = 0;
  successMessage: boolean = false;
  sub: Subscription[] = [];

  @ViewChild('paginator') paginator!: MatPaginator;
  pageIndex: number = 0;
  pageSize: number = 10;

  constructor(private quoteService: QuoteService, private titleCase: TitleCasePipe) {
    this.quoteForm = new FormGroup({
      textTs: new FormControl("", [Validators.required, Validators.minLength(5), Validators.maxLength(500), Validators.pattern(this.quotePattern)]),
      authorTs: new FormControl("", [Validators.minLength(2), Validators.maxLength(35), Validators.pattern(this.authorPattern)]),
      quoteIdTs: new FormControl("", Validators.nullValidator)
    })
  }

  ngOnInit(): void {
    let sub1 = this.quoteService.getAllQuotes().subscribe({
      next: result => {
        this.allQuotes = result;
        this.length = result.length;
      },
      error: err => {
        console.log(err);
        this.quoteError = true;
      },
    });
    this.sub.push(sub1);

  }




  deleteQuote(element: HTMLElement) {
    let id = { 'id': Number(element.id) };
    let sub2 = this.quoteService.deleteQuote(id).subscribe({
      next: result => {
        this.allQuotes = result;
        this.quoteForm.reset();
        this.buttonText = "add";
        this.subtitle = "Add new quote:";
      },
      error: er => {
        console.log(er);
        this.quoteError = true;
      }
    });
    this.sub.push(sub2);
  }


  addQuote() {
    this.quoteText = this.titleCase.transform(this.quoteForm?.get('textTs')?.value);
    this.quoteAuthor = this.quoteForm?.get('authorTs')?.value;
    this.quoteId = this.quoteForm?.get('quoteIdTs')?.value;
    let quote: any;

    if (this.quoteId != 0 && this.quoteId) {

      this.editExistingQuote(this.quoteText, this.quoteAuthor, this.quoteId);
    }
    else {
      if (this.quoteAuthor != '') {
        quote = {
          'quote_text': this.quoteText,
          'quote_author': this.quoteAuthor
        }
      }
      else {
        quote = {
          'quote_text': this.quoteText
        }
      }
      let sub3 = this.quoteService.addQuote(quote).subscribe({
        next: result => {
          this.allQuotes = result;
          this.quoteForm.reset();
          this.successMessage = true;
          setTimeout(() => {
            this.successMessage = false;
          }, 2000);
        },
        error: er => {
          console.log(er);
          this.quoteError = true;
        }
      });
      this.sub.push(sub3);
    }
  }



  editQuote(element: any) {
    this.addNewBool = false;
    this.subtitle = "Edit quote:";
    this.buttonText = "edit";
    this.existingId = element.id;
    this.existingText = element.quote_text;
    this.existingAuthor = element.quote_author;
    this.quoteForm?.patchValue({
      textTs: this.existingText,
      authorTs: this.existingAuthor,
      quoteIdTs: this.existingId
    });
  }

  editExistingQuote(text: string, author: string, id: number) {
    let quote = {
      'quote_text': text,
      'quote_author': author,
      'id': id
    }
    let sub4 = this.quoteService.editQuote(quote).subscribe({
      next: response => {
        this.allQuotes = response.data;
        this.quoteForm.reset();
        this.buttonText = "add";
        this.subtitle = "Add new quote:";
        this.successMessage = true;
        this.addNewBool = true;
        setTimeout(() => {
          this.successMessage = false;
        }, 2000);
      },
      error: er => {
        console.log(er);
        this.quoteError = true;
      }
    });
    this.sub.push(sub4);
  }



  addNew() {
    this.quoteForm.reset();
    this.subtitle = "Add new quote:";
    this.buttonText = "add";
    this.addNewBool = true;
  }

  ngOnDestroy() {
    if (this.sub.length > 0) {
      this.sub.forEach((subscription) => subscription.unsubscribe());
    }
  }

}
