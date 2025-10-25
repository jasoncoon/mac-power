import { Alert } from 'antd';

export default function ErrorAlert(props: { error: unknown; message?: string; description?: string }) {
  const { description: descriptionProp, error, message: messageProp } = props;

  console.log({ error, messageProp, descriptionProp });

  if (!error || !(error instanceof Error)) {
    return null;
  }

  const description: string = descriptionProp || error.message;
  const message: string = messageProp || 'An error has occurred.';

  return <Alert message={message} description={description} type="error" />;
}
