import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CommentDto, CreateTaskDto, SubtaskDto, UpdateTaskDto } from './dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly service: TasksService) {}
  @Get() findAll() { return this.service.findAll(); }
  @Post() create(@Body() dto: CreateTaskDto) { return this.service.create(dto); }
  @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateTaskDto) { return this.service.update(id, dto); }
  @Delete(':id') remove(@Param('id') id: string) { return this.service.remove(id); }
  @Post(':id/comments') comment(@Param('id') id: string, @Body() dto: CommentDto) { return this.service.comment(id, dto); }
  @Post(':id/subtasks') subtask(@Param('id') id: string, @Body() dto: SubtaskDto) { return this.service.subtask(id, dto); }
}
