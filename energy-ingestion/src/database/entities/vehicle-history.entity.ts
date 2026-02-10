import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('vehicle_history')
@Index(['vehicleId', 'timestamp'])
export class VehicleHistory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'vehicle_id' })
    vehicleId: string;

    @Column({ type: 'int' })
    soc: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, name: 'kwh_delivered_dc' })
    kwhDeliveredDc: number;

    @Column({ type: 'decimal', precision: 5, scale: 2, name: 'battery_temp' })
    batteryTemp: number;

    @Column({ type: 'timestamp' })
    timestamp: Date;
}
