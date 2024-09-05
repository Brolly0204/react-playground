import React, { useEffect, useState } from "react";
import iframeHtmlRaw from './iframe.html?raw'

const iframeUrl = URL.createObjectURL(new Blob([iframeHtmlRaw], { type: 'text/html' }))
const Preview: React.FC = () => {
  return (
    <iframe src={iframeUrl} style={{
      width: '100%',
      height: '100%',
      padding: 0,
      border: 'none'
    }} />
  )
}

export default Preview