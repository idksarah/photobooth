import {useEffect, useRef, useState} from "react";
import Sidebar from "../components/Sidebar";

type StatusType = "idle" | "recording" | "paused";

let photos: string[] = [];
let chunks = [];
let dimensions = {width: 1, height: 3};

const thumbnailWidth = 160;
const thumbnailHeight = 120;
const thumbnailPadding = 10;

export default function Photobooth() {
    const [photoSheetType, setPhotoSheetType] = useState("1x3");

    const choiceARef = useRef<HTMLButtonElement>(null);
    const choiceBRef = useRef<HTMLButtonElement>(null);
    const choiceCRef = useRef<HTMLButtonElement>(null);
    const selectionRef = useRef<HTMLDivElement>(null);
    const photoboothRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const photoSheetRef = useRef<HTMLCanvasElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder|null>(null);
    
    const [status, setStatus] = useState<StatusType>("idle");
    const [recorder, setRecorder] = useState<MediaRecorder|null>(null);
    const [stream, setStream] = useState<MediaStream|null>(null);

    useEffect(() => {
        if(status === "recording" && stream && videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    }, [status, videoRef.current, status])

    const selectSheet = (sheetType: string) => {
        setPhotoSheetType(sheetType);
        selectionRef.current?.classList.add("hidden");
        photoboothRef.current?.classList.remove("hidden");
        console.log(sheetType);
        dimensions.width = parseInt(sheetType.charAt(0));
        dimensions.height = parseInt(sheetType.charAt(2));
        photos = [];
    }

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
            context?.drawImage(videoRef.current, 0, 0,
            videoRef.current.videoWidth, videoRef.current.videoHeight);

            canvasRef.current.toBlob((blob: Blob | null) => {
                if (blob) {
                    const img = new Image();
                    img.src = window.URL.createObjectURL(blob);
                    photos.push(img.src);
                    if (photos.length >= dimensions.width * dimensions.height) {
                        stopRecording();
                    }
                    updatePhotoSheet();
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

    const updatePhotoSheet = () => {
        console.log("updating photo sheet");
        if(photoSheetRef.current) {
            const context = photoSheetRef.current.getContext("2d");
            photoSheetRef.current.height = photos.length *(thumbnailHeight + thumbnailPadding);
            photoSheetRef.current.width = thumbnailWidth;
            for (let i = 0; i < photos.length; i++) {
                const img = new Image();
                img.src = photos[i];
                img.onload = () => {
                    context?.drawImage(img, 0, i * (thumbnailHeight + thumbnailPadding), 
                    thumbnailWidth, thumbnailHeight
                    );
                }
            }
        }
    }

    return (
        <div className="home">
            <section>
                <Sidebar></Sidebar>
            </section>
            <section className="main">
                <h1>goonbooth</h1>            
            <section className="selection" ref={selectionRef}>
                <section className="photosheetChoice">
                    <button onClick = {() => selectSheet("1x3")} ref={choiceARef}>1x3</button>
                </section>
                <section className="photosheetChoice">
                    <button onClick = {() => selectSheet("1x4")} ref={choiceBRef}>1x4</button>
                </section>
                <section className="photosheetChoice">
                    <button onClick = {() => selectSheet("2x4")} ref={choiceCRef}>2x4</button>
                </section>
            </section>
            <section className="photobooth hidden" ref={photoboothRef}>
                <div className="camera">
                    <video id="video" ref={videoRef}>video stream not available</video>
                    <button id="startButton" onClick={(recorder) ? stopRecording : startRecording}>
                        start loser</button>
                        <button id="captureButton" onClick={capture}>take pic loser</button>
                </div>
                <canvas id="canvas" ref={canvasRef}></canvas>
                <canvas id="photoSheet" ref={photoSheetRef}></canvas>
            </section>
            </section>
        </div>
    )
}
