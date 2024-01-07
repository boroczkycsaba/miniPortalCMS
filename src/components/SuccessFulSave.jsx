import React from 'react'
import { Alert } from '@mui/material'
import { useState } from 'react';
import { getCurrentUserLanguage } from '../utility/serviceLanguage';

export const SuccessFulSave = () => {

  const [currentPortalLanguage] = useState(getCurrentUserLanguage());

  return (
    <div>
    <Alert severity="info">{currentPortalLanguage === "HU" ? "Sikeres űrlap mentés" : "Form successful saved!"}</Alert>
   </div>
  )
}