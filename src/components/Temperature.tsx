import { Tag } from 'antd';

const numberFormat = new Intl.NumberFormat(undefined, {
  style: "decimal",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function TemperatureFromTenthK({ value }: { value: number }) {
  const k = value / 10;

  return <TemperatureFromK value={k} />;
}

export function TemperatureFromK({ value }: { value: number }) {
  const k = value;
  const c = k - 273.15;

  return <TemperatureFromC value={c} />
}

export function TemperatureFromC({ value }: { value: number }) {
  const c = value;
  const f = c * 1.8 + 32;

  return (
    <>
      <Tag>{numberFormat.format(f)}°F</Tag>
      <Tag>{numberFormat.format(c)}°C</Tag>
    </>
  );
}