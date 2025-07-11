import { Component} from '@angular/core';
import { CalenderComponent } from './calender/calender.component';
import { HeaderComponent } from './header/header.component';
import { VersionReleaseComponent } from './version-release/version-release.component';
import { ReleaseData } from './release.model';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CalenderComponent, HeaderComponent,VersionReleaseComponent,FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ledger';

  selectedRelease: ReleaseData | null = null;

  onReleaseSelected(release: ReleaseData) {
    this.selectedRelease = release;
  }




}
