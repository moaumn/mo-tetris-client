type Ticker = Function;
const tickers: Array<Ticker> = [];
let startTime = Date.now();
let tickerStarted = false;
export function addTicker(ticker: Ticker) {
  tickers.push(ticker);
  if (!tickerStarted) {
    tickerStarted = true;
    requestAnimationFrame(handleFrame);
  }
  return () => {
    const index = tickers.indexOf(ticker);
    tickers.splice(index, 1);
  };
}

function handleFrame() {
  tickers.forEach((ticker) => ticker(Date.now() - startTime));
  startTime = Date.now();
  requestAnimationFrame(handleFrame);
}
