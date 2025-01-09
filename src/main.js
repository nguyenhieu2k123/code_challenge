import './style.css';
document.querySelector('#app').innerHTML = `
  <div class="swap-container">
    <h1>Currency Swap</h1>
    <form id="swapForm">
      <div class="input-group">
        <label for="fromToken">From</label>
        <div class="token-selector">
          <img id="fromTokenIcon" src="" alt="Token Icon" />
          <select id="fromToken" name="fromToken"></select>
        </div>
        <input type="number" id="fromAmount" name="fromAmount" placeholder="Enter amount" required />
      </div>

      <button type="button" id="swapButton" class="swap-button">⇅</button>

      <div class="input-group">
        <label for="toToken">To</label>
        <div class="token-selector">
          <img id="toTokenIcon" src="" alt="Token Icon" />
          <select id="toToken" name="toToken"></select>
        </div>
        <input type="text" id="toAmount" name="toAmount" placeholder="Converted amount" disabled />
      </div>

      <div id="errorMessage"></div>
    </form>
  </div>
`;
