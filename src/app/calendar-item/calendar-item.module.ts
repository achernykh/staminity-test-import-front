import { module } from "angular";
import CalendarItemActivityComponent from "./calendar-item-activity/calendar-item-activity.component";
import {_translateActivity} from "./calendar-item-activity/calendar-item-activity.translate";
import CalendarItemAthleteSelectorComponent from "./calendar-item-athlete-selector/calendar-item-athlete-selector.component";
import CalendarItemEventsComponent from "./calendar-item-events/calendar-item-events.component";
import {_events} from "./calendar-item-events/calendar-item-events.translate";
import CalendarItemMeasurementComponent from "./calendar-item-measurement/calendar-item-measurement.component";
import {_measurement} from "./calendar-item-measurement/calendar-item-measurement.translate";
import { CalendarItemRecordComponent } from "./calendar-item-record/calendar-item-record.component";
import { CalendarItemRecordConfig } from "./calendar-item-record/calendar-item-record.config";
import { _translateRecord } from "./calendar-item-record/calendar-item-record.translate";
import CalendarItemTemplateSelectorComponent from "./calendar-item-template-selector/calendar-item-template-selector.component";
import CalendarItemWizardComponent from "./calendar-item-wizard/calendar-item-wizard.component";
import {_translateWizard} from "./calendar-item-wizard/calendar-item-wizard.translate";

const CalendarItemMeasurement = module("staminity.calendar-item-measurement", [])
    .component("calendarItemActivity", CalendarItemActivityComponent)
    .component("calendarItemMeasurement", CalendarItemMeasurementComponent)
    .component("calendarItemEvents", CalendarItemEventsComponent)
    .component("calendarItemWizard", CalendarItemWizardComponent)
    .component("calendarItemAthleteSelector", CalendarItemAthleteSelectorComponent)
    .component("calendarItemTemplateSelector", CalendarItemTemplateSelectorComponent)
    .component("calendarItemRecord", CalendarItemRecordComponent)
    .constant("calendarItemRecordConfig", CalendarItemRecordConfig)
    .config(["ngQuillConfigProvider", (quill) => quill.set({ modules: {}, theme: "snow"})])
    .config(["$translateProvider", ($translateProvider) => {
        $translateProvider.translations("ru", {activity: _translateActivity.ru});
        $translateProvider.translations("en", {activity: _translateActivity.en});
        $translateProvider.translations("ru", {measurement: _measurement.ru});
        $translateProvider.translations("en", {measurement: _measurement.en});
        $translateProvider.translations("ru", {event: _events.ru});
        $translateProvider.translations("en", {event: _events.en});
        $translateProvider.translations("ru", {record: _translateRecord.ru});
        $translateProvider.translations("en", {record: _translateRecord.en});
        $translateProvider.translations("ru", {wizard: _translateWizard.ru});
        $translateProvider.translations("en", {wizard: _translateWizard.en});
    }])
    .name;

export default CalendarItemMeasurement;
