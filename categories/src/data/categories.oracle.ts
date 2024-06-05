import oracledb from "oracledb";
import { CategoryNode } from "../domain/category";

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

  async getCategories(categoryId?: number): Promise<CategoryNode[]> {
    let sql;
    const binds = {};
    if (categoryId) {
      sql = `SELECT id, name, parent_id FROM appuser.categories START WITH id = :id CONNECT BY PRIOR id = parent_id ORDER SIBLINGS BY name`;
      binds["id"] = categoryId;
    } else {
      sql = `SELECT id, name, parent_id FROM appuser.categories START WITH parent_id IS NULL CONNECT BY PRIOR id = parent_id ORDER SIBLINGS BY name`;
    }
    const result = await this.source.execute<CategoryOracleModel>(sql, binds);

    const nodes = {};
    const rootNodes = [];

    result.rows.forEach((row) => {
      const { ID, NAME, PARENT_ID } = row;
      if (!nodes[ID]) {
        nodes[ID] = { id: ID, name: NAME, children: [] };
      }
      // Set properties for the node
      nodes[ID].name = NAME;

      if (PARENT_ID) {
        if (!nodes[PARENT_ID]) {
          nodes[PARENT_ID] = { id: PARENT_ID, children: [] };
        }
        nodes[PARENT_ID].children.push(nodes[ID]);
      } else {
        rootNodes.push(nodes[ID]);
      }
    });

    return categoryId ? [nodes[categoryId]] : rootNodes;
  }

  // to add a new category
  async addCategory(name: string, parentId: number | null) {
    const result = await this.source.execute<{ id: number }>(
      `INSERT INTO appuser.categories (name, parent_id) VALUES (:name, :parent_id) RETURNING id INTO :id`,
      {
        name,
        parent_id: parentId || null,
        id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      },
      { autoCommit: true }
    );
    return result.outBinds.id;
  }

  // Function to delete a category
  async deleteCategory(id: number, recursive = false) {
    let sql;
    if (recursive) {
      // Recursive delete
      sql = `
        DECLARE
          TYPE NumberTableType IS TABLE OF NUMBER;
          ids_to_delete NumberTableType;
        BEGIN
          SELECT id BULK COLLECT INTO ids_to_delete
          FROM categories
          START WITH id = :id
          CONNECT BY PRIOR id = parent_id;

          FOR i IN 1 .. ids_to_delete.COUNT LOOP
            DELETE FROM categories WHERE id = ids_to_delete(i);
          END LOOP;
          
          COMMIT;
        END;`;
    } else {
      // DELETE FROM categories WHERE id = :id AND NOT EXISTS (SELECT 1 FROM categories c WHERE c.parent_id = :id)
      // Check if the category is a leaf node
      const checkSql = `SELECT 1 FROM categories c WHERE c.parent_id = :id`;
      const check = await this.source.execute<{ CHILD_COUNT: number }>(
        checkSql,
        { id: id },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );

      if (check.rows[0]) {
        throw new Error("Category is not a leaf and cannot be deleted");
      }

      // Delete the category if it's a leaf
      sql = `DELETE FROM categories WHERE id = :id`;
    }

    const result = await this.source.execute(sql, { id }, { autoCommit: true });
    return result.rowsAffected;
  }
}
