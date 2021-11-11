import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { Connection, createConnection, getConnectionManager } from 'typeorm';
import { TypeOrmConfig } from '../database/config';

@Injectable()
export class DatabaseMiddleware implements NestMiddleware {
  private exceptRules = [/^\/$/, /^\/migrate*/];

  use = async (req: Request, res: Response, next: NextFunction) => {
    if (this.exceptRules.some((r) => r.test(req.path))) {
      next();
      return;
    }

    const connectionManager = getConnectionManager();
    console.log(
      'Number of connections: ' + connectionManager.connections.length,
    );

    try {
      const connection: Connection = connectionManager.get();

      if (!connection.isConnected) await connection.connect();
    } catch (error) {
      await createConnection(TypeOrmConfig);
    }

    next();
  };
}
