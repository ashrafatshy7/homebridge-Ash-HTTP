"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpSwitchAccessory = void 0;
const axios_1 = __importDefault(require("axios"));
class HttpSwitchAccessory {
    constructor(platform, accessory, device) {
        this.platform = platform;
        this.accessory = accessory;
        this.device = device;
        this.service = this.accessory.getService(this.platform.Service.Switch) ||
            this.accessory.addService(this.platform.Service.Switch);
        this.service.setCharacteristic(this.platform.Characteristic.Name, device.deviceName);
        this.service.getCharacteristic(this.platform.Characteristic.On)
            .onSet(this.setOn.bind(this));
    }
    async setOn(value) {
        const url = value ? this.device.urlON : this.device.urlOFF;
        try {
            await axios_1.default.get(url);
            this.platform.log.info(`Set ${this.device.deviceName} to ${value ? 'ON' : 'OFF'}`);
        }
        catch (error) {
            this.platform.log.error(`Failed to set ${this.device.deviceName} to ${value ? 'ON' : 'OFF'}`, error);
        }
    }
}
exports.HttpSwitchAccessory = HttpSwitchAccessory;
