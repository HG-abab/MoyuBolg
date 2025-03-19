import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { CreatePhotoDto, DeletePhotoOrAlbumDto, PhotoQueryDto, UpdateAlbumDto } from './dto/photo.dto';
import { Photo } from './entities/photo.entity';
@Controller('photo')
export class PhotoController {
  constructor(private readonly photoService: PhotoService) { }

  // 查询分页数据
  @Post('/back/list')
  async findPhotoList(@Body() PhotoQueryDto: PhotoQueryDto): Promise<{ items: Photo[], total: number }> {
    return this.photoService.findPhotoList(PhotoQueryDto);
  }

  // 创建
  @Post('/album/create')
  async createPhoto(@Body() CreatePhotoDto: CreatePhotoDto): Promise<Photo> {
    return this.photoService.createPhoto(CreatePhotoDto);
  }

  // 修改
  @Put('/album/update')
  async updateAlbum(@Body() UpdateAlbumDto: UpdateAlbumDto): Promise<Photo> {
    return this.photoService.updateAlbum(UpdateAlbumDto);
  }

  // 删除
  @Delete('/album/delete')
  async deleteAlbum(@Body() deletePhotoOrAlbumDto: DeletePhotoOrAlbumDto): Promise<Photo | null> {
    return this.photoService.deletePhotoOrAlbum(deletePhotoOrAlbumDto);
  }

  // 文件夹id 返回文件夹下第一个照片的url 没有返回空
  @Get('/album/firstPhoto/:id')
  async findFirstPhotoUrl(@Param('id') id: number): Promise<string> {
    return this.photoService.getFirstPhotoUrlByAlbumId(id);
  }

}
