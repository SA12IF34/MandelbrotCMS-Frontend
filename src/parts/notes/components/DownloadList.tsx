/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer';
import NotePdf from '../pages/pdf/NotePdf';

import {handleDownloadTXT, handleDownloadDOCX, handleProcessPDF} from '../utils/download'


function DownloadList() {

  const [noteTitle, setNoteTitle] = useState<string>();
  const [noteContent, setNoteContent] = useState<string>();
  const [noteDrawnContent, setNoteDrawnContent] = useState<string>();
  const [noteUploadedImage, setNoteUploadedImage] = useState<string>();

  const [noteContentPDF, setNoteContentPDF] = useState<string[]>();

  useEffect(() => {
    const titleElement = document.querySelector('h2#note-title'); 
    const contentElement = document.querySelector('div#note-content'); 
    const drawnContentElement = document.querySelector('.drawn-content img');
    const uploadedImageElement = document.querySelector('.uploaded-img img');
    
    setNoteTitle(titleElement?.textContent as string);
    setNoteContent(contentElement?.innerHTML as string);

    setNoteContentPDF(handleProcessPDF(contentElement?.innerHTML as string));

    if (drawnContentElement) {
        setNoteDrawnContent((drawnContentElement as HTMLImageElement).src);
    }

    if (uploadedImageElement) {
        const img = uploadedImageElement as HTMLImageElement;
        const convertToDataUrl = async () => {
        try {
            const response = await fetch(img.src);
            const blob = await response.blob();
            const reader = new FileReader();
            reader.onloadend = () => {
            setNoteUploadedImage(reader.result as string);
            };
            reader.readAsDataURL(blob);
        } catch (error) {
            console.error('Error converting image to data URL:', error);
        }
        };
        convertToDataUrl();
    }

  }, [])

  return (
    <div className='download-list'>
        <button className={'download-btn'} onClick={() => {handleDownloadTXT(noteTitle as string, noteContent as string)}}>Download .txt</button>
        {noteContentPDF && noteContentPDF.length > 0 && (
          <PDFDownloadLink className={'download-btn'} document={<NotePdf noteName={noteTitle} noteContent={noteContentPDF} noteDrawnContent={noteDrawnContent} noteUploadedImage={noteUploadedImage} />} fileName={`${noteTitle}.pdf`}>
            {({loading}) =>
              loading ? 'Loading document...' : 'Download .pdf'
            }
          </PDFDownloadLink>
        )}
        <button className={'download-btn'} onClick={() => {handleDownloadDOCX(noteTitle as string, noteContent as string)}}>Download .docx</button>
    </div>
  )
}

export default DownloadList;