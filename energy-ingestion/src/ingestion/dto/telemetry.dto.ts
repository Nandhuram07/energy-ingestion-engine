import { IsString, IsNumber, IsDateString, IsIn } from 'class-validator';

export class MeterTelemetryDto {
    @IsString()
    @IsIn(['meter'])
    type: 'meter';

    @IsString()
    meterId: string;

    @IsNumber()
    kwhConsumedAc: number;

    @IsNumber()
    voltage: number;

    @IsDateString()
    timestamp: string;
}

export class VehicleTelemetryDto {
    @IsString()
    @IsIn(['vehicle'])
    type: 'vehicle';

    @IsString()
    vehicleId: string;

    @IsNumber()
    soc: number;

    @IsNumber()
    kwhDeliveredDc: number;

    @IsNumber()
    batteryTemp: number;

    @IsDateString()
    timestamp: string;
}

export type TelemetryDto = MeterTelemetryDto | VehicleTelemetryDto;
