import {sql} from "drizzle-orm";
import {integer,sqliteTable,text} from "drizzle-orm/sqlite-core";

export const contactMessages=sqliteTable("contact_messages",{
  id:integer("id").primaryKey({autoIncrement:true}),
  name:text("name").notNull(),
  email:text("email").notNull(),
  category:text("category").notNull(),
  subject:text("subject").notNull(),
  message:text("message").notNull(),
  createdAt:text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
