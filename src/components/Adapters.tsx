import { errorReplacer } from "@/utils";
import { AppleFilled, InfoCircleOutlined, RetweetOutlined, StarFilled } from "@ant-design/icons";
import { Button, Progress, Space, Table, Tag, Tooltip } from "antd";
import { useCallback, useEffect, useState } from "react";
import type { Data } from "../types";
import Descriptions from "./Descriptions";
import ErrorAlert from "./ErrorAlert";
import { TemperatureFromC, TemperatureFromTenthK } from "./Temperature";

function useAdapters() {
  const [error, setError] = useState<{ message: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<Data>();

  const refetch = useCallback(async () => {
    try {
      setData(undefined);
      setError(undefined);
      setLoading(true);
      const response = await fetch('/api/adapters');
      console.log(response.ok);
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.log(error);
      setError(new Error(`${Error.isError(error) ? error.message : JSON.stringify(error, errorReplacer())}`));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return {
    adapters: data?.AppleRawAdapterDetails, data, error, loading, refetch
  };
}

export function Adapters() {
  const { adapters, data, error, loading, refetch } = useAdapters();

  const adapterCount = adapters?.length ?? 0;

  const numberFormat = new Intl.NumberFormat(undefined, {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const numberFormat2 = new Intl.NumberFormat(undefined, {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  const percentFormat = new Intl.NumberFormat(undefined, {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  function formatNumber(number: number): string {
    return numberFormat.format(number);
  }

  function formatPercent(number: number): string {
    return percentFormat.format(number);
  }

  const bestAdapterIndex = data?.BestAdapterIndex;

  console.log({ adapters, data, error, loading });

  return <>
    <Space style={{ marginBottom: '.5rem' }}>
      <span style={{ fontWeight: 800, fontSize: 18 }}>MacBook Power Details</span>
      <Button icon={<RetweetOutlined />} loading={loading} onClick={async () => await refetch()} />
    </Space>
    {error && <ErrorAlert error={error} message="An error has occurred. Is the app running?" />}

    {data && (
      <Descriptions title="Battery Info" items={
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
                <span>({numberFormat.format(data.AppleRawMaxCapacity / 1000)} of {numberFormat.format(data.NominalChargeCapacity / 1000)} Ah)</span>
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
            value: data.BatteryData.CellVoltage.map((v, index) => <Tag key={index}>{numberFormat2.format(v / 1_000)}V</Tag>)
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
    )}

    {data && (
      <Table
        size="small"
        title={() => 'Adapters'}
        dataSource={adapters}
        loading={loading}
        locale={{
          emptyText: `Found ${adapterCount.toLocaleString()} power adapter${adapterCount !== 1 ? "s" : ""
            }${adapterCount > 0 ? ":" : ""}`
        }}
        pagination={false}
        rowKey="AdapterID"
        style={{ marginTop: '.5rem' }}
        columns={[
          {
            render: (_value, _adapter, index) => index === bestAdapterIndex ? <StarFilled title="Best" /> : ''
          },
          {
            dataIndex: 'Manufacturer',
            title: 'Manufacturer',
            render: (manufacturer?: string) =>
              manufacturer?.startsWith('Apple') ?
                <Space><AppleFilled /><span>{manufacturer}</span></Space> :
                manufacturer
          },
          {
            dataIndex: 'Name',
            title: 'Name'
          },
          {
            dataIndex: 'Description',
            title: 'Description'
          },
          {
            title: 'Voltage',
            align: 'right',
            render: (_, adapter) => {
              if (adapter.UsbHvcMenu.length < 2) {
                return `${formatNumber(adapter.AdapterVoltage / 1_000)}V`;
              }

              return <ul style={{ listStyleType: 'none', margin: 0, padding: 0 }}>
                {adapter.UsbHvcMenu.map(mode =>
                  <li key={mode.Index}>
                    {adapter.UsbHvcHvcIndex === mode.Index ? <StarFilled /> : ''}
                    {formatNumber((mode.MaxVoltage ?? 0) / 1000)}V
                  </li>)}
              </ul>;
            }
          },
          {
            title: 'Current',
            align: 'right',
            render: (_, adapter) => {
              if (adapter.UsbHvcMenu.length < 2) {
                return `${formatNumber(adapter.Current / 1_000)}A`;
              }

              return <ul style={{ listStyleType: 'none', margin: 0, padding: 0 }}>
                {adapter.UsbHvcMenu.map(mode =>
                  <li key={mode.Index}>
                    {adapter.UsbHvcHvcIndex === mode.Index ? <StarFilled /> : ''}
                    {formatNumber((mode.MaxCurrent ?? 0) / 1000)}A
                  </li>)}
              </ul>;
            }
          },
          {
            title: 'Power',
            align: 'right',
            render: (_, adapter) => {
              if (adapter.UsbHvcMenu.length < 2) {
                return `${formatNumber(adapter.Watts / 1_000)}W`;
              }

              return <ul style={{ listStyleType: 'none', margin: 0, padding: 0 }}>
                {adapter.UsbHvcMenu.map(mode => {
                  const { MaxVoltage, MaxCurrent } = mode;

                  if (!MaxCurrent || !MaxVoltage) return "";

                  const volts = MaxVoltage / 1000;
                  const amps = MaxCurrent / 1000;
                  const watts = volts * amps;

                  return (
                    <li key={mode.Index}>
                      {adapter.UsbHvcHvcIndex === mode.Index ? <StarFilled /> : ''}
                      {formatNumber(watts)}W
                    </li>);
                })}
              </ul>;
            }
          }
        ]}
      />
    )}
  </>;
}