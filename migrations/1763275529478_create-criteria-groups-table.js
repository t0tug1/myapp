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
    pgm.createTable('criteria_groups', {
        // criteria_id:  INT, 主キー, 自動インクリメント
        criteria_id: {
            type: 'serial',
            primaryKey: true,
        },

        // criteria_name: TEXT, NOT NULL
        criteria_name: {
            type: 'text',
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
    pgm.dropTable('criteria_groups');
};
