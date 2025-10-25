import { errorReplacer } from "@/utils";
import { RetweetOutlined } from "@ant-design/icons";
import { Button, Card } from "antd";
import { useCallback, useEffect, useState } from "react";
import ErrorAlert from "./ErrorAlert";

function useSystemData() {
  const [error, setError] = useState<{ message: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<string>();

  const refetch = useCallback(async () => {
    try {
      setError(undefined);
      setLoading(true);
      const response = await fetch('/api/system');
      console.log(response.ok);
      const data = await response.text()
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
    data, error, loading, refetch
  };
}

export function SystemInfo() {
  const { data, error, loading, refetch } = useSystemData();

  console.log({ data, error, loading });

  return (
    <Card
      size="small"
      title="System Information"
      extra={
        <Button
          size="small"
          icon={<RetweetOutlined />}
          onClick={async () => await refetch()} />
      }
    >
      {error && <ErrorAlert error={error} />}
      {data && (
        <pre style={{ fontSize: 12 }}>{data}</pre>
      )}
    </Card>
  );
}