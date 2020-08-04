import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    return transactions.reduce(
      (balance, transaction) => {
        const { value, type } = transaction;

        if (type === 'income') {
          return {
            ...balance,
            income: balance.income + value,
            total: balance.total + value,
          };
        }

        return {
          ...balance,
          outcome: balance.outcome + value,
          total: balance.total - value,
        };
      },
      { income: 0, outcome: 0, total: 0 },
    );
  }
}

export default TransactionsRepository;
