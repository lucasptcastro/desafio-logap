import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const orderStatusEnum = pgEnum("OrderStatus", [
  "PENDING",
  "IN_PREPARATION",
  "FINISHED",
]);
export const consumptionMethodEnum = pgEnum("ConsumptionMethod", [
  "TAKEAWAY",
  "DINE_IN",
]);

export const usersTable = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  roleId: uuid("role_id").references(() => rolesTable.id, {
    onDelete: "restrict",
  }),
});

export const sessionsTable = pgTable("sessions", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
});

export const accountsTable = pgTable("accounts", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verificationsTable = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const rolesTable = pgTable("roles", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const usersRelations = relations(usersTable, ({ one }) => ({
  role: one(rolesTable, {
    fields: [usersTable.roleId],
    references: [rolesTable.id],
  }),
}));

export const restaurant = pgTable("restaurant", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").unique().notNull(),
  description: text("description").notNull(),
  avatarImageUrl: text("avatar_image_url").notNull(),
  coverImageUrl: text("cover_image_url").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const menuCategory = pgTable("menu_category", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  restaurantId: uuid("restaurant_id")
    .notNull()
    .references(() => restaurant.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const product = pgTable("product", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: text("price").notNull(),
  imageUrl: text("image_url").notNull(),
  ingredients: text("ingredients").array().notNull(),
  restaurantId: uuid("restaurant_id")
    .notNull()
    .references(() => restaurant.id, { onDelete: "cascade" }),
  menuCategoryId: uuid("menu_category_id")
    .notNull()
    .references(() => menuCategory.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const order = pgTable("order", {
  id: integer("id").primaryKey(),
  total: text("total").notNull(),
  status: orderStatusEnum("status").notNull(),
  consumptionMethod: consumptionMethodEnum("consumption_method").notNull(),
  restaurantId: uuid("restaurant_id")
    .notNull()
    .references(() => restaurant.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  customerName: text("customer_name").notNull(),
  customerCpf: text("customer_cpf").notNull(),
});

export const orderProduct = pgTable("order_product", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .notNull()
    .references(() => product.id, { onDelete: "cascade" }),
  orderId: integer("order_id")
    .notNull()
    .references(() => order.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull(),
  price: text("price").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const restaurantRelations = relations(restaurant, ({ many }) => ({
  menuCategories: many(menuCategory),
  products: many(product),
  orders: many(order),
}));

export const menuCategoryRelations = relations(
  menuCategory,
  ({ one, many }) => ({
    restaurant: one(restaurant, {
      fields: [menuCategory.restaurantId],
      references: [restaurant.id],
    }),
    products: many(product),
  }),
);

export const productRelations = relations(product, ({ one, many }) => ({
  restaurant: one(restaurant, {
    fields: [product.restaurantId],
    references: [restaurant.id],
  }),
  menuCategory: one(menuCategory, {
    fields: [product.menuCategoryId],
    references: [menuCategory.id],
  }),
  orderProducts: many(orderProduct),
}));

export const orderRelations = relations(order, ({ one, many }) => ({
  restaurant: one(restaurant, {
    fields: [order.restaurantId],
    references: [restaurant.id],
  }),
  orderProducts: many(orderProduct),
}));

export const orderProductRelations = relations(orderProduct, ({ one }) => ({
  product: one(product, {
    fields: [orderProduct.productId],
    references: [product.id],
  }),
  order: one(order, {
    fields: [orderProduct.orderId],
    references: [order.id],
  }),
}));
