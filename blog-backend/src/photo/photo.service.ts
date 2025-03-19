import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Photo } from './entities/photo.entity';
import { IsNull, Repository } from 'typeorm';
import { CreatePhotoDto, DeletePhotoOrAlbumDto, PhotoQueryDto, UpdateAlbumDto } from './dto/photo.dto';

@Injectable()
export class PhotoService {
  constructor(
    @InjectRepository(Photo) private readonly photoRepository: Repository<Photo>,
  ) { }

  // 查询分页数据
  async findPhotoList(PhotoQueryDto: PhotoQueryDto): Promise<{ items: Photo[], total: number }> {
    const { pageNum, pageSize, parentId } = PhotoQueryDto;

    // 构建查询条件
    const whereCondition = parentId !== null ? { parentId } : {};  // 如果有 parentId，则使用该条件，否则查询所有数据

    const [items, total] = await this.photoRepository.findAndCount({
      where: whereCondition,   // 根据 parentId 查询或者查询所有数据
      take: pageSize,         // 每页数据条数
      skip: (pageNum - 1) * pageSize,  // 跳过前面页的数据
    });

    if (!items.length) {
      return { items: [], total: 0 };
    }

    return { items, total };
  }

  // 创建
  async createPhoto(createPhotoDto: CreatePhotoDto): Promise<Photo> {
    const maxid = await this.photoRepository.findOne({
      where: {},
      order: { id: 'DESC' },
    })
    const newId = maxid ? maxid.id + 1 : 1;
    const photo = this.photoRepository.create({
      ...createPhotoDto,
      id: newId,
    });  // 根据 DTO 创建 Photo 实体
    return this.photoRepository.save(photo);  // 保存到数据库
  }

  // 编辑
  async updateAlbum(updateAlbumDto: UpdateAlbumDto): Promise<Photo> {
    const { id, name, description } = updateAlbumDto;

    // 查找相册
    const album = await this.photoRepository.findOne({ where: { id } });

    if (!album) {
      throw new NotFoundException('没有找到相册');
    }

    // 更新相册
    album.name = name;
    album.description = description;

    await this.photoRepository.save(album);
    return album;
  }

  async deletePhotoOrAlbum(deletePhotoOrAlbumDto: DeletePhotoOrAlbumDto): Promise<Photo | null> {
    const { id, type, parentId } = deletePhotoOrAlbumDto;
    let deletedItem: Photo | null = null;

    if (type === 1) {
      // 删除相册
      const album = await this.photoRepository.findOne({
        where: { id, type: 1 },
      });

      if (!album) {
        throw new NotFoundException('Album not found');
      }

      // 保存被删除的相册
      deletedItem = album;

      // 递归删除子相册和照片
      await this.deleteAlbumAndChildren(id);
    } else if (type === 2) {
      // 删除照片
      const photo = await this.photoRepository.findOne({
        where: { id, type: 2, parentId: parentId === null ? IsNull() : parentId },
      });

      if (!photo) {
        throw new NotFoundException('Photo not found');
      }

      // 保存被删除的照片
      deletedItem = photo;

      // 删除照片
      await this.photoRepository.remove(photo);
    } else {
      throw new NotFoundException('Invalid type');
    }

    // 返回被删除的数据
    return deletedItem;
  }
  /**
   * 递归删除相册及其子相册和照片
   */
  private async deleteAlbumAndChildren(albumId: number): Promise<Photo[]> {
    const deletedItems: Photo[] = [];

    // 查找所有子相册和照片
    const children = await this.photoRepository.find({
      where: { parentId: albumId },
    });

    // 递归删除子相册和照片
    for (const child of children) {
      if (child.type === 1) {
        // 如果是子相册，递归删除
        const deletedChildren = await this.deleteAlbumAndChildren(child.id);
        deletedItems.push(...deletedChildren);
      }

      // 保存被删除的子项
      deletedItems.push(child);

      // 删除当前子项
      await this.photoRepository.remove(child);
    }

    // 删除当前相册
    const album = await this.photoRepository.findOne({
      where: { id: albumId },
    });
    if (album) {
      deletedItems.push(album);
      await this.photoRepository.remove(album);
    }

    // 返回所有被删除的项
    return deletedItems;
  }

  // 文件夹id 返回文件夹下第一个照片的url 没有返回空
  async getFirstPhotoUrlByAlbumId(albumId: number): Promise<string> {
    // 先确保是文件夹
    const album = await this.photoRepository.findOne({
      where: { id: albumId, type: 1 },
    })
    if (!album) {
      return '';
    }
    // 确保不为空
    const photos = await this.photoRepository.find({
      where: { parentId: albumId },
      order: { id: 'ASC' },
    })
    if (photos.length === 0) {
      return '';
    }
    return photos[0].url;
  }


}
