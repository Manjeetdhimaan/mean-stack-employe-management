import { Injectable } from '@angular/core';
import * as moment from 'moment-timezone';
// import { HelperSharableService } from '../helperService/helper-sharable.service';
// import { LocalStorageService } from '../local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class FormatTimeService {
  zone: String = '';
  businessId: any;

  constructor(
    // private localStorageService: LocalStorageService,
    // private sharedHelperService: HelperSharableService
  ) {
    // this.zone = this.localStorageService.readStorage('defaultClinic')?.timezone;
    // if (!this.zone) {
    //   this.getClinicTimeZone();
    // }
  }

//   getClinicTimeZone() {
//     this.sharedHelperService.getDefaultCinic().then((data) => {
//       console.log(data);
//       this.localStorageService.storeItem('defaultClinic', data);
//     });
//   }

  // getClinicTimeZone() {
  //   this.businessId = this.clinicService
  //     .getCinicOptimized(723)
  //     .subscribe((data: any) => {
  //       console.log(data);
  //     });
  // }

  formatTime(time: any, timezone?: any) {
    var input: any = new Date(time);
    var format = 'MMM D YYYY h:mm A'; // must match the input
    var zone = timezone ? timezone : this.zone;
    var m = moment.tz(input, format, zone);
    time = m.format(format);
    return time;
  }

  formatBookingHistoryTime(time: any, timezone?: any) {
    var input: any = new Date(time);

    var format = 'MMM D YYYY h:mm A'; // must match the input
    var zone = timezone ? timezone : this.zone;
    var m = moment.tz(input, format, zone);
    m.utc();
    time = m.format(format);
    return time;
  }

  /// special method for only lead time dont use it anywhere else

  formatTimeZone(time: any, timezone?: any) {
    var input: any = new Date(time);
    input.setHours(input.getHours() + 5);
    input.setMinutes(input.getMinutes() + 30);
    var format = 'hh:mm A'; // must match the input
    var zone = timezone ? timezone : this.zone;
    var m = moment.tz(input, format, zone);
    time = m.format(format);
    return time;
  }

  formatTimeZone1(time: any, timezone?: any) {
    var input: any = time;
    input.setHours(input.getHours() + 5);
    input.setMinutes(input.getMinutes() + 30);
    var format = 'hh:mm A'; // must match the input
    var zone = timezone ? timezone : this.zone;
    var m = moment.tz(input, format, zone);
    time = m.format(format);
    return time;
  }

  // To convert 12 hours to 24 hours with parseInt
  convertTime12to24 = (time12h: any) => {
    const [time, modifier] = time12h.split(' ');
    // eslint-disable-next-line prefer-const
    let [hours, minutes] = time.split(':');
    if (hours === '12') {
      hours = '00';
    }

    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }
    return `${hours}:${minutes}`;
  };

  formatTimeslot(date: any, timezone: any) {
    //console.log(date, moment(date).format("hh:mm A"));
    var input: any = new Date(date);
    var fmt = 'hh:mm A'; // must match the input
    var zone = timezone;
    var m = moment.tz(input, fmt, zone);
    // convert it to utc
    m.utc();
    // format it for output
    date = m.format(fmt);
    return date;
  }
}
