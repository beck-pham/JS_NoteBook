import { useRef, useEffect } from 'react';
import './preview.css';

interface PreviewProps {
  code: string;
}

// iframe will execute code inside the script tag
const html = `
  <html>
    <head>
      <style>html { background-color: white; }</style>
    </head>
    <body>
      <div id="root"></div>
      <script>
        window.addEventListener('message', (event) => {
          try{
            eval(event.data);
          } catch (error) {
            const root = document.querySelector('#root');
            root.innerHTML = '<div style="color: red"><h4>Runtime Error</h4>' + error + '</div>'
            console.error(error);
          }
        }, false);
      </script>
    </body>
  </html>
`;
  
const Preview: React.FC<PreviewProps> = ({ code }) => {
  const iframe = useRef<any>();

  // after the new code get rendered, check iframe property and reset it
  useEffect(() => {
    //resetting iframe to provide code consistency for user experience
    iframe.current.srcdoc = html;
    // post the code into the iframe
    setTimeout(() => {
      iframe.current.contentWindow.postMessage(code, '*');
    }, 50);
  }, [code]);
  return (
    <div className='preview-wrapper'>
      <iframe 
        ref={iframe} 
        title='preview' 
        sandbox ='allow-scripts' 
        srcDoc={html}
      />
    </div>
  ); 
}

export default Preview;
