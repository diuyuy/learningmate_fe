let playerInstance: any = null;
let lastTime = 0;

export const setPlayerInstance = (player: any) => {
  playerInstance = player;
};

export const getPlayerInstance = () => {
  return playerInstance;
};

export const setLastTime = (time: number) => {
  lastTime = time;
};

export const getLastTime = () => lastTime;
