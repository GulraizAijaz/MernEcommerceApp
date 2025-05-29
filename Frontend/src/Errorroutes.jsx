import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occured</p>
      <p>
        <b>{error.statusText || error.message}</b>
      </p>
    </div>
  );
} 