import {useEffect, useRef, useState} from "react";
import Sidebar from "../components/Sidebar";

type StatusType = "idle" | "recording" | "paused";

let photos: string[] = [];
let chunks = [];
let dimensions = {width: 1, height: 3};

const thumbnailWidth = 160;
const thumbnailHeight = 120;
const thumbnailPadding = 10;
const timerDuration = 3; // seconds

export default function Photobooth() {
    const [photoSheetType, setPhotoSheetType] = useState("1x3");
    console.log(photoSheetType)

    const choiceARef = useRef<HTMLButtonElement>(null);
    const choiceBRef = useRef<HTMLButtonElement>(null);
    const choiceCRef = useRef<HTMLButtonElement>(null);
    const selectionRef = useRef<HTMLDivElement>(null);
    const photoboothRef = useRef<HTMLDivElement>(null);
    const cameraRef = useRef<HTMLDivElement>(null);
    const startButtonRef = useRef<HTMLButtonElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const photoSheetRef = useRef<HTMLCanvasElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder|null>(null);
    const countdownRef = useRef<HTMLParagraphElement>(null);

    const resultRef = useRef<HTMLDivElement>(null);
    
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
        selectionRef.current?.classList.remove("selection");
        selectionRef.current?.classList.add("hidden");
        photoboothRef.current?.classList.remove("hidden");
        console.log(sheetType);
        dimensions.width = parseInt(sheetType.charAt(0));
        dimensions.height = parseInt(sheetType.charAt(2));
        photos = [];
    }

    const startRecording = async () => {
        cameraRef.current?.classList.remove("hidden");
        startButtonRef.current?.classList.add("hidden");
        countdownRef.current?.classList.remove("hidden");

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

            mediaRecorderRef.current.onstart = () => {videoRef.current?.play();}

            mediaRecorderRef.current.onstop = () => {
                videoRef.current?.pause();
                mediaRecorderRef.current = null;
            }

            mediaRecorderRef.current.start();
            setStatus("recording");
            for (let i = 0; i < dimensions.width * dimensions.height; i++) {
                for (let i = 0; i < timerDuration; i++) {
                    if (!countdownRef.current) return;
                    countdownRef.current.textContent = (timerDuration - i).toString();
                    await new Promise(res => setTimeout(res, 1000));
                }
                // await new Promise(res => setTimeout(res, timerDuration * 1000));
                await capture();
            }
            stopRecording();
        } catch (err) {
            console.error("error:", err);
        }
    }

    const capture = async () => {
        return new Promise<void>((resolve) => {
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
                        updatePhotoSheet();
                    }
                });
            } else console.log("media recorder is null");
            resolve();
        });
    }

    const stopRecording = () => {
        console.log("stop recording");

        const recorder = mediaRecorderRef.current;
        if (recorder) {
            recorder.onstop = () => {
                recorder?.stream.getTracks().forEach(track => track.stop());
                stream?.getTracks().forEach(track => track.stop());
                
                // mediaRecorderRef.current = null;
                setStream(null);
                
                if (videoRef.current) {
                    // videoRef.current.srcObject = null;
                    videoRef.current.pause();
                }
                setStatus("idle");
            }
            recorder.stop();
        } else {
            console.log("recorder is null");
        }
        // cameraRef.current?.classList.add("hidden");
        countdownRef.current?.classList.add("hidden");
    }

    const updatePhotoSheet = () => {
        console.log("updating photo sheet");
        if(photoSheetRef.current) {
            const context = photoSheetRef.current.getContext("2d");
            photoSheetRef.current.height = photos.length * (thumbnailHeight + thumbnailPadding);
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
                    <h2>choose your layout!</h2>
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
                    <section id="photoDisplay">
                    <div className="camera" ref={cameraRef}>
                        <video id="video" ref={videoRef}>video stream not available</video>
                        <p className="countdown hidden" ref={countdownRef}>loading!</p>
                    </div>
                    <div className="wholePhotosheet">
                        <canvas id="photoSheet" ref={photoSheetRef}></canvas>
                    </div>

                    </section>
                    <button id="startButton " ref={startButtonRef} onClick={(recorder) ? stopRecording : startRecording}>
                        start loser</button>
                    <button>results!</button>
                    <canvas id="canvas" ref={canvasRef}></canvas>
                </section>
                <section className="result hidden" ref={resultRef}>
                    <h2>here u go! :3</h2>
                </section>
            </section>
        </div>
    )
}
