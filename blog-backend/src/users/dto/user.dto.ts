import { IsBoolean, IsNotEmpty, IsNumber } from "class-validator";

export class isCheckedUserDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsBoolean()
  @IsNotEmpty()
  isChecked: boolean;
}


// 通过id查找
export class findUserByIdDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}


export class UserDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  copy: string;

  @IsNotEmpty()
  webmasterProfileBackground: string;

  @IsNotEmpty()
  githubLink?: string;

  @IsNotEmpty()
  giteeLink?: string;

  @IsNotEmpty()
  avatar: string;
}