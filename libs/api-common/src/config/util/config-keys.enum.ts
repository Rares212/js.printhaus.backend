export const CONFIG_KEYS = {
    DB: {
        MONGODB_URI: 'MONGODB_URI'
    },
    AWS_S3: {
        ACCESS_KEY: 'AWS_ACCESS_KEY',
        SECRET_ACCESS_KEY: 'AWS_SECRET_ACCESS_KEY',
        MODEL_BUCKET_NAME: 'AWS_MODEL_BUCKET_NAME',
        IMAGE_BUCKET_NAME: 'AWS_IMAGE_BUCKET_NAME',
        REGION: 'AWS_REGION'
    },
    ADMIN: {
        ADMIN_USERNAME: 'ADMIN_USERNAME',
        ADMIN_PASSWORD: 'ADMIN_PASSWORD',
        ADMIN_COOKIE_NAME: 'ADMIN_COOKIE_NAME',
        ADMIN_COOKIE_PASSWORD: 'ADMIN_COOKIE_PASSWORD',
        ADMIN_SECRET: 'ADMIN_SECRET'
    },
    IMAGE: {
        MAX_IMAGE_SIZE_MB: 'MAX_IMAGE_SIZE_MB',
        THUMBNAIL_SIZE_PX: 'THUMBNAIL_SIZE_PX'
    },
    MESH: {
        CACHE_MESHES: 'CACHE_MESHES'
    },
    CURRENCY: {
        EXCHANGE_RATE_API_KEY: 'EXCHANGE_RATE_API_KEY'
    },
    AUTH: {
        ISSUER: 'AUTH_ISSUER',
        AUDIENCE: 'AUTH_AUDIENCE',
        ALGORITHM: 'AUTH_ALGORITHM'
    }
};