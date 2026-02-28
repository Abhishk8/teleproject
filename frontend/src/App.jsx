import { BrowserRouter, Routes, Route } from "react-router-dom";
import Assets from "../pages/Assets";
import AssetForm from "../pages/AssestForm";
import Dashboard from "../pages/Dashboard";
import Tasks from "../pages/Tasks";
import Workers from "../pages/Worker";
import PlanForm from "../pages/PlanForm";
import Plans from "../pages/Plans";
import Navbar from "../components/Navbar";


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />

        <Route path="/assets" element={<Assets />} />
        <Route path="/assets/new" element={<AssetForm />} />
        <Route path="/assets/:id/edit" element={<AssetForm />} />

        <Route path="/plans" element={<Plans />} />
        <Route path="/plans/new" element={<PlanForm />} />

        <Route path="/tasks" element={<Tasks />} />
        <Route path="/workers" element={<Workers />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;