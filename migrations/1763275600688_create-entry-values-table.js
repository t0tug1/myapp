/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.createTable('entry_values', {
        // entry_id: INT, 主キー, 自動インクリメント
        entry_id: {
            type: 'serial',
            primaryKey: true,
        },
        // user_id: 外部キー
        user_id: {
            type: 'integer',
            notNull: true,
            references: 'users(user_id)',
            onDelete: 'CASCADE'
        },
        // item_id: 外部キー
        item_id: {
            type: 'integer',
            notNull: true,
            references: 'items(item_id)',
            onDelete: 'CASCADE'
        },
        // value_numeric: INT
        value_numeric: {
            type: 'integer',
        },
        // value_time: INT
        value_time: {
            type: 'numeric(4, 2)',
        },
        //value_text: 
        value_text: {
            type: 'text',
        },
        //entry_date
        entry_date: {
            type: 'date',
            notNull: true,
        },
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('entry_values');
};
