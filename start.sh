#!/bin/bash

RED=$'\e[31m'
GREEN=$'\e[32m'
YELLOW=$'\e[33m'
MAGENTA=$'\e[35m'
CYAN=$'\e[36m'
BOLD=$'\e[1m'
COLORLESS=$'\e[0m'

INPUT_LIMIT="^[0-2]{1}$"
BOARD_LIMIT="^[0-9]*$"
ZERO=false
ONE=false

printf "${BOLD}Node Cluster${COLORLESS}\n"
printf "${GREEN}0${CYAN}: I/O\n"
printf "${GREEN}1${CYAN}: N-Queens\n"
printf "${GREEN}2${CYAN}: both\n\n"

read -p "${MAGENTA}Please select input:${GREEN} " INPUT
printf "\n"

if ! [[ $INPUT =~ $INPUT_LIMIT ]] ; then
  printf "${RED}ERROR:${COLORLESS} Invalid input: ${GREEN}${INPUT}\n"
  printf "${YELLOW}Please enter either ${GREEN}0${COLORLESS}, ${GREEN}1${COLORLESS}, or ${GREEN}2\n"
  exit 1
elif [ $INPUT -eq 0 ] ; then
  ZERO=true
elif [ $INPUT -eq 1 ] ; then
  ONE=true
else 
  ZERO=true
  ONE=true
fi

if [ $ZERO = true ] ; then
  printf "${YELLOW}running I/O.....\n\n${COLORLESS}"
  node nodeCluster.js
  printf "\n"
fi

if [ $ONE = true ] ; then
  read -p "${MAGENTA}Enter 2-digit board size (to be squared):${COLORLESS} " BOARD
  printf "\n"

  if ( ! [[ $BOARD =~ $BOARD_LIMIT ]] ) || [ ${#BOARD} -gt 2 ] || [ $BOARD -lt 0 ] ; then
    printf "${RED}ERROR:${COLORLESS} Invalid board size: ${BOARD}\n"
    printf "${YELLOW}Please enter a 2-digit number to be squared${COLORLESS} (e.g. if input 5, board size = 5 x 5)\n"
  else
    `sed -i '' "3s/.*/const board = Math.pow(2, ${BOARD}) - 1;/" nQueensNodeCluster.js`
    printf "${YELLOW}solving.....\n\n${COLORLESS}"
    node nQueensNodeCluster.js
    printf "\n"
  fi
fi

exit 1
