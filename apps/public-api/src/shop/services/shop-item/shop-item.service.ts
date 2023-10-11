import { Inject, Injectable, Logger } from '@nestjs/common';
import { ImageInfoService } from '@haus/api-common/image-info/services/image-info/image-info.service';
import { ModelInfoService } from '@haus/api-common/model-info/services/model-info/model-info.service';
import { ShopItemRepo } from '@haus/db-common/shop-item/repo/shop-item.repo';
import { ImageInfoRespDto, ModelInfoRespDto, PaginatedRequestDto, ShopItemDto } from "@printhaus/common";
import { Mapper } from '@automapper/core';
import { ShopItem } from '@haus/db-common/shop-item/model/shop.item';
import { UserRatingService } from '../user-rating/user-rating.service';
import { InjectMapper } from '@automapper/nestjs';
import { Types } from 'mongoose';
import { PrintMaterialService } from '../../../printing/services/print-material/print-material.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ShopItemService {
    private SHOP_ITEM_TTL_MS = 1000 * 60 * 60;
    private MODEL_INFO_URL_TTL_MS = 1000 * 60 * 60;
    private MODEL_INFO_CACHE_TTL_MS = 1000 * 60 * 59;

    private logger = new Logger(ShopItemService.name);

    constructor(
        private readonly shopItemRepo: ShopItemRepo,
        private readonly imageInfoService: ImageInfoService,
        private readonly modelInfoService: ModelInfoService,
        private readonly ratingService: UserRatingService,
        private readonly materialService: PrintMaterialService,
        @InjectMapper() private readonly mapper: Mapper,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}

    public async getShopItemList(pagination: PaginatedRequestDto): Promise<ShopItemDto[]> {
        const cacheKey = `shopItems-${JSON.stringify(pagination)}`;
        const cachedData = await this.cacheManager.get<ShopItemDto[]>(cacheKey);

        if (cachedData) {
            return cachedData;
        }

        const shopItems = await this.shopItemRepo.findAll(pagination);

        let shopItemDtoList: ShopItemDto[] = [];
        for (let shopItem of shopItems) {
            const mainPhoto: ImageInfoRespDto = await this.imageInfoService.getImageInfo(
                new Types.ObjectId(shopItem.mainPhoto.id)
            );
            const galleryPhotos: ImageInfoRespDto[] = await Promise.all(
                shopItem.galleryPhotos.map((photo) => {
                    return this.imageInfoService.getImageInfo(new Types.ObjectId(photo.id));
                })
            );

            const ratingResult = await this.ratingService.getRating(new Types.ObjectId(shopItem.id));

            const materialDto = await this.materialService.getMaterial(new Types.ObjectId(shopItem.material.id));

            const shopItemDto = this.mapper.map(shopItem, ShopItem, ShopItemDto);
            shopItemDto.mainPhoto = mainPhoto;
            shopItemDto.galleryPhotos = galleryPhotos;
            shopItemDto.reviewValue = ratingResult.averageRating;
            shopItemDto.reviewCount = ratingResult.count;
            shopItemDto.material = materialDto;

            shopItemDtoList.push(shopItemDto);
        }

        this.cacheManager.set(cacheKey, shopItemDtoList, this.SHOP_ITEM_TTL_MS).catch((err) => this.logger.error(err));

        return shopItemDtoList;
    }

    public async getShopItemCount(): Promise<number> {
        return this.shopItemRepo.count();
    }

    public async getShopItemModelUrl(id: string | Types.ObjectId): Promise<ModelInfoRespDto> {
        const cacheKey = `shopItemModelUrl-${id}`;
        const cachedData = await this.cacheManager.get<ModelInfoRespDto>(cacheKey);
        if (cachedData) {
            return cachedData;
        }

        const modelInfoDto = await this.modelInfoService.getModelSignedUrl(
            await this.shopItemRepo.getModelInfoId(id),
            this.MODEL_INFO_URL_TTL_MS / 1000
        );
        this.cacheManager.set(cacheKey, modelInfoDto, this.MODEL_INFO_CACHE_TTL_MS).catch((err) => this.logger.error(err));
        return modelInfoDto;
    }
}
