import { Alert } from 'antd';

export default function ErrorAlert(props: { error: unknown; message?: string; description?: string }) {
  const { description: descriptionProp, error, message: messageProp } = props;

  if (!error || !(error instanceof Error)) {
    return null;
  }

  console.log({ error });

  const description: string = descriptionProp || error.message;
  const message: string = messageProp || 'An error has occurred.';

  return <Alert message={message} description={description} type="error" />;
}
