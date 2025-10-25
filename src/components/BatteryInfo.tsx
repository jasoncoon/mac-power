import type { PowerData } from "@/types";
import { formatDecimal, formatNumber, formatPercent } from "@/utils";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Progress, Tag, Tooltip } from "antd";
import Descriptions from "./Descriptions";
import { TemperatureFromC, TemperatureFromTenthK } from "./Temperature";

export default function BatteryInfo({ data }: { data?: PowerData }) {

  return data && (
    <Descriptions items={
      [
        {
          label: 'Charge',
          value: <Progress percent={data.CurrentCapacity} size='small'
            style={{ maxWidth: 240 }}
            strokeColor={`hsl(${(data.CurrentCapacity / 100 * 120)} 100 50)`} />
        },
        {
          label: 'Capacity',
          value:
            <Progress
              format={(percent) => formatPercent((percent ?? 0) / 100)}
              percent={(data.AppleRawMaxCapacity / data.NominalChargeCapacity) * 100} size='small'
              style={{ maxWidth: 240 }}
              strokeColor={`hsl(${(data.CurrentCapacity / 100 * 120)} 100 50)`} />
        },
        {
          key: 'capacity2',
          value:
            <>
              <span>({formatNumber(data.AppleRawMaxCapacity / 1000)} of {formatNumber(data.NominalChargeCapacity / 1000)} Ah)</span>
              <Tooltip title="This is a measure of battery capacity relative to when it was new. Lower capacity may result in fewer hours of usage between charges.">
                <InfoCircleOutlined style={{ marginLeft: '.5rem' }} />
              </Tooltip>
            </>
        },
        {
          label: 'Charge Cycles',
          value: data.BatteryData.CycleCount.toLocaleString()
        },
        {
          label: 'Cell Voltage',
          value: data.BatteryData.CellVoltage.map((v, index) => <Tag key={index}>{formatDecimal(v / 1_000)}V</Tag>)
        },
        {
          label: 'Temperature',
          value: <TemperatureFromTenthK value={data.Temperature}></TemperatureFromTenthK>
        },
        {
          label: 'Minimum',
          value: <TemperatureFromC value={data.BatteryData.LifetimeData.MinimumTemperature} />
        },
        {
          label: 'Average',
          value: <TemperatureFromC value={data.BatteryData.LifetimeData.AverageTemperature / 10} />
        },
        {
          label: 'Maximum',
          value: <TemperatureFromC value={data.BatteryData.LifetimeData.MaximumTemperature} />
        },
      ]
    } />
  );
}