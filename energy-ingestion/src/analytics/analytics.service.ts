import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MeterHistory, VehicleHistory } from '../database/entities';

@Injectable()
export class AnalyticsService {
    constructor(
        @InjectRepository(MeterHistory)
        private meterHistoryRepo: Repository<MeterHistory>,
        @InjectRepository(VehicleHistory)
        private vehicleHistoryRepo: Repository<VehicleHistory>,
    ) { }

    async getVehiclePerformance(vehicleId: string) {
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

        // Get vehicle data for last 24 hours
        const vehicleData = await this.vehicleHistoryRepo
            .createQueryBuilder('vehicle')
            .select('SUM(vehicle.kwhDeliveredDc)', 'totalDc')
            .addSelect('AVG(vehicle.batteryTemp)', 'avgTemp')
            .addSelect('COUNT(*)', 'recordCount')
            .where('vehicle.vehicleId = :vehicleId', { vehicleId })
            .andWhere('vehicle.timestamp > :since', { since: twentyFourHoursAgo })
            .getRawOne();

        if (!vehicleData || vehicleData.recordCount === '0') {
            throw new NotFoundException(
                `No data found for vehicle ${vehicleId} in the last 24 hours`,
            );
        }

        // Get meter data for last 24 hours (assuming meter and vehicle are linked)
        // For this demo, we'll use a simple approach - in production, you'd have a proper linking mechanism
        const meterData = await this.meterHistoryRepo
            .createQueryBuilder('meter')
            .select('SUM(meter.kwhConsumedAc)', 'totalAc')
            .where('meter.timestamp > :since', { since: twentyFourHoursAgo })
            .getRawOne();

        const totalDc = parseFloat(vehicleData.totalDc) || 0;
        const totalAc = parseFloat(meterData.totalAc) || 0;
        const avgTemp = parseFloat(vehicleData.avgTemp) || 0;
        const efficiency = totalAc > 0 ? (totalDc / totalAc) * 100 : 0;

        return {
            vehicleId,
            period: '24 hours',
            metrics: {
                totalAcConsumed: totalAc.toFixed(2),
                totalDcDelivered: totalDc.toFixed(2),
                efficiency: efficiency.toFixed(2) + '%',
                averageBatteryTemp: avgTemp.toFixed(2),
            },
        };
    }
}
