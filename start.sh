#!/bin/bash

RED=$'\e[31m'
GREEN=$'\e[32m'
YELLOW=$'\e[33m'
MAGENTA=$'\e[35m'
COLORLESS=$'\e[0m'

BOARD_LIMIT="^[0-9]{2}$"

read -p "${MAGENTA}Enter 2-digit board size (to be squared):${COLORLESS} " BOARD

if ! [[ $BOARD =~ $BOARD_LIMIT ]]; then
  echo "${RED}ERROR:${COLORLESS} Invalid board size: ${BOARD}"
  echo "${YELLOW}Please enter a number to be squared${COLORLESS} (e.g. if input 5, board size = 5 x 5)"
  exit 1
fi
