import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'tu-signes';

  fileName = '';
  isPdf:boolean = false;

  onFileSelected(event:any) {

      const file:File = event.target.files[0];

      if (file) {

          this.fileName = file.name;
          this.isPdf = file.type === "application/pdf" ? false : true
      }
  }
}
