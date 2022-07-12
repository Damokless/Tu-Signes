import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileValidators } from 'ngx-file-drag-drop';

@Component({
  selector: 'app-upload-form',
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.scss']
})
export class UploadFormComponent implements OnInit {
  
  constructor(private _http: HttpClient, private _formBuilder: FormBuilder, private _snackBar: MatSnackBar) {}
  
  fileName = '';
  isPdf = false;
  file: File | string = '';
  recipients: string[] = [];
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  
  uploadFileForm = new FormGroup({
    file: new FormControl<File | string>('', [FileValidators.required, FileValidators.maxFileCount(1), FileValidators.maxTotalSize(10485760)]),
    recipients: new FormControl<string[]>([], [Validators.required, Validators.email])
  })
  
  ngOnInit(): void {
  }
  
  /**
  * If the value of the input is valid, add it to the array of recipients. If not, display a snackbar.
  */
  addRecipient(event: any) {
    if(event.value && !this.uploadFileForm.controls.recipients.invalid) {
      this.recipients.push(event.value.trim())
    } else {
      this._snackBar.open("L'adresse mail est invalide", "Fermer", { horizontalPosition: "right", verticalPosition: "top", duration: 5000 });
    }
    
    if (event.input) {
      event.input.value = "";
    }
  }
  
  /**
  * It removes the recipient from the recipients array if the recipient is not equal to the email passed
  * in.
  */
  removeRecipient(email: string) {
    this.recipients = this.recipients.filter(recipient => recipient !== email)
  }
  
  onFileUpload(files: File[]) {    
    const file = files[0]
    if (file) {
      if(file.type === 'application/pdf') {        
        this.fileName = file.name
        this.file = file
        this.isPdf = true
      } else {
        this.file = ''
        this.fileName = ''
        this.isPdf = false
        this._snackBar.open("Le fichier doit être un PDF", "Fermer", { horizontalPosition: "right", verticalPosition: "top", duration: 5000});
      }
    } 
  }
  
  /**
  * If the form is valid, for each recipient, create a new FormData object, append the recipient and the
  * file to it, and send it to the server.
  */
  onSubmit() {    
    if (this.uploadFileForm.controls.recipients.value !== null && this.uploadFileForm.controls.file.value !== null && this.uploadFileForm.valid && this.isPdf) {
      const body = new FormData();
      for (const recipient of this.recipients) {
        body.append('recipients[]', recipient); 
      }
      body.append('file', this.file);
      const upload$ = this._http.post(`http://localhost:3000/file/upload`, body);
      
      upload$.subscribe();
    } else {
      this._snackBar.open("Impossible d'envoyer", "Fermer", { horizontalPosition: "right", verticalPosition: "top", duration: 5000});
    }
  }
  
}
