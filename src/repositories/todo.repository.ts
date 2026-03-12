// Types
export interface Todo {
  title: string;
  description?: string;
  completed: boolean;
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  userId?: string;
  dueDate?: Date;
  completedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  lastNotified?: Date;
  isNotified?: boolean;

  // id              String    @id @default(cuid())
  // title           String    @db.VarChar(255)
  // description     String?   @db.Text
  // completed       Boolean   @default(false)
  // priority        Priority  @default(MEDIUM)

  // dueDate         DateTime?
  // completedAt     DateTime?
  // createdAt       DateTime  @default(now())
  // updatedAt       DateTime  @updatedAt @default(now())
  // lastNotifiedAt  DateTime?
  // isNotified      Boolean   @default(false)

  // user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  // userId          String
}
export interface TodoRepo {}

// Todo repository
export function createTodoRepository() {}
