import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
    MeterHistory,
    MeterLive,
    VehicleHistory,
    VehicleLive,
} from '../database/entities';
import { MeterTelemetryDto, VehicleTelemetryDto } from './dto/telemetry.dto';

@Injectable()
export class IngestionService {
    constructor(
        @InjectRepository(MeterHistory)
        private meterHistoryRepo: Repository<MeterHistory>,
        @InjectRepository(MeterLive)
        private meterLiveRepo: Repository<MeterLive>,
        @InjectRepository(VehicleHistory)
        private vehicleHistoryRepo: Repository<VehicleHistory>,
        @InjectRepository(VehicleLive)
        private vehicleLiveRepo: Repository<VehicleLive>,
    ) { }

    async ingestMeterData(data: MeterTelemetryDto) {
        const timestamp = new Date(data.timestamp);

        // Insert into history table
        const historyRecord = this.meterHistoryRepo.create({
            meterId: data.meterId,
            kwhConsumedAc: data.kwhConsumedAc,
            voltage: data.voltage,
            timestamp,
        });
        await this.meterHistoryRepo.save(historyRecord);

        // Upsert into live table
        await this.meterLiveRepo.save({
            meterId: data.meterId,
            kwhConsumedAc: data.kwhConsumedAc,
            voltage: data.voltage,
            lastUpdated: timestamp,
        });

        return { success: true, message: 'Meter data ingested successfully' };
    }

    async ingestVehicleData(data: VehicleTelemetryDto) {
        const timestamp = new Date(data.timestamp);

        // Insert into history table
        const historyRecord = this.vehicleHistoryRepo.create({
            vehicleId: data.vehicleId,
            soc: data.soc,
            kwhDeliveredDc: data.kwhDeliveredDc,
            batteryTemp: data.batteryTemp,
            timestamp,
        });
        await this.vehicleHistoryRepo.save(historyRecord);

        // Upsert into live table
        await this.vehicleLiveRepo.save({
            vehicleId: data.vehicleId,
            soc: data.soc,
            kwhDeliveredDc: data.kwhDeliveredDc,
            batteryTemp: data.batteryTemp,
            lastUpdated: timestamp,
        });

        return { success: true, message: 'Vehicle data ingested successfully' };
    }
}
