import winston from 'winston';

const LOG_LEVEL=process.env.LOG_LEVEL || 'info';

export const logger = winston.createLogger({
    level: LOG_LEVEL,
    format: winston.format.json(),
    transports: [new winston.transports.Console()],
});
