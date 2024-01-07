import React from 'react'
import { Alert } from '@mui/material'

export const ErrorOnForm = ({errorFormMessage}) => {
  return (
    <>
    <Alert severity="error">{errorFormMessage}</Alert>
    </>
  )
}
