"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpSensorsAndSwitchesPlatform = void 0;
const platformAccessory_1 = require("./platformAccessory");
const settings_1 = require("./settings");
class HttpSensorsAndSwitchesPlatform {
    constructor(log, config, api) {
        this.log = log;
        this.config = config;
        this.api = api;
        this.accessories = [];
        this.Service = this.api.hap.Service;
        this.Characteristic = this.api.hap.Characteristic;
        this.log.info('HttpSensorsAndSwitchesPlatform initialized.');
        this.api.on('didFinishLaunching', () => {
            this.log.info('Executed didFinishLaunching callback');
            this.discoverDevices();
        });
    }
    configureAccessory(accessory) {
        this.log.info('Loading accessory from cache:', accessory.displayName);
        this.accessories.push(accessory);
    }
    discoverDevices() {
        for (const device of this.config.devices) {
            const uuid = this.api.hap.uuid.generate(device.deviceID);
            const existingAccessory = this.accessories.find(acc => acc.UUID === uuid);
            if (existingAccessory) {
                this.log.info('Restoring existing accessory from cache:', existingAccessory.displayName);
                new platformAccessory_1.HttpSwitchAccessory(this, existingAccessory, device);
            }
            else {
                this.log.info('Adding new accessory:', device.deviceName);
                const accessory = new this.api.platformAccessory(device.deviceName, uuid);
                accessory.context.device = device;
                new platformAccessory_1.HttpSwitchAccessory(this, accessory, device);
                this.api.registerPlatformAccessories(settings_1.PLUGIN_NAME, settings_1.PLATFORM_NAME, [accessory]);
            }
        }
    }
}
exports.HttpSensorsAndSwitchesPlatform = HttpSensorsAndSwitchesPlatform;
