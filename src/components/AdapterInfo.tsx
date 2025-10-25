import { formatNumber } from "@/utils";
import { AppleFilled, StarFilled } from "@ant-design/icons";
import { Space, Table } from "antd";
import type { PowerData } from "../types";

export function AdapterInfo({ data, loading }: { data?: PowerData, loading: boolean }) {
  const adapters = data?.AppleRawAdapterDetails;

  const adapterCount = adapters?.length ?? 0;

  const bestAdapterIndex = data?.BestAdapterIndex;

  return data && (
    <Table
      size="small"
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
  );
}