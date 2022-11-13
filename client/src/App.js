import "./App.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Route, Routes } from "react-router-dom";
import { Box, CssBaseline, Typography } from "@mui/material";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import LogIn from "./pages/LogIn";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import Tree from "./pages/Tree";

function App () {
  return (
    <Box className="App">
      <CssBaseline />
      <Navbar />
      <Routes>
        <Route index element={<Home />} />
        <Route path="login" element={<LogIn />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="tree" element={<Tree />}/>
      </Routes>
    </Box>
  );
}

export default App;
