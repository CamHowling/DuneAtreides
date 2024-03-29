import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import { Treachery } from '@/classes/treachery';
import { atreides, mainBackground } from '@/settings/colours';
import { House } from '@/classes/house';
import { UnknownTreachery } from '@/classes/unknownTreachery';
import { LocationType } from '@/classes/locationType';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

const boxStyle = {
    height: '100%', 
    width: '100%',
}

const buttonStyle = {
    height: '100%', 
    width: '100%',
}

const menuStyle = {
    "& .MuiList-root": {
        backgroundColor: mainBackground,
      }   
}

const iconStyle = {
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
}

interface CardMenuProps {
    children?: React.ReactNode;
    card: Treachery;
    onUpdate?: (card?: Treachery, unknownCard?: UnknownTreachery) => void;
    renderDiscard: boolean;
    renderHouse: boolean;
    players: House[];
}

export default function CardMenu({children, card, onUpdate, players}: CardMenuProps) {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [clientX, setClientX] = useState<number>(0);
  const [clientY, setClientY] = useState<number>(0);
  const open = Boolean(menuAnchor);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchor(event.currentTarget);
    setClientX(event.clientX);
    setClientY(event.clientY);
  };

  const [nextCard, setNextCard] = useState<Treachery>(card);

  const handleUpdatePlayer = (house: House) => {
    nextCard.player = house;
    nextCard.locationType = LocationType.Player;
    nextCard.hasAuctionMarker = false;
    setNextCard(nextCard);
    handleClose();
  };

  const handleAuction = () => {
    nextCard.hasAuctionMarker = !nextCard.hasAuctionMarker;
    setNextCard(nextCard);
    handleClose();
  };

  const handleChoam = () => {
    nextCard.hasChoamMarker = !nextCard.hasChoamMarker;
    setNextCard(nextCard);
    handleClose();
  };

  const handleShare = () => {
    nextCard.isShared = !nextCard.isShared;
    setNextCard(nextCard);
    handleClose();
  };

  const handleDiscard = () => {
    nextCard.locationType = LocationType.Discard;
    nextCard.hasChoamMarker = false;
    setNextCard(nextCard);
    handleClose();
  };

  const handleReturnToHand = () => {
    nextCard.locationType = LocationType.Player;
    setNextCard(nextCard);
    handleClose();
  };

  const handleReturnToDeck = () => {
    nextCard.player = undefined;
    nextCard.hasChoamMarker = false;
    nextCard.isShared = false;
    nextCard.locationType = LocationType.Deck;
    setNextCard(nextCard);
    handleClose();
  };

  const handleClose = () => {
    setMenuAnchor(null);
    if (onUpdate != undefined) {
        onUpdate(nextCard);
    }
  };

  const menuPlayers = players.filter((house) => {
    return house.id != card.player?.id;
  });

  const currentPlayer = players.find((house) => house.id == card.player?.id);
  const isHandFull = currentPlayer ? currentPlayer.isHandFull() : false;

  const isChoamPlaying = players.some((player) => {
    return player.id == House.Choam.id;
  });

  const iconSize = '32px';
  const fontSize = '16pt';

  return (
    <Box sx={{ ...boxStyle }}>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{ ...buttonStyle }}
      >
        {children}
      </Button>
      <Menu
        anchorEl={menuAnchor}
        open={open}
        onClose={handleClose}
        disableScrollLock={true}

        anchorReference="anchorPosition"
        anchorPosition={{ top: clientY, left: clientX }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}

        sx={{ ...menuStyle }}
      >
        {
        card.locationType.id == LocationType.Deck.id ? 
           (
            <MenuItem onClick={handleAuction}>
                <Box sx={{ height: iconSize, width: iconSize, ...iconStyle }}>
                    <img src={ `/assets/menu/auction small.png` } height={32} width={32}/>
                </Box>
                <Typography sx={{ ml: 1 }} fontSize={fontSize}>
                  {card.hasAuctionMarker ? 'Remove from Auction' : 'Add to Auction'}
                </Typography>
            </MenuItem>
           ) : <Box></Box>
        }
        {
        card.locationType.id == LocationType.Deck.id || card.locationType.id == LocationType.Player.id ?
        menuPlayers.map((house, key) => {
                return (
                    <MenuItem key={key} onClick={() => handleUpdatePlayer(house)} disabled={house.isHandFull()}>
                        <Box sx={{ height: iconSize, width: iconSize, ...iconStyle }}>
                            <img src={ `/assets/houses/${house.icon}` } height={iconSize} width={iconSize}/>
                        </Box>
                        <Typography sx={{ ml: 1 }} fontSize={fontSize}>{house.name}</Typography>
                    </MenuItem>
                );
            }) : <Box></Box>
        }
        {
        isChoamPlaying && card.locationType.id == LocationType.Player.id ? 
           (
            <MenuItem onClick={handleChoam}>
                <Box sx={{ height: iconSize, width: iconSize, ...iconStyle }}>
                    <img src={ `/assets/menu/choam small.png` } height={32} width={32}/>
                </Box>
                <Typography sx={{ ml: 1 }} fontSize={fontSize}>
                  {card.hasChoamMarker ? 'Cancel Choam Alliance' : 'Use Choam Alliance'}
                </Typography>
            </MenuItem>
           ) : <Box></Box>
        }
        {
        card.locationType.id == LocationType.Player.id ? 
           (
            <MenuItem onClick={handleDiscard}>
                <Box sx={{ height: iconSize, width: iconSize, ...iconStyle }}>
                    <img src={ `/assets/cards/discard overlay.png` } height={40} width={40}/>
                </Box>
                <Typography sx={{ ml: 1 }} fontSize={fontSize}>Discard</Typography>
            </MenuItem>
           ) : <Box></Box>
        }
        {
        card.player && card.locationType.id == LocationType.Discard.id ? 
           (
            <MenuItem onClick={handleReturnToHand} disabled={isHandFull}>
                <Box sx={{ height: iconSize, width: iconSize, ...iconStyle }}>
                    <img src={ `/assets/houses/${card.player.icon}` } height={iconSize} width={iconSize}/>
                </Box>
                <Typography sx={{ ml: 1 }} fontSize={fontSize}>Return to Hand</Typography>
            </MenuItem>
           ) : <Box></Box>
        }    
        { 
        card.player && card.locationType.id == LocationType.Player.id ?
           (
            <MenuItem onClick={handleReturnToDeck}>
                <Box sx={{ height: iconSize, width: iconSize, ...iconStyle }}>
                    <img src={ `/assets/cards/draw overlay.png` } height={48} width={48}/>
                </Box>
                <Typography sx={{ ml: 1 }} fontSize={fontSize}>Return to Deck</Typography>
            </MenuItem>
           ) : <Box></Box>
        }      
        { 
        card.player && card.locationType.id != LocationType.Deck.id ?
           (
            <MenuItem onClick={handleShare}>
                <Box sx={{ height: iconSize, width: iconSize, ...iconStyle }}>
                  <FontAwesomeIcon icon={faEye} style={{ fontSize: '1.8em' }} color={atreides}></FontAwesomeIcon>
                </Box>
                <Typography sx={{ ml: 1 }} fontSize={fontSize}>{card.isShared ? 'Remove from Share' : 'Add to Share'}</Typography>
            </MenuItem>
           ) : <Box></Box>
        }          
      </Menu>
    </Box>
  );
}