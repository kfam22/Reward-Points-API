/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = async (knex) => {
    await knex.schema
      .createTable('transactions', (transactions) => {
        transactions.increments('transaction_id')
        transactions.string('payer', 200).notNullable()
        transactions.integer('points').notNullable()
        transactions.timestamp('timestamp', { precision: 6 }).defaultTo(knex.fn.now(6))
      })
  }

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.down = async (knex) => {
    await knex.schema.dropTableIfExists('transactions')
  }
