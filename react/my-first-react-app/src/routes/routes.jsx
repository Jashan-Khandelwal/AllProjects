import App from "../App";
import Profile from "../Profile";
import ErrorPage from "../ErrorPage";
import FetchGetRequest from "../fetchgetreq";
import FetchDemo from "../FetchDemo";
const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: "profile/:name",
    element: <Profile />,
  },
  {
    path: "fetch-get-request",
    element: <FetchDemo />,
  },
];

export default routes;
