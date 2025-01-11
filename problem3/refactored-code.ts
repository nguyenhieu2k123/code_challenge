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