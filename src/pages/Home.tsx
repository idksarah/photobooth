// import React, {useRef } from "react";
import photobooth from "./../assets/photobooth.png";
import example from "./../assets/example.jpg";

import Sidebar from "../components/Sidebar";

export default function Home() {
    // let streaming = false;

    // const videoRef = useRef<HTMLVideoElement>(null);
    // const canvasRef = useRef<HTMLCanvasElement>(null);
    // const photoRef = useRef<HTMLImageElement>(null);

    // const width = 320;
    // let height = 0;

    const goToPhotobooth = () => {
        window.location.href = "/photobooth";
    }
    
    return (
        <div className="home">
            <section>
                <Sidebar></Sidebar>
            </section>
            <section className="main">
                <h1>goonbooth</h1>
                <section style={{display: "flex", gap: "2em", alignItems: "center"}}>
                    <img id="example" src={example}></img>
                    <img id="photobooth" src={photobooth} onClick={goToPhotobooth}></img>
                </section>           
            </section>
        </div>
    )
}