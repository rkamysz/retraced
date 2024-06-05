import oracledb, { PoolAttributes } from "oracledb";

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

export class OracleSource {
  private async getPoolConnection() {
    try {
      return await oracledb.getPool().getConnection();
    } catch (err) {
      console.error("Error getting connection from pool", err);
      throw err;
    }
  }

  async initialize(config: PoolAttributes): Promise<oracledb.Connection> {
    try {
      await oracledb.createPool(config);
      console.log("Connection pool started");
      return this.getPoolConnection();
    } catch (err) {
      console.error("Initialization failed", err);
    }
  }

  async close() {
    try {
      await oracledb.getPool().close();
      console.log("Connection pool closed");
    } catch (err) {
      console.error("Error closing pool", err);
    }
  }
}
