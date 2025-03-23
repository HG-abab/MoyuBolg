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
