import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('meter_live')
export class MeterLive {
    @PrimaryColumn({ name: 'meter_id' })
    meterId: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, name: 'kwh_consumed_ac' })
    kwhConsumedAc: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    voltage: number;

    @Column({ type: 'timestamp', name: 'last_updated' })
    lastUpdated: Date;
}
