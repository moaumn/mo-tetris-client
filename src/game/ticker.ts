type Ticker = Function;
const tickers: Array<Ticker> = [];
let startTime = Date.now();

export function addTicker(ticker: Ticker) {
  tickers.push(ticker);
}

export function startTicker() {
  requestAnimationFrame(handleFrame);
}

function handleFrame() {
  tickers.forEach((ticker) => ticker(Date.now() - startTime));
  startTime = Date.now();
  requestAnimationFrame(handleFrame);
}
