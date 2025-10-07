import {useEffect, useRef, useState} from "react";
import photobooth from "./../assets/photobooth.png";

type StatusType = "idle" | "recording" | "paused";

var photos: string[] = [];
var chunks = [];

export default function Photobooth() {
    const [status, setStatus] = useState<StatusType>("idle");
    const [recorder, setRecorder] = useState<MediaRecorder|null>(null);
    const [stream, setStream] = useState<MediaStream|null>(null);
    
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const photoRef = useRef<HTMLImageElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder|null>(null);

    useEffect(() => {
        if(status === "recording" && stream && videoRef.current) {
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

            mediaRecorderRef.current = new MediaRecorder(stream);
            mediaRecorderRef.current.ondataavailable = (e) => {
                chunks.push(e.data);
            };

            setRecorder(mediaRecorderRef.current);

            mediaRecorderRef.current.onstart = () => {
                if(videoRef.current) videoRef.current.play();
            }

            mediaRecorderRef.current.onstop = () => {

                if(videoRef.current) videoRef.current.pause();
                mediaRecorderRef.current = null;
            }

            mediaRecorderRef.current.start();
            setStatus("recording");
        } catch (err) {
            console.error("error:", err);
        }
    }

    const capture = async () => {
        if (mediaRecorderRef.current && canvasRef.current && videoRef.current) {
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
            const context = canvasRef.current.getContext("2d");
            if (!context) return
            context.drawImage(videoRef.current, 0, 0, 
            videoRef.current.videoWidth, videoRef.current.videoHeight);

            canvasRef.current.toBlob((blob: Blob | null) => {
                if (blob) {
                    const img = new Image();
                    img.src = window.URL.createObjectURL(blob);
                    photos.push(img.src);
                }
            });
        } else console.log("media recorder is null");
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
                <button id="startButton" onClick={(recorder) ? stopRecording : startRecording}>
                    start loser</button>
                    <button id="captureButton" onClick={capture}>take pic loser</button>
            </div>
            <canvas id="canvas" ref={canvasRef}></canvas>
        </section>
        </section>
        </div>
    )
}
