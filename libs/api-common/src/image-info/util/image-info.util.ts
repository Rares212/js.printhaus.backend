export const IMAGE_CONSTANTS: Record<string, ImageConstant> = {
    SMALL_IMAGE: {
        WIDTH: 256,
        POSTFIX: '-small'
    },
    MEDIUM_IMAGE: {
        WIDTH: 512,
        POSTFIX: '-medium'
    },
    LARGE_IMAGE: {
        WIDTH: 1024,
        POSTFIX: '-large'
    }
};

interface ImageConstant {
    WIDTH: number;
    POSTFIX: string;
}
