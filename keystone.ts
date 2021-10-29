import { config } from '@keystone-next/keystone';
import { statelessSessions } from '@keystone-next/keystone/session';

import { lists } from './schema';
import { withAuth, sessionSecret } from './auth';
import cors  from 'cors';



let sessionMaxAge = 60 * 60 * 24 * 30; // 30 days

const session = statelessSessions({
  maxAge: sessionMaxAge,
  secret: sessionSecret!,
});

export default withAuth(
  config({
    db: {
      provider: 'sqlite',
      url: process.env.DATABASE_URL || 'file:./keystone.db',
    },
    ui: {
      isAccessAllowed: (context) => !!context.session?.data,
    },
    lists,
    session,
    server : {
      cors: { origin: ['*'], credentials: false },
      port: 5000,
      maxFileSize: 200 * 1024 * 1024,
      healthCheck: true,
     // extendExpressApp: (app, createContext) => { /* ... */ },
    }, 
    images: {
      upload: 'local',
      local: {
        storagePath: 'public/images',
        baseUrl: '/images',
      },
 
    },
    files: {
      upload: 'local',
      local: {
        storagePath: 'public/files',
        baseUrl: '/files',
      },
    }
  })
);

