import {Document, Paragraph, TextRun, HeadingLevel, Packer} from 'docx';
import {saveAs} from 'file-saver';

export const handleDownloadTXT = (noteTitle: string, noteContent: string): void => {
  const anchor = document.createElement('a');
  const text = handleProcessContentTXT(noteContent);
  anchor.href = 'data:text/plain;charset=utf-8,'+'--------------------------\n'+document.querySelector('h2')?.textContent+'\n--------------------------\n\n'+text;
  anchor.download = `${noteTitle}.txt`;

anchor.click();
}

export const handleProcessContentTXT = (noteContent: string): string => {
  let content = noteContent;

  content = content.split('<div>').join('\n');
  content = content.split('</div>').join('');
  content = content.split('<br>').join('');
  content = content.split('<b>').join('');
  content = content.split('</b>').join('');

  return content
}

export const handleDownloadDOCX = (noteTitle: string, noteContent: string): void => {
  const content = handleProcessContentTXT(noteContent)
  const doc = new Document({
    sections: [
    {
      children: [
        new Paragraph({
          text: noteTitle,
          heading: HeadingLevel.TITLE,
        
        })
      ]
    },
    {
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: content
            })
          ]
        })
      ]
    }
  ]
  })

  Packer.toBlob(doc).then((blob: string | Blob) => {
    saveAs(blob, `${noteTitle}.docx`)
  })
}

export const handleProcessPDF = (noteContent: string): string[] => {
  let content: string | string[] = noteContent;
  
  content = content.split('</div>').join('');
  content = content.split('<br>').join('');
  content = content.split('<b>').join('');
  content = content.split('</b>').join('');
  content = content.split('<div>');
  
  return content;
}