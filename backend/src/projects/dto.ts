import { IsHexColor, IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
const priorities = ['No Priority','Urgent','High','Medium','Low'];
export class CreateProjectDto {
  @IsString() @IsNotEmpty() @MaxLength(80) name: string;
  @IsString() @IsHexColor() color: string;
  @IsOptional() @IsString() @MaxLength(300) description?: string;
  @IsOptional() @IsString() lead?: string;
  @IsOptional() @IsString() @IsIn(priorities) priority?: string;
  @IsOptional() @IsString() dueDate?: string;
}
export class UpdateProjectDto {
  @IsOptional() @IsString() @IsNotEmpty() @MaxLength(80) name?: string;
  @IsOptional() @IsString() @IsHexColor() color?: string;
  @IsOptional() @IsString() @MaxLength(300) description?: string;
  @IsOptional() @IsString() lead?: string;
  @IsOptional() @IsString() @IsIn(priorities) priority?: string;
  @IsOptional() @IsString() dueDate?: string;
}
