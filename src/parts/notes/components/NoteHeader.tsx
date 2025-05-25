import React from 'react';
import {createPortal} from 'react-dom'
import {useParams} from 'react-router-dom';
import { MdDraw, MdOutlineFormatBold } from 'react-icons/md';
import { IoTrashOutline } from 'react-icons/io5';
import { FaFileDownload, FaFileUpload } from 'react-icons/fa';
import { BsNodePlus } from "react-icons/bs";

import { api, handleError } from '../api';

import type { uploadedImage } from '../types';

import DownloadList from './DownloadList';

type props = {
    mode: 'read' | 'create' | 'update',
    draw?: boolean,
    setUploadedImage?: React.Dispatch<React.SetStateAction<uploadedImage | undefined>>,
    setDraw?: React.Dispatch<React.SetStateAction<boolean>>,
    setMode?: React.Dispatch<React.SetStateAction<'read' | 'create' | 'update'>>,
    handleSubmit?: () => Promise<void>
}

function NoteHeader({mode, draw, setDraw, setUploadedImage, setMode, handleSubmit}: props) {
  
  const {id} = useParams();

  const [boldActive, setBoldActive] = React.useState<boolean>(false);
  const [showDownloadList, setShowDownloadList] = React.useState<boolean>(false);

  const handleSetBold = () => {
    const selection = window.getSelection() as Selection;
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    
    // Check if selection is within note-content
    const noteContent = document.getElementById('note-content');
    if (!noteContent?.contains(range.commonAncestorContainer)) {
      return;
    }
    
    if (range.toString().length > 0) {
      // For selected text
      const parent = range.commonAncestorContainer.parentElement;
      
      if (parent?.tagName === 'B') {
        // If text is already bold, remove the bold formatting
        const textNode = document.createTextNode(parent.textContent || '');
        parent.parentNode?.replaceChild(textNode, parent);
        setBoldActive(false);
      } else {
        // If text is not bold, add bold formatting
        const boldElement = document.createElement('b');
        range.surroundContents(boldElement);
        setBoldActive(true);
      }
    } else {
      // For new text (when no selection)
      const node = range.startContainer;
      const parent = node.nodeType === Node.TEXT_NODE 
        ? node.parentElement 
        : node as HTMLElement;

      if (parent?.tagName === 'B' || parent?.parentElement?.tagName === 'B') {
        // If cursor is inside a bold element, exit bold mode
        setBoldActive(false);
        // Create a text node after the bold element
        const textNode = document.createTextNode('\u200B'); // Zero-width space
        if (parent.tagName === 'B') {
          parent.parentNode?.insertBefore(textNode, parent.nextSibling);
        } else {
          parent.parentElement?.parentNode?.insertBefore(textNode, parent.parentElement.nextSibling);
        }
        // Move cursor to the new text node
        const newRange = document.createRange();
        newRange.setStart(textNode, 1);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
      } else {
        // If cursor is not in bold element, enter bold mode
        const boldElement = document.createElement('b');
        const textNode = document.createTextNode('\u200B'); // Zero-width space
        boldElement.appendChild(textNode);
        range.insertNode(boldElement);
        // Move cursor inside the bold element
        const newRange = document.createRange();
        newRange.setStart(textNode, 1);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
        setBoldActive(true);
      }
    }
  };

  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {

        setUploadedImage && setUploadedImage({
          'dataUrl': reader.result as string,
          'file': file
        });
      }
      reader.readAsDataURL(file)
    }
  }


  const handleDeleteNote = async () => {
    try {
      const response = await api.delete(`note/${id}/`);

      if (response.status === 204) {
        history.back();
      }

    } catch (error) {
      handleError(error);
    }
  }

  return (
    <div className={`note-header ${mode}`}>
        <div className="tools">
            {mode === 'read' 
            ? (
            <>
                <button title='Delete the Note' onClick={handleDeleteNote}>
                    <IoTrashOutline />
                </button>
                <button className='download-btn' onClick={() => {setShowDownloadList(val => !val)}} title='Download the Note'>
                    <FaFileDownload />
                </button>
                {showDownloadList && createPortal(
                  <DownloadList />,
                  document.querySelector('.tools > button:nth-child(2)') as HTMLElement
                )}
            </>
            ) : (
            <>
                <button title='Draw' onClick={() => setDraw && setDraw(draw => !draw)} className={draw ? 'selected' : ''}>
                    <MdDraw />
                </button>
                <label htmlFor="upload-f">
                  <FaFileUpload />
                  <input onChange={handleUploadFile} type="file" accept="image/*" name="" id="upload-f" />
                </label>
                <button title='Toggle Bold' onClick={handleSetBold} className={boldActive ? 'selected' : ''}>
                    <MdOutlineFormatBold />
                </button>
                
            </>
            )}
            <button title='Connect to Other Parts'>
                <BsNodePlus />
            </button>
        </div>
        <div className="actions">
            {mode === 'read' 
            ? <button onClick={() => {setMode && setMode('update')}}>Edit</button>
            : mode === 'create'
            ? <button onClick={handleSubmit}>Create</button>
            : ( 
                <> {/* update mode */}
                    <button onClick={() => {setMode && setMode('read')}}>Cancel</button>
                    <button onClick={handleSubmit}>Done</button>
                </>
            )}
        </div>
    </div>
  )
}

export default NoteHeader;