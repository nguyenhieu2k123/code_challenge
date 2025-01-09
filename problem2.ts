//Define a WalletBalanceBase interface to hold common fields like currency and amount. This avoids redundancy and ensures consistency between WalletBalance and FormattedWalletBalance.
interface WalletBalanceBase {
  currency: string;
  amount: number;
}

// Extend the base interface for raw wallet balance
interface WalletBalance extends WalletBalanceBase {}

// Extend the base interface for formatted wallet balance
interface FormattedWalletBalance extends WalletBalanceBase {
  formatted: string; // Include the formatted representation of the amount
}

// The structure allows for easy extension in the future. For example, if you need to add more fields (e.g., priority or blockchain), you can extend WalletBalanceBase without duplicating fields.
// For Example: 
interface NewWalletBalance extends WalletBalanceBase {
  priority: number; // New field for priority
  blockchain: string; // New field for blockchain
}

// Define props for the component, extending from BoxProps:
// Not sure if BoxProps already exists so i use Generic placeholder for BoxProps
interface BoxProps extends Record<string, any> {}
interface Props extends BoxProps {}

//  Optimize function getPriority to an Object to improve performance, readability, easily maintaining, avoiding errors or fall to default if forgot a case 

// Before: 
const getPriority = (blockchain: any): number => {
	  switch (blockchain) {
	    case 'Osmosis':
	      return 100
	    case 'Ethereum':
	      return 50
	    case 'Arbitrum':
	      return 30
	    case 'Zilliqa':
	      return 20
	    case 'Neo':
	      return 20
	    default:
	      return -99
	  }
}
// After: 
const priorityMap: Record<string, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};


// Improve this function by spit into smaller pieces, remove unnecessary if-else statements
// Before:

const sortedBalances = useMemo(() => {
    return balances.filter((balance: WalletBalance) => {
		  const balancePriority = getPriority(balance.blockchain);
		  if (lhsPriority > -99) {
		     if (balance.amount <= 0) {
		       return true;
		     }
		  }
		  return false
		}).sort((lhs: WalletBalance, rhs: WalletBalance) => {
			const leftPriority = getPriority(lhs.blockchain);
		  const rightPriority = getPriority(rhs.blockchain);
		  if (leftPriority > rightPriority) {
		    return -1;
		  } else if (rightPriority > leftPriority) {
		    return 1;
		  }
    });
  }, [balances, prices]);

// After: Make the code readable, easier to understand and maintain
const balancesWithPriority = useMemo(() => {
    return balances.map((balance: WalletBalance) => {
      const priority = priorityMap[balance.currency] ?? 0;
      return { ...balance, priority };
    });
  }, [balances]);

  // Filter and sort balances in one pass
  const sortedBalances = useMemo(() => {
    return balancesWithPriority
      .filter((balance) => balance.amount > 0 || balance.priority > -99)
      .sort((lhs, rhs) => rhs.priority - lhs.priority);
  }, [balancesWithPriority]);

  // Format balances once
  const formattedBalances = useMemo(() => {
    return sortedBalances.map((balance) => ({
      ...balance,
      formatted: balance.amount.toFixed(2),
    }));
  }, [sortedBalances]);



// Improve 
const rows = useMemo(() => {
  return sortedBalances.map((balance: FormattedWalletBalance) => {
    const usdValue = (prices[balance.currency] ?? 0) * balance.amount; // Safe fallback in case price is missing
    return {
      ...balance,
      usdValue,
    };
  });
}, [sortedBalances, prices]); // Only recompute when sortedBalances or prices change




// Refactored code: 
interface WalletBalanceBase {
  currency: string;
  amount: number;
}

interface WalletBalance extends WalletBalanceBase {}

interface FormattedWalletBalance extends WalletBalanceBase {
  formatted: string;
}

interface BoxProps extends Record<string, any> {}

interface Props extends BoxProps {}

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const priorityMap: Record<string, number> = {
    Osmosis: 100,
    Ethereum: 50,
    Arbitrum: 30,
    Zilliqa: 20,
    Neo: 20,
  };

  // Calculate priorities once to optimize performance
  const balancesWithPriority = useMemo(() => {
    return balances.map((balance: WalletBalance) => {
      const priority = priorityMap[balance.currency] ?? 0;
      return { ...balance, priority };
    });
  }, [balances]);

  // Filter and sort balances in one pass
  const sortedBalances = useMemo(() => {
    return balancesWithPriority
      .filter((balance) => balance.amount > 0 || balance.priority > -99)
      .sort((lhs, rhs) => rhs.priority - lhs.priority);
  }, [balancesWithPriority]);

  // Format balances once
  const formattedBalances = useMemo(() => {
    return sortedBalances.map((balance) => ({
      ...balance,
      formatted: balance.amount.toFixed(2),
    }));
  }, [sortedBalances]);

  // Map formatted balances to rows
  const rows = useMemo(() => {
    return formattedBalances.map((balance, index) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    });
  }, [formattedBalances, prices]);

  return <div {...rest}>{rows}</div>;
};
