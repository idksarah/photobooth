import { useState } from 'react'
import './App.css'
import Sheet from './Sheet'
import Start from './Start'
import Photobooth from './Photobooth'
import Home from './Home'
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
