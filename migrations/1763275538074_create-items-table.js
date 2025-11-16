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
    pgm.createTable('items', {
        // item_id: INT, 主キー, 自動インクリメント
        item_id: {
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
        // item_name: VARCHA(15), NOT NULL
        item_name: {
            type: 'varchar(15)',
            notNull: true,
        },
        // group_id: 外部キー
        group_id: {
            type: 'integer',
            notNull: true,
            references: 'item_groups(group_id)',
            onDelete: 'CASCADE'
        },
        // criteria_id: 外部キー
        criteria_id: {
            type: 'integer',
            notNull: true,
            references: 'criteria_groups(criteria_id)',
            onDelete: 'CASCADE'
        },
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('items');
};
