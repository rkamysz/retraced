import oracledb from "oracledb";

export type CategoryOracleModel = {
  ID: string;
  NAME: string;
  PARENT_ID: string | null;
};

export interface CategoryNodeOracleModel extends CategoryOracleModel {
  CHILDREN: CategoryOracleModel[];
}

export class CategoriesOracle {
  constructor(private source: oracledb.Connection) {}

  async countCategories(categoryId?: number) {
    let sql;
    const binds = {};

    if (categoryId) {
      sql = `SELECT COUNT(*) AS count FROM categories WHERE parent_id = :categoryId`;
      binds["categoryId"] = categoryId;
    } else {
      sql = `SELECT COUNT(*) AS count FROM categories WHERE parent_id IS NULL`;
    }

    const result = await this.source.execute<{ COUNT: number }>(sql, binds, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });
    return result.rows[0].COUNT;
  }
}
