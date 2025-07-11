import {AfterViewInit,Component,inject,Input,OnChanges,OnDestroy,PLATFORM_ID,SimpleChanges,ViewChild
} from '@angular/core';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventContentArg } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { STATUS_COLOR_MAP, TYPE_LABEL_MAP } from '../../calender_config';
import { ReleaseData } from '../release.model';

@Component({
  selector: 'app-calender',
  standalone: true,
  imports: [FullCalendarModule, CommonModule],
  templateUrl: './calender.component.html',
  styleUrl: './calender.component.css'
})

export class CalenderComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() selectedRelease: ReleaseData | null = null;

  @Input() statusColorMap: Record<string, string> = STATUS_COLOR_MAP;
  @Input() typeLabelMap: Record<string, { short: string; class: string }> = TYPE_LABEL_MAP;
  @Input() locale = 'en-US';

  @Input() calendarPlugins = [interactionPlugin, dayGridPlugin];
  @Input() calendarOptionsOverrides: Partial<CalendarOptions> = {};

  @ViewChild('calendarRef', { static: false }) calendarComponent?: FullCalendarComponent;
  private timeoutId?: ReturnType<typeof setTimeout>;


  currentMonth = '';
  isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    headerToolbar: false,
    editable: true,
    selectable: true,
    plugins: this.calendarPlugins,
    events: [],
    eventContent: this.renderEventContent.bind(this),
    ...this.calendarOptionsOverrides,
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedRelease'] && this.selectedRelease) {
      this.updateEventsFromRelease(this.selectedRelease);
    }

    if (changes['calendarPlugins'] || changes['calendarOptionsOverrides']) {
      this.calendarOptions = {
        ...this.calendarOptions,
        plugins: this.calendarPlugins,
        ...this.calendarOptionsOverrides,
      };
    }
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      // Use setTimeout to defer update to avoid ExpressionChangedAfterItHasBeenCheckedError
      this.timeoutId = setTimeout(() => {
        this.updateCurrentMonth();
        if (this.selectedRelease) {
          this.updateEventsFromRelease(this.selectedRelease);
        }
      });
    }
  }

  ngOnDestroy() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
  
 
  renderEventContent(arg: EventContentArg) {
    const versionCode = arg.event.title;
    const type = arg.event.extendedProps['type'];
    const label = this.typeLabelMap[type];
    const labelHtml = label ? `<span class="legend-label ${label.class}">${label.short}</span>` : '';

    return {
      html: `
        <div class="d-flex align-items-center gap-1">
          ${labelHtml}
          <span>${versionCode}</span>
        </div>
      `,
    };
  }

  goToPrevMonth() {
    const calendarApi = this.calendarComponent?.getApi();
    calendarApi?.prev();
    this.updateCurrentMonth();
  }

  goToNextMonth() {
    const calendarApi = this.calendarComponent?.getApi();
    calendarApi?.next();
    this.updateCurrentMonth();
  }

  updateCurrentMonth() {
    const calendarApi = this.calendarComponent?.getApi();
    const date = calendarApi?.getDate();
    this.currentMonth = date?.toLocaleString(this.locale, { month: 'long' }) || '';
  }

  getColorByStatus(status: string): string {
    return this.statusColorMap[status] || this.statusColorMap['default'] || '#0d6efd';
  }

  getStatuses(): string[] {
    const set = new Set<string>();
    this.selectedRelease?.releaseTypes.forEach((t) => set.add(t.releaseTypeStatus));
    return Array.from(set);
  }

  getTypes(): string[] {
    const set = new Set<string>();
    this.selectedRelease?.releaseTypes.forEach((t) => set.add(t.type));
    return Array.from(set);
  }

  formatDateToYMD(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  parseDate(dateStr: string): string | undefined {
    const parsed = Date.parse(dateStr);
    if (isNaN(parsed)) {
      console.warn(`Invalid date: ${dateStr}`);
      return undefined;
    }
    return this.formatDateToYMD(new Date(parsed));
  }

  updateEventsFromRelease(release: ReleaseData) {
    const calendarApi = this.calendarComponent?.getApi();

    const events = release.releaseTypes
      .map((type) => {
        const start = this.parseDate(type.startDate);
        let end = type.endDate ? this.parseDate(type.endDate) : undefined;

        if (end) {
          const endDate = new Date(end);
          endDate.setDate(endDate.getDate() + 1);
          end = this.formatDateToYMD(endDate);
        }

        const color = this.getColorByStatus(type.releaseTypeStatus);

        return start
          ? {
              title: type.versionCode,
              start,
              end,
              color,
              extendedProps: {
                type: type.type,
              },
            }
          : null;
      })
      .filter((e) => e !== null);

    if (calendarApi) {
      calendarApi.removeAllEvents();

      const firstValidType = release.releaseTypes.find((rt) => this.parseDate(rt.startDate));
      const targetDateStr = firstValidType ? this.parseDate(firstValidType.startDate) : null;
      if (targetDateStr) {
        calendarApi.gotoDate(targetDateStr);
        this.updateCurrentMonth();
      }

      events.forEach((event) => calendarApi.addEvent(event!));
    }
  }

  getMajorMinorVersion(version?: string): string {
    if (!version) return '';
    const parts = version.split('.');
    return parts.length >= 2 ? `${parts[0]}.${parts[1]}` : version;
  }
}
