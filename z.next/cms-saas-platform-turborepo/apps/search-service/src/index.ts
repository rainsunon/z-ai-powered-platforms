import { startService } from '@cms/server';
import { createDatabase } from '@cms/database';
import { initCache } from '@cms/cache';
import { getEventBus, EventType } from '@cms/messaging';
import { searchRoutes } from './routes';
import { initElasticsearch, indexContent, removeContentIndex } from './elasticsearch';

startService({
  name: 'search-service',
  prefix: '/search',
  port: 3009,
  routes: searchRoutes,
  setup: async (_app, config) => {
    createDatabase(config.database);
    await initCache(config.redis);
    await initElasticsearch(config.elastic);

    const eventBus = getEventBus();
    eventBus.subscribe(EventType.CONTENT_PUBLISHED, async (event) => {
      try {
        await indexContent(event.data);
      } catch (err) {
        console.error({ err, event }, 'Failed to index content');
      }
    });

    eventBus.subscribe(EventType.CONTENT_DELETED, async (event) => {
      try {
        await removeContentIndex(event.data.contentId);
      } catch (err) {
        console.error({ err, event }, 'Failed to remove content from index');
      }
    });
  },
}).catch((err) => { console.error('Failed to start search service:', err); process.exit(1); });
