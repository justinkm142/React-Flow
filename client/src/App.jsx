import { useState } from 'react'
import {
  RouterProvider,
} from "react-router-dom";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


import router from './Routes/Routes'




function App() {

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
