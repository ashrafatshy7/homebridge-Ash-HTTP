import { API, DynamicPlatformPlugin, Logger, PlatformAccessory, PlatformConfig, Service, Characteristic } from 'homebridge';
import { HttpSwitchAccessory } from './platformAccessory';
import {PLATFORM_NAME, PLUGIN_NAME} from './settings';

export class HttpSensorsAndSwitchesPlatform implements DynamicPlatformPlugin {
  public readonly Service: typeof Service;
  public readonly Characteristic: typeof Characteristic;
  public readonly accessories: PlatformAccessory[] = [];

  constructor(
    public readonly log: Logger,
    public readonly config: PlatformConfig,
    public readonly api: API,
  ) {
    this.Service = this.api.hap.Service;
    this.Characteristic = this.api.hap.Characteristic;

    this.log.info('HttpSensorsAndSwitchesPlatform initialized.');

    this.api.on('didFinishLaunching', () => {
      this.log.info('Executed didFinishLaunching callback');
      this.discoverDevices();
    });
  }

  configureAccessory(accessory: PlatformAccessory) {
    this.log.info('Loading accessory from cache:', accessory.displayName);
    this.accessories.push(accessory);
  }

  discoverDevices() {
    for (const device of this.config.devices) {
      const uuid = this.api.hap.uuid.generate(device.deviceID);
      const existingAccessory = this.accessories.find(acc => acc.UUID === uuid);

      if (existingAccessory) {
        this.log.info('Restoring existing accessory from cache:', existingAccessory.displayName);
        new HttpSwitchAccessory(this, existingAccessory, device);
      } else {
        this.log.info('Adding new accessory:', device.deviceName);
        const accessory = new this.api.platformAccessory(device.deviceName, uuid);
        accessory.context.device = device;
        new HttpSwitchAccessory(this, accessory, device);
        this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);
      }
    }
  }
}
