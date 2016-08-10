#!/bin/bash

RED=$'\e[31m'
GREEN=$'\e[32m'
YELLOW=$'\e[33m'
MAGENTA=$'\e[35m'
COLORLESS=$'\e[0m'

BOARD_LIMIT="^[0-9]*$"


read -p "${MAGENTA}Enter 2-digit board size (to be squared):${COLORLESS} " BOARD

if ( ! [[ $BOARD =~ $BOARD_LIMIT ]] ) || [ ${#BOARD} -gt 2 ] || [ $BOARD -lt 0 ]; then
  echo "${RED}ERROR:${COLORLESS} Invalid board size: ${BOARD}"
  echo "${YELLOW}Please enter a 2-digit number to be squared${COLORLESS} (e.g. if input 5, board size = 5 x 5)"
  exit 1
else
  `sed -i '' "3s/.*/const board = Math.pow(2, ${BOARD}) - 1;/" nQueensNodeCluster.js`
  echo "${YELLOW}solving...${COLORLESS}"
  node nQueensNodeCluster.js
fi
