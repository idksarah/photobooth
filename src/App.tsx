import { useState } from 'react'
import './App.css'
import Sheet from './components/Sheet'
import Start from './pages/Start'
import Photobooth from './pages/Photobooth'
import Home from './pages/Home'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/photobooth" element={<Photobooth />} />
        <Route path="/start" element={<Start />} />
        <Route path="/sheet" element={<Sheet />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
