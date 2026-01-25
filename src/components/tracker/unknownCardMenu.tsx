'use client';
import * as React from 'react';
import Image from 'next/image';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import { atreides, mainBackground } from '@/settings/colours';
import { House } from '@/classes/house';
import { UnknownTreachery } from '@/classes/unknownTreachery';
import { Treachery } from '@/classes/treachery';
import { LocationType } from '@/classes/locationType';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const boxStyle = {
  height: '100%',
  width: '100%',
};

const buttonStyle = {
  height: '100%',
  width: '100%',
};

const menuStyle = {
  '& .MuiList-root': {
    backgroundColor: mainBackground,
  },
};

const iconStyle = {
  alignItems: 'center',
  justifyContent: 'center',
  display: 'flex',
};

interface UnknownCardMenuProps {
  children?: React.ReactNode;
  unknownCard: UnknownTreachery;
  onUpdate?: (card?: Treachery, unknownCard?: UnknownTreachery) => void;
  players: House[];
}

export default function UnknownCardMenu({
  children,
  unknownCard,
  onUpdate,
  players,
}: UnknownCardMenuProps) {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [clientX, setClientX] = useState<number>(0);
  const [clientY, setClientY] = useState<number>(0);
  const open = Boolean(menuAnchor);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchor(event.currentTarget);
    setClientX(event.clientX);
    setClientY(event.clientY);
  };

  // Use immutable updates: create a new object for every change and call onUpdate immediately.
  const handleUpdatePlayer = (house: House) => {
    const updated: UnknownTreachery = {
      ...unknownCard,
      player: house,
      locationType: LocationType.PlayerUnknown,
    } as UnknownTreachery;
    if (onUpdate) onUpdate(undefined, updated);
    setMenuAnchor(null);
  };

  const handleChoam = () => {
    const updated: UnknownTreachery = {
      ...unknownCard,
      hasChoamMarker: !unknownCard.hasChoamMarker,
    } as UnknownTreachery;
    if (onUpdate) onUpdate(undefined, updated);
    setMenuAnchor(null);
  };

  const handleShare = () => {
    const updated: UnknownTreachery = {
      ...unknownCard,
      isShared: !unknownCard.isShared,
    } as UnknownTreachery;
    if (onUpdate) onUpdate(undefined, updated);
    setMenuAnchor(null);
  };

  const handleDiscard = () => {
    const updated: UnknownTreachery = {
      ...unknownCard,
      locationType: LocationType.DiscardUnknown,
      hasChoamMarker: false,
    } as UnknownTreachery;
    if (onUpdate) onUpdate(undefined, updated);
    setMenuAnchor(null);
  };

  const handleReturnToHand = () => {
    const updated: UnknownTreachery = {
      ...unknownCard,
      locationType: LocationType.PlayerUnknown,
      hasChoamMarker: false,
    } as UnknownTreachery;
    if (onUpdate) onUpdate(undefined, updated);
    setMenuAnchor(null);
  };

  const handleReveal = () => {
    const updated: UnknownTreachery = {
      ...unknownCard,
      locationType: LocationType.Revealed,
      isShared: false,
    } as UnknownTreachery;
    if (onUpdate) onUpdate(undefined, updated);
    setMenuAnchor(null);
  };

  const handleRemove = () => {
    const updated: UnknownTreachery = {
      ...unknownCard,
      locationType: LocationType.Removed,
    } as UnknownTreachery;
    if (onUpdate) onUpdate(undefined, updated);
    setMenuAnchor(null);
  };

  const handleClose = () => {
    setMenuAnchor(null);
  };

  const menuPlayers = players.filter((house) => {
    return house.id != unknownCard.player?.id;
  });

  const currentPlayer = players.find((house) => house.id == unknownCard.player?.id);
  const isHandFull = currentPlayer ? currentPlayer.isHandFull() : false;

  const isChoamPlaying = players.some((player) => {
    return player.id == House.Choam.id;
  });

  const iconSize = 32;
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
        {unknownCard.locationType.id == LocationType.PlayerUnknown.id ? (
          menuPlayers.map((house, key) => {
            if (
              unknownCard.originHouse == House.Richese &&
              house == House.Richese &&
              unknownCard.player == House.Richese
            ) {
              return;
            }

            return (
              <MenuItem
                key={key}
                onClick={() => handleUpdatePlayer(house)}
                disabled={house.isHandFull()}
              >
                <Box
                  sx={{
                    height: iconSize,
                    width: iconSize,
                    ...iconStyle,
                  }}
                >
                  <Image
                    src={`/assets/houses/${house.icon}`}
                    alt={house.name}
                    height={iconSize}
                    width={iconSize}
                  />
                </Box>
                <Typography sx={{ ml: 1 }} fontSize={fontSize}>
                  {house.name}
                </Typography>
              </MenuItem>
            );
          })
        ) : (
          <Box></Box>
        )}
        {isChoamPlaying && unknownCard.locationType.id == LocationType.PlayerUnknown.id ? (
          <MenuItem onClick={handleChoam}>
            <Box
              sx={{
                height: iconSize,
                width: iconSize,
                ...iconStyle,
              }}
            >
              <Image src="/assets/menu/choam small.png" alt="Choam" height={32} width={32} />
            </Box>
            <Typography sx={{ ml: 1 }} fontSize={fontSize}>
              {unknownCard.hasChoamMarker ? 'Cancel Choam Alliance' : 'Use Choam Alliance'}
            </Typography>
          </MenuItem>
        ) : (
          <Box></Box>
        )}
        {unknownCard.player && unknownCard.locationType.id == LocationType.PlayerUnknown.id ? (
          <MenuItem onClick={handleDiscard}>
            <Box
              sx={{
                height: iconSize,
                width: iconSize,
                ...iconStyle,
              }}
            >
              <Image src="/assets/cards/discard overlay.png" alt="Discard" height={40} width={40} />
            </Box>
            <Typography sx={{ ml: 1 }} fontSize={fontSize}>
              Discard
            </Typography>
          </MenuItem>
        ) : (
          <Box></Box>
        )}
        {unknownCard.player &&
        (unknownCard.locationType.id == LocationType.Revealed.id ||
          unknownCard.locationType.id == LocationType.DiscardUnknown.id) ? (
          <MenuItem onClick={handleReturnToHand} disabled={isHandFull}>
            <Box
              sx={{
                height: iconSize,
                width: iconSize,
                ...iconStyle,
              }}
            >
              <Image
                src={`/assets/houses/${unknownCard.player.icon}`}
                alt={unknownCard.player.name}
                height={iconSize}
                width={iconSize}
              />
            </Box>
            <Typography sx={{ ml: 1 }} fontSize={fontSize}>
              {!(
                unknownCard.locationType.id == LocationType.Revealed.id &&
                unknownCard.player.id == House.Richese.id &&
                unknownCard.originHouse != undefined &&
                unknownCard.originHouse.id == House.Richese.id
              )
                ? 'Return to Hand'
                : 'Karama OR Return to Hand'}
            </Typography>
          </MenuItem>
        ) : (
          <Box></Box>
        )}
        {unknownCard.player && unknownCard.locationType.id == LocationType.PlayerUnknown.id ? (
          <MenuItem onClick={handleReveal}>
            <Box
              sx={{
                height: iconSize,
                width: iconSize,
                ...iconStyle,
              }}
            >
              <Image src="/assets/cards/draw overlay.png" alt="Draw" height={48} width={48} />
            </Box>
            <Typography sx={{ ml: 1 }} fontSize={fontSize}>
              Reveal
            </Typography>
          </MenuItem>
        ) : (
          <Box></Box>
        )}
        {unknownCard.player && unknownCard.locationType.id == LocationType.Revealed.id ? (
          <MenuItem onClick={handleRemove}>
            <Box
              sx={{
                height: iconSize,
                width: iconSize,
                ...iconStyle,
              }}
            >
              <Image src="/assets/cards/draw overlay.png" alt="Draw" height={48} width={48} />
            </Box>
            <Typography sx={{ ml: 1 }} fontSize={fontSize}>
              Remove
            </Typography>
          </MenuItem>
        ) : (
          <Box></Box>
        )}
        {unknownCard.player &&
        (unknownCard.locationType.id == LocationType.DiscardUnknown.id ||
          unknownCard.locationType.id == LocationType.PlayerUnknown.id) ? (
          <MenuItem onClick={handleShare}>
            <Box
              sx={{
                height: iconSize,
                width: iconSize,
                ...iconStyle,
              }}
            >
              <FontAwesomeIcon
                icon={faEye}
                style={{ fontSize: '1.8em' }}
                color={atreides}
              ></FontAwesomeIcon>
            </Box>
            <Typography sx={{ ml: 1 }} fontSize={fontSize}>
              {unknownCard.isShared ? 'Remove from Share' : 'Add to Share'}
            </Typography>
          </MenuItem>
        ) : (
          <Box></Box>
        )}
      </Menu>
    </Box>
  );
}
