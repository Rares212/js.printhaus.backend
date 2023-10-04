import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, mapFrom, Mapper, MappingProfile } from '@automapper/core';
import { PrintDimensionsDto, ShopItemDto } from '@printhaus/common';
import { ShopItem } from '@haus/db-common/shop-item/model/shop.item';

export class ShopItemProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    get profile(): MappingProfile {
        return (mapper) => {
            createMap(
                mapper,
                ShopItem,
                ShopItemDto,
                forMember(
                    (dest) => dest.id,
                    mapFrom((src) => src.id)
                ),
                forMember(
                    (dest) => dest.dimensions,
                    mapFrom((src) => new PrintDimensionsDto(src.width, src.height, src.depth))
                )
            );
        };
    }
}
