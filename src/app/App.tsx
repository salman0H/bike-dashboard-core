import { RouterProvider } from "react-router";
import { router } from "./routes";
import { StationProvider } from "../context/StationContext"

export default function App() {
  return (
    <StationProvider>
       <RouterProvider router={router} />
    </StationProvider>
  )
}
