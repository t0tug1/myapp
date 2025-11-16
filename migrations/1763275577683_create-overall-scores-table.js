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
    pgm.createTable('overall_scores', {
        // overall_id: INT, 主キー, 自動インクリメント
        overall_id: {
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
        // overall_score: VARCHA(15), NOT NULL
        overall_score: {
            type: 'integer',
            notNull: true,
        },
        //overall_date: date, NOT NULL
        overall_date: {
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
    pgm.dropTable('overall_scores');
};
