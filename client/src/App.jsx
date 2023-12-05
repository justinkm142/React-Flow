import { useState } from 'react'
import {
  RouterProvider,
} from "react-router-dom";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


import { ReactFlowProvider } from 'reactflow';
import router from './Routes/Routes'




function App() {

  return (
    <>
      <ReactFlowProvider>
        <RouterProvider router={router} />
      </ReactFlowProvider>
    </>
  )
}

export default App
