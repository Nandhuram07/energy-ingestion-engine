import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('meter_history')
@Index(['meterId', 'timestamp'])
export class MeterHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'meter_id' })
  meterId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'kwh_consumed_ac' })
  kwhConsumedAc: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  voltage: number;

  @Column({ type: 'timestamp' })
  timestamp: Date;
}
