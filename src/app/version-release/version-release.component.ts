import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { ReleaseData } from '../release.model';

@Component({
  selector: 'app-version-release',
  standalone: true,
  imports: [],
  templateUrl: './version-release.component.html',
  styleUrl: './version-release.component.css'
})

export class VersionReleaseComponent implements OnInit{

  releaseData: ReleaseData[] = [];
  selectedVersion: string | null = null;
  private readonly dataUrl = 'data.json';

  @Output() releaseSelected = new EventEmitter<ReleaseData>();

  private http = inject(HttpClient);
  
  ngOnInit() {
    this.http.get<ReleaseData[]>(this.dataUrl).subscribe({
      next: (data) => {
        this.releaseData = data;
        if (this.releaseData.length > 0) {
          const firstRelease = this.releaseData[0];
          this.selectRelease(firstRelease);
        }
      },
      error: (err) => {
        console.error('Failed to load release data:', err);
      }
    });
  }

  selectRelease(release: ReleaseData) {
    this.selectedVersion = release.version;
    this.releaseSelected.emit(release);
  }

}
