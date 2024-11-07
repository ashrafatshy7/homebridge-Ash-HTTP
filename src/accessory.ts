import { Service, PlatformAccessory, CharacteristicValue } from 'homebridge';
import axios from 'axios';
import { HttpSensorsAndSwitchesPlatform } from './platform';

export class HttpSwitchAccessory {
  private service: Service;

  constructor(
    private readonly platform: HttpSensorsAndSwitchesPlatform,
    private readonly accessory: PlatformAccessory,
    private readonly device: any,
  ) {
    this.service = this.accessory.getService(this.platform.Service.Switch) ||
                   this.accessory.addService(this.platform.Service.Switch);

    this.service.setCharacteristic(this.platform.Characteristic.Name, device.deviceName);

    this.service.getCharacteristic(this.platform.Characteristic.On)
      .onSet(this.setOn.bind(this));
  }

  async setOn(value: CharacteristicValue) {
    const url = value ? this.device.urlON : this.device.urlOFF;
    try {
      await axios.get(url);
      this.platform.log.info(`Set ${this.device.deviceName} to ${value ? 'ON' : 'OFF'}`);
    } catch (error) {
      this.platform.log.error(`Failed to set ${this.device.deviceName} to ${value ? 'ON' : 'OFF'}`, error);
    }
  }
}
