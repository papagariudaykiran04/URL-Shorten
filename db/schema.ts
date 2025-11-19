// db/schema.ts
import { pgTable, uuid, varchar, text, integer, timestamp } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

export const links = pgTable('links', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  code: varchar('code', { length: 16 }).notNull().unique(),
  url: text('url').notNull(),
  clicks: integer('clicks').default(0),
  lastClickedAt: timestamp('last_clicked_at', { withTimezone: false }),
  createdAt: timestamp('created_at', { withTimezone: false }).defaultNow().notNull(),
})
