import { IsArray, IsIn, IsNotEmpty, IsOptional, IsString, ArrayUnique } from 'class-validator';

const statuses = ['To Do', 'Doing', 'Completed', 'On Hold'];
const priorities = ['No Priority', 'Urgent', 'High', 'Medium', 'Low'];

export class CreateTaskDto {
  @IsString() @IsNotEmpty() title: string;
  @IsOptional() @IsString() description?: string;
  @IsString() @IsIn(statuses) status: string;
  @IsOptional() @IsString() @IsIn(priorities) priority?: string;
  @IsOptional() @IsString() member?: string;
  @IsOptional() @IsString() reporter?: string;
  @IsOptional() @IsString() dueDate?: string;
  @IsOptional() @IsString() projectId?: string;
  @IsOptional() @IsArray() @ArrayUnique() @IsString({ each: true }) labels?: string[];
  @IsOptional() @IsArray() subtasks?: any[];
  @IsOptional() @IsArray() comments?: any[];
}

export class UpdateTaskDto {
  @IsOptional() @IsString() @IsNotEmpty() title?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() @IsIn(statuses) status?: string;
  @IsOptional() @IsString() @IsIn(priorities) priority?: string;
  @IsOptional() @IsString() member?: string;
  @IsOptional() @IsString() reporter?: string;
  @IsOptional() @IsString() dueDate?: string;
  @IsOptional() @IsString() projectId?: string;
  @IsOptional() @IsArray() @ArrayUnique() @IsString({ each: true }) labels?: string[];
  @IsOptional() @IsArray() subtasks?: any[];
  @IsOptional() @IsArray() comments?: any[];
}

export class CommentDto { @IsString() @IsNotEmpty() body: string; @IsOptional() @IsString() author?: string; }
export class SubtaskDto { @IsString() @IsNotEmpty() title: string; @IsOptional() @IsString() @IsIn(priorities) priority?: string; @IsOptional() @IsString() member?: string; @IsOptional() @IsString() dueDate?: string; }
