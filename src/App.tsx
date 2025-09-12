import { useRoutes } from "react-router-dom";
import MainLayout from "./Layouts/MainLayout";
import Home from "./pages/home-page";


const App = () => {
    const routes = useRoutes([
        {
            path: "/",
            element: <MainLayout />,
            children: [
                { index: true, element: <Home /> },
                //{ path: "detail", element: <Detail /> }
            ],
        },
    ]);

    return routes;
};

export default App;

