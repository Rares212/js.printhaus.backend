import { HttpException, Injectable } from "@nestjs/common";
import { ImageInfoService } from "@haus/api-common/image-info/services/image-info/image-info.service";
import { ModelInfoService } from "@haus/api-common/model-info/services/model-info/model-info.service";
import { ShopItemRepo } from "@haus/db-common/shop-item/repo/shop-item.repo";
import { ImageInfoRespDto, ShopItemDto } from "@printhaus/common";
import { Mapper } from "@automapper/core";
import { ShopItem } from "@haus/db-common/shop-item/model/shop.item";
import { UserRatingService } from "../user-rating/user-rating.service";
import { InjectMapper } from "@automapper/nestjs";
import { Types } from "mongoose";
import { PrintMaterialService } from "../../../printing/services/print-material/print-material.service";

@Injectable()
export class ShopItemService {
    constructor(private readonly shopItemRepo: ShopItemRepo,
                private readonly imageInfoService: ImageInfoService,
                private readonly modelInfoService: ModelInfoService,
                private readonly ratingService: UserRatingService,
                private readonly materialService: PrintMaterialService,
                @InjectMapper() private readonly mapper: Mapper) {}

    public async getShopItemList(): Promise<ShopItemDto[]> {
        const shopItems = await this.shopItemRepo.findAll();

        let shopItemDtoList: ShopItemDto[] = [];
        for (let shopItem of shopItems) {
            const mainPhoto: ImageInfoRespDto = await this.imageInfoService.getImageInfo(new Types.ObjectId(shopItem.mainPhoto.id));
            const galleryPhotos: ImageInfoRespDto[] = await Promise.all(shopItem.galleryPhotos.map((photo) => {
                return this.imageInfoService.getImageInfo(new Types.ObjectId(photo.id));
            }));
            const modelFileUrl = await this.modelInfoService.getModelSignedUrl(new Types.ObjectId(shopItem.modelFile.id));

            const ratingResult = await this.ratingService.getRating(new Types.ObjectId(shopItem.id));

            const materialDto = await this.materialService.getMaterial(new Types.ObjectId(shopItem.material.id));

            const shopItemDto = this.mapper.map(shopItem, ShopItem, ShopItemDto);
            shopItemDto.mainPhoto = mainPhoto;
            shopItemDto.galleryPhotos = galleryPhotos;
            shopItemDto.modelFileUrl = modelFileUrl;
            shopItemDto.reviewValue = ratingResult.averageRating;
            shopItemDto.reviewCount = ratingResult.count;
            shopItemDto.material = materialDto;

            shopItemDtoList.push(shopItemDto);
        }

        return shopItemDtoList;
    }
}
