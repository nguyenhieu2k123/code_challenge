const apiURL = 'https://interview.switcheo.com/prices.json';
const tokenIconsURL = 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/';

const elements = {
	fromToken: document.getElementById('fromToken'),
	toToken: document.getElementById('toToken'),
	fromAmount: document.getElementById('fromAmount'),
	toAmount: document.getElementById('toAmount'),
	fromTokenIcon: document.getElementById('fromTokenIcon'),
	toTokenIcon: document.getElementById('toTokenIcon'),
	errorMessage: document.getElementById('errorMessage'),
	swapForm: document.getElementById('swapForm'),
	swapButton: document.getElementById('swapButton'),
};

let tokenPrices = {};

async function fetchTokenData() {
	try {
		const response = await fetch(apiURL);
		tokenPrices = removeDuplicates(await response.json());

		[ elements.fromToken, elements.toToken ].forEach(dropdown => populateDropdown(dropdown, tokenPrices));
		updateIcons();
	} catch (error) {
		displayError('Failed to fetch token data. Please try again.');
	}
}

function populateDropdown(dropdown, tokens) {
	tokens.forEach(({ currency }) => {
		const option = document.createElement('option');
		option.value = currency;
		option.textContent = currency;
		dropdown.appendChild(option);
	});
}

function updateIcons() {
	elements.fromTokenIcon.src = `${tokenIconsURL}${elements.fromToken.value}.svg`;
	elements.toTokenIcon.src = `${tokenIconsURL}${elements.toToken.value}.svg`;
}

function recalculateConversion() {
	if (!elements.fromAmount.value) {
		elements.toAmount.value = '';
		return;
	}

	const fromPrice = getPrice(elements.fromToken.value);
	const toPrice = getPrice(elements.toToken.value);

	elements.toAmount.value = fromPrice && toPrice
		? ((elements.fromAmount.value * fromPrice) / toPrice).toFixed(6)
		: '';
}


function getPrice(currency) {
	return tokenPrices.find(item => item.currency === currency)?.price || 0;
}

function removeDuplicates(data) {
	return Array.from(
		data.reduce((map, item) => {
			if (item.currency && item.date) {
				const existing = map.get(item.currency);
				if (!existing || new Date(item.date) > new Date(existing.date)) {
					map.set(item.currency, item);
				}
			}
			return map;
		}, new Map()).values()
	);
}

function displayError(message) {
	elements.errorMessage.textContent = message;
	elements.errorMessage.style.display = 'block';
}

function swapTokens() {
	[ elements.fromToken.value, elements.toToken.value ] = [ elements.toToken.value, elements.fromToken.value ];

	[ elements.fromTokenIcon.src, elements.toTokenIcon.src ] = [ elements.toTokenIcon.src, elements.fromTokenIcon.src ];

	[ elements.fromAmount.value, elements.toAmount.value ] = [ elements.toAmount.value, elements.fromAmount.value ];

	recalculateConversion();
}

elements.fromToken.addEventListener('change', () => {
	updateIcons();
	recalculateConversion();
});

elements.toToken.addEventListener('change', () => {
	updateIcons();
	recalculateConversion();
});

elements.fromAmount.addEventListener('input', recalculateConversion);

elements.swapButton.addEventListener('click', swapTokens);

elements.swapForm.addEventListener('submit', e => {
	e.preventDefault();
	alert('Swap successful!');
});

// Initialize app
fetchTokenData();
