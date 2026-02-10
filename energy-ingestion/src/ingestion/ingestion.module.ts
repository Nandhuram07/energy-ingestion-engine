import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
    MeterHistory,
    MeterLive,
    VehicleHistory,
    VehicleLive,
} from '../database/entities';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            MeterHistory,
            MeterLive,
            VehicleHistory,
            VehicleLive,
        ]),
    ],
    controllers: [IngestionController],
    providers: [IngestionService],
})
export class IngestionModule { }
