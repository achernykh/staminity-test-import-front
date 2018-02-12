import * as angular from "angular";
window['angular'] = angular;
import { StorageService } from "./storage/storage.service";
import { module } from 'angular';

export const CoreMobileExport = angular.module('staminity.core-mobile-export', [])
    .service("StorageService", StorageService)
    .name;