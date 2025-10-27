import type { PowerData } from "@/types";
import { errorReplacer } from "@/utils";
import { RetweetOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row, Space } from "antd";
import { useCallback, useEffect, useState } from "react";
import { AdapterInfo } from "./AdapterInfo";
import BatteryInfo from "./BatteryInfo";
import ErrorAlert from "./ErrorAlert";
import { InfoCard } from "./InfoCard";

export function Main() {
  function usePowerData() {
    const [error, setError] = useState<{ message: string }>();
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<PowerData>();

    const refetch = useCallback(async () => {
      try {
        setError(undefined);
        setLoading(true);
        const response = await fetch('/api/power');
        console.log(response.ok);
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.log(error);
        setData(undefined);
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

  const { adapters, data: powerData, error, loading, refetch } = usePowerData();

  console.log({ adapters, powerData, error, loading });

  return <>
    <Space style={{ fontWeight: 800, fontSize: 18, marginBottom: '.5rem' }}>MacBook Details
      <Button icon={<RetweetOutlined />} loading={loading} onClick={async () => await refetch()} />
    </Space>

    {error && <ErrorAlert error={error} message="An error has occurred. Is the app running?" />}

    <Row gutter={[8, 8]}>
      <Col>
        <Card
          size="small"
          title="Battery"
          extra={
            <Button
              size="small"
              icon={<RetweetOutlined />}
              onClick={async () => await refetch()} />
          }
        >
          <BatteryInfo data={powerData} />
        </Card>
      </Col>
      <Col>
        <Card
          size="small"
          title="Power Adapters"
          onClick={async () => await refetch()}
          styles={{ body: { padding: 0 } }}
          extra={
            <Button
              size="small"
              icon={<RetweetOutlined />}
              onClick={async () => await refetch()} />
          }
        >
          <AdapterInfo data={powerData} loading={loading} />
        </Card>
      </Col>
      <Col>
        <InfoCard title="System Hardware" route="hardware" />
      </Col>
      <Col>
        <InfoCard title="System Software" route="software" />
      </Col>
    </Row>
  </>;
}