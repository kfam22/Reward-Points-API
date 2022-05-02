/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
 const transactions = [
  { payer: 'TARGET', points: 100},
  { payer: 'WALMART', points: 1000},
  { payer: 'AMAZON', points: 400},
  { payer: 'TRADER JOES', points: 100},
  { payer: 'TARGET', points: 100},
  { payer: 'WALMART', points: 200}
]

exports.transactions = transactions

exports.seed = function(knex) {
  return knex('transactions').del()
    .then(function () {
      return knex('transactions').insert(transactions);
    });
};
