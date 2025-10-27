import { errorReplacer } from "@/utils";
import { RetweetOutlined } from "@ant-design/icons";
import { Button, Card } from "antd";
import { useCallback, useEffect, useState } from "react";
import Descriptions from "./Descriptions";
import ErrorAlert from "./ErrorAlert";

function useData(route: string) {
  const [error, setError] = useState<{ message: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<{ label: string; value: string }[]>();

  const refetch = useCallback(async () => {
    try {
      setError(undefined);
      setLoading(true);
      const response = await fetch(`/api/system/${route}`);
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
    data, error, loading, refetch
  };
}

export function InfoCard({ title, route }: { title: string, route: string }) {
  const { data, error, loading, refetch } = useData(route);

  console.log({ data, error, loading });

  return (
    <Card
      size="small"
      title={title}
      extra={
        <Button
          size="small"
          icon={<RetweetOutlined />}
          onClick={async () => await refetch()} />
      }
    >
      {error && <ErrorAlert error={error} />}
      {data && (
        <Descriptions items={data} />
      )}
    </Card>
  );
}