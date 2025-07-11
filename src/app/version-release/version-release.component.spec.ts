import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionReleaseComponent } from './version-release.component';

describe('VersionReleaseComponent', () => {
  let component: VersionReleaseComponent;
  let fixture: ComponentFixture<VersionReleaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VersionReleaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VersionReleaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
