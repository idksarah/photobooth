import {useEffect, useRef, useState} from "react";
import photobooth from "./../assets/photobooth.png";

type StatusType = "idle" | "recording" | "paused";

export default function Photobooth() {
    const [status, setStatus] = useState<StatusType>("idle");
    const [recorder, setRecorder] = useState<MediaRecorder|null>(null);
    const [stream, setStream] = useState<MediaStream|null>(null);
    
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const photoRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        if(status==="recording" && stream && videoRef.current) {
            videoRef.current.srcObject = stream
        }
    }, [status, videoRef.current, status])
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false
            })
            setStream(stream);
            const mediaRecorder = new MediaRecorder(stream);
            setRecorder(mediaRecorder);

            mediaRecorder.onstart = () => {
                if(videoRef.current) videoRef.current.play();
            }
            
            mediaRecorder.onstop = () => {
                if(videoRef.current) videoRef.current.pause();
            }
            
            mediaRecorder.start();
            setStatus("recording");
        } catch (err) {
            console.error("error:", err);
        }
    }

    const stopRecording = () => {
        if (recorder) {
            recorder.stop();
            recorder.stream.getTracks().forEach(track => track.stop());
            setRecorder(null);
            setStream(null);
            setStatus("idle");
        }
    }

    return (
        <div className="home">
        <section className="main">
            <h1>goonbooth</h1>            
        <section>
            <div className="camera">
                <video id="video" ref={videoRef}>video stream not available</video>
                <button id="captureButton" onClick={(recorder) ? stopRecording : startRecording}>
                    take pic loser</button>
            </div>
            <canvas id="canvas" ref={canvasRef}></canvas>
            <div className="output">
                <img id="photo" alt="The screen capture will appear in this box." ref={photoRef}/>
            </div>
        </section>
        </section>
        </div>
    )
}
