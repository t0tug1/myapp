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
    pgm.createTable('users', {
        // user_id: INT, 主キー, 自動インクリメント
        user_id: {
            type: 'serial',
            primaryKey: true,
        },
        // user_name: VARCHA, NOT NULL
        user_name: {
            type: 'varchar',
            notNull: true,
        },
        // password_hash: VARCHA(255), NOT NULL
        password_hash: {
            type: 'varchar(255)',
            notNull: true,
        },
        // created_at: TIMESTAMP, NOT NULL, デフォルト値は現在時刻
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        // updated_at: TIMESTAMP
        updated_at: {
            type: 'timestamp',
        },
    });

    // updated_at を自動更新するための関数を作成
    pgm.createFunction(
        'set_updated_at',
        [], // 引数なし
        {
            returns: 'trigger',
            language: 'plpgsql',
        },
        `
        BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
        END;
        `
    );

    // 作成した関数を users テーブルの UPDATE 操作に紐づけるトリガーを作成
    // user_name または password_hash の変更時に発火
    pgm.createTrigger(
        'users',
        'set_updated_at_trigger',
        {
            when: 'BEFORE', // 更新前
            operation: 'UPDATE', // 更新時
            function: 'set_updated_at', // 実行する関数
            columns: ['user_name', 'password_hash'], // 監視対象のカラム
            level: 'ROW', // 行レベル
        }
    );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    // down の処理は、up の処理と逆順で削除していきます。

    // 1. トリガーを削除
    pgm.dropTrigger('users', 'set_updated_at_trigger', {
        operation: 'UPDATE',
    });

    // 2. トリガー関数を削除
    pgm.dropFunction('set_updated_at', []);

    // 3. テーブルを削除
    pgm.dropTable('users');
};
