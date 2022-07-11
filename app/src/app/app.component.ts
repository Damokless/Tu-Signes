import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'tu-signes';

  fileName = '';

  onFileSelected(event: any) {

      const file:File = event.target.files[0];

      if (file) {

          this.fileName = file.name;

      }
  }
}
