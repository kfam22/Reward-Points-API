/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
 const transactions = [
  { payer: 'Target', points: 100},
  { payer: 'Walmart', points: 1000},
  { payer: 'Amazon', points: 400},
  { payer: 'Trader Joes', points: 100},
  { payer: 'Target', points: 100},
  { payer: 'Walmart', points: 200}
]

exports.transactions = transactions

exports.seed = function(knex) {
  return knex('transactions').del()
    .then(function () {
      return knex('transactions').insert(transactions);
    });
};
