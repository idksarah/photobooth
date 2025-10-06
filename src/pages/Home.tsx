import React, {useRef } from "react";
import photobooth from "./../assets/photobooth.png";

import Sidebar from "../components/Sidebar";

export default function Home() {
    let streaming = false;

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const photoRef = useRef<HTMLImageElement>(null);

    const width = 320;
    let height = 0;

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current && photoRef.current) {
            console.log("starting stream");
            
            streaming = true;
            videoRef.current.muted = true;
            videoRef.current.play();
        }
    };
    
    return (
        <div className="home">
            <section>
                <Sidebar></Sidebar>
            </section>
            <section className="main">
                <h1>goonbooth</h1>
                <img id="photobooth" src={photobooth}></img>           
            </section>
        </div>
    )
}