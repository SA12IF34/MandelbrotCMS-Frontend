import {useEffect, useRef} from 'react';
import {MdOutlineClose, MdDone} from 'react-icons/md';
import {IoReturnUpBack} from 'react-icons/io5';

type props = {
    canvasHistory: ImageData[],
    setCanvasHistory: React.Dispatch<React.SetStateAction<ImageData[]>>,
    setDraw: React.Dispatch<React.SetStateAction<boolean>>,
    setDrawnContent: React.Dispatch<React.SetStateAction<string | undefined>>
}

function DrawCanvas({canvasHistory, setCanvasHistory, setDraw, setDrawnContent}: props) {
  const initializer = useRef<boolean>(false)

  useEffect(() => {
    if (initializer.current) return; // Prevent re-initialization
    initializer.current = true; // Set to true after first initialization

    const container = document.querySelector('.draw-canvas') as HTMLDivElement;
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    let isDrawing = false;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    if (!ctx) {
      console.error('Failed to get canvas context');
      return;
    }

    const resizeCanvas = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      setCanvasHistory([ctx.getImageData(0, 0, canvas.width, canvas.height)]);
    }

    resizeCanvas();

    const handleGetPos = (canvas: HTMLCanvasElement, e: MouseEvent | Touch) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        return {x, y};
    }

    const handleDown = (canvas: HTMLCanvasElement, e: MouseEvent | TouchEvent) => {
        isDrawing = true;
        const currentPosition = e.type.includes('mouse') 
            ? handleGetPos(canvas, e as MouseEvent)
            : handleGetPos(canvas, (e as TouchEvent).touches[0]);
        ctx.moveTo(currentPosition.x, currentPosition.y)
        ctx.beginPath();
        ctx.lineWidth  = 2.5;
        ctx.lineCap = "round";
        ctx.lineJoin = 'round';
        ctx.strokeStyle = 'black';
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 1;
    }

    const handleMove = (canvas: HTMLCanvasElement, e: MouseEvent | TouchEvent) => {
        if (!isDrawing) return;
        e.preventDefault(); // Prevent scrolling while drawing
        const currentPosition = e.type.includes('mouse')
            ? handleGetPos(canvas, e as MouseEvent)
            : handleGetPos(canvas, (e as TouchEvent).touches[0]);
        ctx.lineTo(currentPosition.x, currentPosition.y);
        ctx.stroke();
    }

    const handleUp = () => {
        isDrawing = false;
        const canvasData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        setCanvasHistory(history => [...history, canvasData]);
    }

    // Mouse events
    canvas.addEventListener('mousedown', (e) => handleDown(canvas, e));
    canvas.addEventListener('mousemove', (e) => handleMove(canvas, e));
    canvas.addEventListener('mouseup', handleUp);

    // Touch events
    canvas.addEventListener('touchstart', (e) => handleDown(canvas, e));
    canvas.addEventListener('touchmove', (e) => handleMove(canvas, e));
    canvas.addEventListener('touchend', handleUp);
    
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='draw-canvas'>
      <button onClick={() => {
          setCanvasHistory([])
          setDraw(false)
        }}>
        <MdOutlineClose  />
      </button>
      <button onClick={() => {
          const canvas = document.querySelector('canvas') as HTMLCanvasElement;
          const dataUrl = canvas.toDataURL('image/png');
          setDrawnContent(dataUrl)
          setDraw(false);
        }}>
        <MdDone />
      </button>
      <button onClick={() => {
          if (canvasHistory.length > 0) {
            if (canvasHistory.length === 1) {
              // If there's only one canvas state, clear the canvas
              const canvas = document.querySelector('canvas') as HTMLCanvasElement;
              const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
              ctx.putImageData(canvasHistory[0], 0, 0)
              // setCanvasHistory([]);
              return;
            }
            console.log('Undoing last action, current history length:', canvasHistory.length);
            const lastCanvasData = canvasHistory[canvasHistory.length - 2];
            const canvas = document.querySelector('canvas') as HTMLCanvasElement;
            const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
            ctx.putImageData(lastCanvasData, 0, 0);
            console.log(lastCanvasData);
            setCanvasHistory(history => {
            console.log('Updating history, current length:', history.length);
            return history.slice(0, -1);
        });
          }
        }}>
        <IoReturnUpBack />
      </button>
        <canvas></canvas>
    </div>
  )
}

export default DrawCanvas;