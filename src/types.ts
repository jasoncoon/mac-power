export interface Data {
  AppleRawAdapterDetails: Adapter[];
  AppleRawBatteryVoltage: number;
  AppleRawCurrentCapacity: number;
  AppleRawMaxCapacity: number;
  BestAdapterIndex: number;
  CurrentCapacity: number;
  BatteryData: {
    CellVoltage: number[];
    CycleCount: number;
    DesignCapacity: number;
    LifetimeData: {
      AverageTemperature: number;
      MaximumChargeCurrent: number;
      MaximumDischargeCurrent: number;
      MaximumPackVoltage: number;
      MaximumTemperature: number;
      MinimumPackVoltage: number;
      MinimumTemperature: number;
      TotalOperatingTime: number;
      MaxCapacity: number;
    };
    ManufactureDate: number;
    MaxCapacity: number;
    Serial: string;
    StateOfCharge: number;
    Voltage: number;
  };
  ExternalConnected: boolean;
  NominalChargeCapacity: number;
  Temperature: number;
}

export interface Adapter {
  AdapterVoltage: number;
  Current: number;
  Description: string;
  Manufacturer?: string;
  Name?: string;
  UsbHvcHvcIndex: number;
  UsbHvcMenu: Mode[];
  Watts: number;
}

export interface Mode {
  Index: number;
  MaxCurrent?: number;
  MaxVoltage?: number;
}

export interface Detail {
  name: string;
  value?: string;
}
