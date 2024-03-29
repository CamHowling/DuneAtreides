import { footerTransitionMiddle, mainBackground, minorHeading } from '@/settings/colours';
import { Box, Dialog, DialogTitle, IconButton, Link, Typography } from '@mui/material';
import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const dialogStyle = {
  display: 'flex',
  '& .MuiPaper-root': {
    background: minorHeading
  },
  flexDirection: 'column',
  justifyContent:'center',
  alignItems: 'center',
  minHeight: '80vh',
}

const typographyStyle = {
  color: mainBackground,
  pr: 3,
  pl: 3,
  pb: 3,
}

const titleStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  color: mainBackground,
}


interface DialogProps {
  open: boolean;
  onClose: () => void;
}

export function DisclaimerDialog({open, onClose}: DialogProps) {
  return (
    <Dialog onClose={onClose} open={open} sx={{...dialogStyle}} fullWidth maxWidth="lg">
      <DialogTitle variant='h4' sx={{ ...titleStyle }}>Dislcaimer
        <IconButton onClick={onClose} sx={{ color: mainBackground }} >
          <FontAwesomeIcon icon={faXmark} />
        </IconButton>
      </DialogTitle>
      <Box>
        <Typography variant='h6' sx={{...typographyStyle, pb: 0}}>
          Acknowledgements
        </Typography>
        <Typography sx={{...typographyStyle}}>
          Please note that this is a 3rd party web application intended to help players play Dune 2019 by Galeforce Nine.
          <br />
          Galeforce Nine is not associated with the production of this web application, and retain their rights to their respective intellectual property.
        </Typography>
        <Typography variant='h6' sx={{...typographyStyle, pb: 0}}>
          Monetization
        </Typography>
        <Typography sx={{...typographyStyle}}>
          This application is strictly non-profit, and I do not accept donations for it. 
          <br />
          If you would like to support this project, please use your money to buy more Dune expansions, support the upcoming&nbsp;
          <Link href="https://gamefound.com/en/projects/gf9/dune" color={footerTransitionMiddle}>Dune Gamefound project</Link>
          , or get more food and drinks for your next session.
        </Typography>
      </Box>
    </Dialog>
    );
}