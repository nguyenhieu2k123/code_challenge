const sum_to_n_a = function (n) {
	return (n * (n + 1)) / 2;
};

const sum_to_n_b = function (n) {
	let total = 0;
	for (let i = 1; i <= n; i++) {
		total += i;
	}
	return total;
};

const sum_to_n_c = function (n) {
	if (n === 0) return 0;
	return n + sum_to_n_c(n - 1);
};

console.log("Using the Arithmetic Series Formula")
console.log("🚀 ~ sum_to_n_a(5):", sum_to_n_a(9))
console.log("Using for loop")
console.log("🚀 ~ sum_to_n_b(5):", sum_to_n_b(9))
console.log("Use Recursion")
console.log("🚀 ~ sum_to_n_c(5):", sum_to_n_c(9))
